#!/usr/bin/env python3
"""
IG Code Log Analyzer & 7-Day Predictor (UTC)
============================================

Usage:
    python ig_analyzer_predictor.py --csv utc_log.csv --horizon_days 7 --slot_minutes 30 --make_plots

Input CSV format (header required):
    timestamp_utc,value
    2025-10-27 02:28,$5
    2025-10-28 21:36,$5
    ...

Notes:
- timestamps must be UTC (no timezone conversion is done here).
- value may be "$5", "$10", "Unknown" (Unknown excluded for value prediction).
- The script prints summaries, trains simple models, and writes predictions to CSV/TXT.
- Optional: --make_plots to generate hour-of-day and day-of-week charts (matplotlib).
  (One chart per figure, no custom colors/styles set.)

Dependencies:
    pip install pandas numpy scikit-learn python-dateutil matplotlib
"""
from __future__ import annotations

import argparse
import math
import os
from dataclasses import dataclass
from typing import Optional, Tuple

import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone

from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Only import matplotlib if requested (to avoid GUI dependency for headless runs)
def lazy_import_matplotlib():
    import matplotlib.pyplot as plt  # noqa: F401
    return __import__("matplotlib.pyplot")

UTC = timezone.utc


# -----------------------------
# Parsing / Cleaning
# -----------------------------
def parse_money(x: str) -> float:
    if x is None or (isinstance(x, float) and math.isnan(x)):
        return float("nan")
    s = str(x).strip().replace("$", "").strip()
    if s.lower() == "unknown" or s == "":
        return float("nan")
    try:
        return float(s)
    except Exception:
        return float("nan")


def coerce_timestamp_utc(s: str) -> Optional[datetime]:
    if pd.isna(s):
        return None
    s = str(s).strip().replace("T", " ")
    try:
        if s.endswith("Z"):
            s = s[:-1]
            dt = datetime.fromisoformat(s)
            return dt.replace(tzinfo=UTC)
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=UTC)
        else:
            dt = dt.astimezone(UTC)
        return dt
    except Exception:
        return None


def load_events(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    required = {"timestamp_utc", "value"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing required column(s): {', '.join(sorted(missing))}")
    df["timestamp_utc"] = df["timestamp_utc"].apply(coerce_timestamp_utc)
    df = df.dropna(subset=["timestamp_utc"]).sort_values("timestamp_utc").reset_index(drop=True)
    df["value_num"] = df["value"].apply(parse_money)
    # Deduplicate identical timestamps (keep first)
    df = df.drop_duplicates(subset=["timestamp_utc"], keep="first").reset_index(drop=True)
    # Add parts
    df["dow"] = df["timestamp_utc"].dt.weekday  # 0=Mon
    df["hour"] = df["timestamp_utc"].dt.hour
    df["minute"] = df["timestamp_utc"].dt.minute
    df["prev_ts"] = df["timestamp_utc"].shift(1)
    df["gap_hours"] = (df["timestamp_utc"] - df["prev_ts"]).dt.total_seconds() / 3600.0
    return df


# -----------------------------
# Feature Engineering
# -----------------------------
def time_features(dt: datetime) -> dict:
    hour = dt.hour + dt.minute/60.0
    dow = dt.weekday()
    dom = dt.day
    month = dt.month
    return {
        "hour": hour,
        "sin_hour": math.sin(2*math.pi*hour/24.0),
        "cos_hour": math.cos(2*math.pi*hour/24.0),
        "dow": dow,
        "sin_dow": math.sin(2*math.pi*dow/7.0),
        "cos_dow": math.cos(2*math.pi*dow/7.0),
        "dom": dom,
        "sin_dom": math.sin(2*math.pi*dom/31.0),
        "cos_dom": math.cos(2*math.pi*dom/31.0),
        "month": month,
        "sin_month": math.sin(2*math.pi*month/12.0),
        "cos_month": math.cos(2*math.pi*month/12.0),
    }


def ensure_slot_floor(dt: datetime, slot_minutes: int) -> datetime:
    minute = (dt.minute // slot_minutes) * slot_minutes
    return dt.replace(minute=minute, second=0, microsecond=0)


def build_slot_grid(start: datetime, end: datetime, slot_minutes: int) -> pd.DataFrame:
    times = []
    cur = start
    while cur <= end:
        times.append(cur)
        cur += timedelta(minutes=slot_minutes)
    return pd.DataFrame({"slot_start": times})


def label_slots(slots: pd.DataFrame, events: pd.DataFrame, slot_minutes: int) -> pd.DataFrame:
    # Positive if an event occurs within that exact slot window [slot_start, slot_start+slot_minutes)
    df = slots.copy()
    df["slot_end"] = df["slot_start"] + timedelta(minutes=slot_minutes)
    # Map each event to its floored slot
    ev = events.copy()
    ev["slot_start"] = ev["timestamp_utc"].apply(lambda d: ensure_slot_floor(d, slot_minutes))
    hits = ev["slot_start"].value_counts()
    df["y_drop"] = df["slot_start"].map(hits).fillna(0).astype(int)
    # one-hot/indicator: collapse to 1 for any hit
    df["y_drop"] = (df["y_drop"] > 0).astype(int)
    # Features
    fdicts = [time_features(t) for t in df["slot_start"]]
    fdf = pd.DataFrame(fdicts, index=df.index)
    df = pd.concat([df, fdf], axis=1)
    return df[["slot_start", "y_drop"] + list(fdf.columns)]


def value_training_frame(events: pd.DataFrame) -> pd.DataFrame:
    # Only rows with known value
    have_val = events[events["value_num"].notna()].copy()
    if have_val.empty:
        return have_val
    fdicts = [time_features(t) for t in have_val["timestamp_utc"]]
    fdf = pd.DataFrame(fdicts, index=have_val.index)
    have_val = pd.concat([have_val[["timestamp_utc","value_num"]], fdf], axis=1)
    # Target: 1 for $10, 0 for $5 (others NaN are excluded)
    have_val = have_val[(have_val["value_num"] == 5.0) | (have_val["value_num"] == 10.0)].copy()
    have_val["y_is_10"] = (have_val["value_num"] == 10.0).astype(int)
    return have_val


# -----------------------------
# Modeling
# -----------------------------
def train_drop_model(slot_df: pd.DataFrame) -> Pipeline:
    X = slot_df.drop(columns=["slot_start", "y_drop"]).values
    y = slot_df["y_drop"].values
    # Simple/robust pipeline
    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=200, n_jobs=None))
    ])
    pipe.fit(X, y)
    return pipe


