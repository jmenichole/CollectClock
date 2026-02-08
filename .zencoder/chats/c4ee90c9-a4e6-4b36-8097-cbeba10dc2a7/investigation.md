# Bug Investigation - Only "Get Paid To" section showing

## Bug Summary
The user reports that only the "Get Paid To" section is visible on the GitHub Pages site. This likely means the JavaScript responsible for rendering the casino cards is failing, leaving the main content area empty.

## Root Cause Analysis
1. **JavaScript Syntax Error**: In `index.html` at line 405, there is a trailing backslash `\` which is a syntax error in JavaScript.
   ```javascript
   document.getElementById("nextReady").textContent = \
   `${ready} not visited today`;
   ```
   This prevents the entire script block from executing.
2. **Empty Containers**: Since the script fails, the `render()` and `renderPaid()` functions never run, leaving the `#cards` and `#paidCards` containers empty.
3. **Hardcoded Headings**: The "Get Paid To Sites" heading is hardcoded in HTML, so it shows up even if the script fails, making it seem like it's the only section.

## Affected Components
- `index.html` (Script block)

## Proposed Solution
1. Fix the syntax error in `index.html` by removing the erroneous backslash.
2. Ensure `render()` and `renderPaid()` are called correctly.
3. (Optional but recommended) Add a heading for the first section to avoid confusion if it's empty.

## Bug Summary - Settings Cog Issues
The user reports that the settings cog on casino cards (intended to change the bonus collection timeframe) does not work correctly and lacks clear explanation for users.

## Root Cause Analysis - Settings Cog
1. **Unclear UI**: The popover appears without context or instructions, making it difficult for users to understand what "Collection interval" means.
2. **State Persistence**: While the code attempts to save to `localStorage`, the initial `state` array is hardcoded. If the user clears local storage or if there's a version mismatch, it reverts to 24 hours.
3. **Card Re-rendering**: The current `render()` function replaces the entire `innerHTML` of the `#cards` container. If a popover is open when `render()` is called (e.g., via `setInterval`), it might be lost or orphaned.
4. **UX**: Clicking the card triggers the collection (opens URL + updates `lastCollected`). If a user tries to click the settings cog but misses slightly, they accidentally trigger a collection they might not have intended.

## Redesign Strategy - Settings & Customization
As per user request, the current "cog" settings implementation will be **removed entirely**. We will rethink the implementation to be more intuitive.

## Global Settings Implementation
- **Centralized Modal**: Replaced individual cogs with a single "Settings" button in the header.
- **Bonus Amounts**: Added ability to track and display bonus values (e.g., "$1.00 Daily").
- **Visibility Management**: Users can now hide/show specific casinos to declutter their dashboard.
- **Automatic Sorting**: Cards are now automatically sorted by collection priority (Ready first, then by time remaining).
- **Persistent State**: All customizations are saved to `localStorage` and persist across browser sessions.
