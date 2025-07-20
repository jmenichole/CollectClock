from flask import Flask, request, redirect, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient
from flask_cors import CORS
import os
import requests
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('collectclock')

app = Flask(__name__, static_url_path='')
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///collectclock.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_recycle': 280,
    'pool_timeout': 20
}
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for all routes

limiter = Limiter(get_remote_address, app=app)

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
    if not code:
        logger.error("No code provided in callback")
        return jsonify({'error': 'Authorization failed'}), 400
        
    token_url = f'{DISCORD_API_ENDPOINT}/oauth2/token'
    
    token_data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI
    }
    
    try:
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()  # Raise exception for HTTP errors
        token = token_response.json()
        
        user_response = requests.get(
            f'{DISCORD_API_ENDPOINT}/users/@me',
            headers={'Authorization': f'Bearer {token["access_token"]}'}
        )
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Basic validation of user data
        if not user_data.get('id') or not user_data.get('username'):
            logger.error(f"Invalid user data received: {user_data}")
            return jsonify({'error': 'Invalid user data'}), 400
            
        user = User.query.get(user_data['id'])
        if not user:
            user = User(
                id=user_data['id'],
                username=user_data['username'],
                avatar=user_data.get('avatar', '')
            )
            db.session.add(user)
        db.session.commit()
        
        session['user_id'] = user.id
        return redirect('/')
        
    except requests.RequestException as e:
        logger.error(f"Discord API error: {e}")
        return jsonify({'error': 'Authentication service unavailable'}), 503
    except Exception as e:
        logger.error(f"Unexpected error during callback: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/user')
def get_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'id': user.id,
            'username': user.username,
            'avatar': user.avatar,
            'current_streak': user.current_streak,
            'highest_streak': user.highest_streak,
            'loggedIn': True
        })
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/api/user')
def api_get_user():
    # Added to support dashboard.html
    return get_user()

@app.route('/leaderboard')
def get_leaderboard():
    try:
        top_users = User.query.order_by(User.highest_streak.desc()).limit(10).all()
        return jsonify([{
            'username': user.username,
            'highest_streak': user.highest_streak
        } for user in top_users])
    except Exception as e:
        logger.error(f"Error retrieving leaderboard: {e}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/collect', methods=['POST'])
@limiter.limit("5 per minute")  # Limit to 5 requests per minute per IP
def collect():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
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
        
        logger.info(f"User {user.id} collected bonus at {now}")
        
        return jsonify({
            'current_streak': user.current_streak,
            'highest_streak': user.highest_streak
        })
    except Exception as e:
        logger.error(f"Error during collection: {e}")
        db.session.rollback()
        return jsonify({'error': 'Server error'}), 500

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)