def train_value_model(val_df: pd.DataFrame) -> Optional[Pipeline]:
    if val_df.empty:
        return None
    X = val_df.drop(columns=["timestamp_utc", "value_num", "y_is_10"]).values
    y = val_df["y_is_10"].values
    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=200, n_jobs=None))
    ])
    pipe.fit(X, y)
    return pipe


def predict_future(events: pd.DataFrame, drop_pipe: Pipeline, value_pipe: Optional[Pipeline],
                   horizon_days: int, slot_minutes: int) -> pd.DataFrame:
    last_ts = events["timestamp_utc"].max().astimezone(UTC)
    start = ensure_slot_floor(last_ts + timedelta(minutes=slot_minutes), slot_minutes)
    end = start + timedelta(days=horizon_days)
    future_slots = build_slot_grid(start, end, slot_minutes)
    # Features for future
    fdicts = [time_features(t) for t in future_slots["slot_start"]]
    fdf = pd.DataFrame(fdicts, index=future_slots.index)
    Xf = fdf.values
    drop_prob = drop_pipe.predict_proba(Xf)[:, 1]
    future_slots["drop_prob"] = drop_prob

    # Value prediction if available
    if value_pipe is not None:
        Xv = fdf.values
        p_is_10 = value_pipe.predict_proba(Xv)[:, 1]
        future_slots["p_$10_given_drop"] = p_is_10
        future_slots["pred_value"] = np.where(p_is_10 >= 0.5, "$10", "$5")
    else:
        future_slots["p_$10_given_drop"] = np.nan
        future_slots["pred_value"] = "Unknown"

    # Rank by drop probability
    future_slots = future_slots.sort_values("drop_prob", ascending=False).reset_index(drop=True)
    return future_slots[["slot_start", "drop_prob", "pred_value", "p_$10_given_drop"]]


# -----------------------------
# Summaries & Outputs
# -----------------------------
def print_summaries(df: pd.DataFrame) -> None:
    print("\n=== BASIC STATS ===")
    print(f"Events: {len(df)}")
    if df["value_num"].notna().any():
        vc = df["value_num"].dropna().value_counts().sort_index()
        print("Value counts ($):")
        print(vc.to_string())
    else:
        print("No usable value data.")

    print("\n=== DAY-OF-WEEK PROFILE (UTC) ===")
    dow_map = {0:"Mon",1:"Tue",2:"Wed",3:"Thu",4:"Fri",5:"Sat",6:"Sun"}
    print(df["dow"].map(dow_map).value_counts().sort_index().to_string())

    print("\n=== HOUR-OF-DAY PROFILE (UTC) ===")
    hours = df["timestamp_utc"].dt.hour.value_counts().sort_index()
    print(hours.to_string())

    if df["gap_hours"].notna().any():
        print("\n=== GAP DISTRIBUTION (hours) ===")
        print(df["gap_hours"].dropna().describe(percentiles=[0.25,0.5,0.75,0.9,0.95]).to_string())


