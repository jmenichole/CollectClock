from flask import Flask, request, redirect, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient
from flask_cors import CORS
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='')
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///collectclock.db'
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for all routes

# Discord OAuth2 credentials
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI', 'http://localhost:5000/callback')
DISCORD_API_ENDPOINT = 'https://discord.com/api/v10'

client = WebApplicationClient(DISCORD_CLIENT_ID)

# Database Models
class User(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(100))
    current_streak = db.Column(db.Integer, default=0)
    highest_streak = db.Column(db.Integer, default=0)
    last_collection = db.Column(db.DateTime)

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/login')
def login():
    discord_auth_url = f'{DISCORD_API_ENDPOINT}/oauth2/authorize'
    params = {
        'client_id': DISCORD_CLIENT_ID,
        'redirect_uri': DISCORD_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'identify'
    }
    return jsonify({'auth_url': client.prepare_request_uri(discord_auth_url, **params)})

@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_url = f'{DISCORD_API_ENDPOINT}/oauth2/token'
    
    token_data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI
    }
    
    token_response = requests.post(token_url, data=token_data)
    token = token_response.json()
    
    user_response = requests.get(
        f'{DISCORD_API_ENDPOINT}/users/@me',
        headers={'Authorization': f'Bearer {token["access_token"]}'}
    )
    user_data = user_response.json()
    
    user = User.query.get(user_data['id'])
    if not user:
        user = User(
            id=user_data['id'],
            username=user_data['username'],
            avatar=user_data['avatar']
        )
        db.session.add(user)
    db.session.commit()
    
    session['user_id'] = user.id
    return redirect('/')

@app.route('/user')
def get_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    return jsonify({
        'id': user.id,
        'username': user.username,
        'avatar': user.avatar,
        'current_streak': user.current_streak,
        'highest_streak': user.highest_streak
    })

@app.route('/leaderboard')
def get_leaderboard():
    top_users = User.query.order_by(User.highest_streak.desc()).limit(10).all()
    return jsonify([{
        'username': user.username,
        'highest_streak': user.highest_streak
    } for user in top_users])

@app.route('/collect', methods=['POST'])
def collect():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    user = User.query.get(session['user_id'])
    now = datetime.utcnow()
    
    if user.last_collection:
        time_diff = now - user.last_collection
        if time_diff < timedelta(hours=23):
            return jsonify({'error': 'Too soon to collect'}), 400
        elif time_diff > timedelta(hours=25):
            user.current_streak = 1
        else:
            user.current_streak += 1
            
        if user.current_streak > user.highest_streak:
            user.highest_streak = user.current_streak
    else:
        user.current_streak = 1
    
    user.last_collection = now
    db.session.commit()
    
    return jsonify({
        'current_streak': user.current_streak,
        'highest_streak': user.highest_streak
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