def save_prediction_artifacts(pred_df: pd.DataFrame, out_dir: str, top_n: int = 20) -> Tuple[str, str]:
    os.makedirs(out_dir, exist_ok=True)
    csv_path = os.path.join(out_dir, "forecast_next_7_days.csv")
    txt_path = os.path.join(out_dir, "forecast_next_7_days.txt")

    # Save full CSV
    pred_df.to_csv(csv_path, index=False)

    # Save a compact top-N TXT including Discord-friendly <t:> stamps (epoch)
    def discord_ts(dt: datetime) -> str:
        # Discord expects epoch seconds
        return f"<t:{int(dt.timestamp())}:f>"

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("Top Prediction Windows (UTC)\n")
        f.write("--------------------------------\n")
        for _, row in pred_df.head(top_n).iterrows():
            slot: datetime = row["slot_start"]
            prob = row["drop_prob"]
            val = row["pred_value"]
            p10 = row["p_$10_given_drop"]
            stamp = discord_ts(slot)
            line = f"{slot.strftime('%Y-%m-%d %H:%M')} UTC  | P(drop)={prob:.2%} | value≈{val}"
            if not (isinstance(p10, float) and math.isnan(p10)):
                line += f" (P($10)|drop={p10:.2%})"
            line += f"  | {stamp}\n"
            f.write(line)

    return csv_path, txt_path


def maybe_make_plots(df: pd.DataFrame, out_dir: str) -> None:
    # Import lazily to honor "no seaborn" and single-plot rule per figure
    plt = lazy_import_matplotlib()

    os.makedirs(out_dir, exist_ok=True)

    # Hour-of-day histogram
    plt.figure()
    (df["timestamp_utc"].dt.hour).plot(kind="hist", bins=24, rwidth=0.9)
    plt.title("IG Code Drop Hour (UTC)")
    plt.xlabel("Hour (0-23)")
    plt.ylabel("Count")
    hour_path = os.path.join(out_dir, "hour_hist.png")
    plt.savefig(hour_path, bbox_inches="tight")
    plt.close()

    # Day-of-week bar (0=Mon ... 6=Sun)
    plt.figure()
    df["dow"].value_counts().sort_index().plot(kind="bar")
    plt.title("IG Code Drops by Day of Week (UTC)")
    plt.xlabel("Day of Week (0=Mon)")
    plt.ylabel("Count")
    dow_path = os.path.join(out_dir, "dow_bar.png")
    plt.savefig(dow_path, bbox_inches="tight")
    plt.close()


# -----------------------------
# CLI
# -----------------------------
def main():
    ap = argparse.ArgumentParser(description="Analyze UTC IG code log and predict next 7 days.")
    ap.add_argument("--csv", required=True, help="Path to input CSV with columns: timestamp_utc,value")
    ap.add_argument("--horizon_days", type=int, default=7, help="Forecast horizon in days (default: 7)")
    ap.add_argument("--slot_minutes", type=int, default=30, help="Slot size in minutes for classification (default: 30)")
    ap.add_argument("--out_dir", default="ig_outputs", help="Directory to save outputs (default: ig_outputs)")
    ap.add_argument("--make_plots", action="store_true", help="Generate simple plots with matplotlib")
    args = ap.parse_args()

    # Load
    events = load_events(args.csv)
    if events.empty:
        raise SystemExit("No events after parsing timestamps. Check your CSV formatting.")

    # Summaries
    print_summaries(events)

    # Slot grid for training the drop model
    first = events["timestamp_utc"].min()
    last = events["timestamp_utc"].max()
    slots = build_slot_grid(ensure_slot_floor(first, args.slot_minutes),
                            ensure_slot_floor(last, args.slot_minutes),
                            args.slot_minutes)
    slot_train = label_slots(slots, events, args.slot_minutes)

    # Train models
    drop_model = train_drop_model(slot_train)
    val_frame = value_training_frame(events)
    value_model = train_value_model(val_frame)

    # Predict
    pred = predict_future(events, drop_model, value_model, args.horizon_days, args.slot_minutes)

    # Save artifacts
    csv_path, txt_path = save_prediction_artifacts(pred, args.out_dir, top_n=24)
    print(f"\nSaved predictions:\n- CSV: {csv_path}\n- TXT: {txt_path}")

    # Optional plots
    if args.make_plots:
        maybe_make_plots(events, args.out_dir)
        print(f"Saved plots to: {args.out_dir}")

    # Friendly disclaimer
    print("\n⚠️ Disclaimer: These are model-based community predictions, not official announcements. Times/values may vary.")

if __name__ == "__main__":
    main()
