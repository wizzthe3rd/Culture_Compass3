# THIS IS THE FLASK FILE THAT DEALS WITH THE BACK END OF THE PROGRAM


from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, auth
from functools import wraps
from firebase_admin.exceptions import FirebaseError
from flask_cors import CORS
from google.cloud.firestore_v1 import ArrayUnion, ArrayRemove
from datetime import datetime


app = Flask(__name__)
CORS(app)


service_account_path = r"C:/Users/44756/Downloads/culture-9c382-firebase-adminsdk-e3tt9-667fa26370.json"
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Helper function to convert Firestore timestamp to ISO format
def convert_timestamp(timestamp):
    return timestamp.isoformat() if timestamp else None

# Endpoint to create a user
@app.route('/users/<user_id>', methods=['POST'])
def create_user(user_id):
    try:
        user_data = request.json
        points = user_data.get('points', 0)
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            **user_data,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })
        return jsonify({'message': f'User document has been created with ID: {user_id}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get a user
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            user_data['id'] = user_doc.id
            user_data['createdAt'] = convert_timestamp(user_data.get('createdAt'))
            user_data['updatedAt'] = convert_timestamp(user_data.get('updatedAt'))
            return jsonify(user_data), 200
        else:
            return jsonify({'message': 'User does not exist'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to update a user
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        update_data = request.json
        user_ref = db.collection('users').document(user_id)
        user_ref.update({
            **update_data,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })
        return jsonify({'message': f'User document has been updated. ID: {user_id}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to add a location
@app.route('/locations', methods=['POST'])
def add_location():
    try:
        location_data = request.json
        location_ref = db.collection('locations').document()
        location_ref.set({
            **location_data,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })
        return jsonify({'message': f'Location document has been created with ID: {location_ref.id}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get all locations
@app.route('/locations', methods=['GET'])
def get_all_locations():
    try:
        locations_ref = db.collection('locations')
        docs = locations_ref.stream()
        locations = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            data['createdAt'] = convert_timestamp(data.get('createdAt'))
            data['updatedAt'] = convert_timestamp(data.get('updatedAt'))
            locations.append(data)
        return jsonify(locations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get a specific location
@app.route('/locations/<location_id>', methods=['GET'])
def get_location(location_id):
    try:
        location_ref = db.collection('locations').document(location_id)
        location_doc = location_ref.get()
        if location_doc.exists:
            location_data = location_doc.to_dict()
            location_data['id'] = location_doc.id
            location_data['createdAt'] = convert_timestamp(location_data.get('createdAt'))
            location_data['updatedAt'] = convert_timestamp(location_data.get('updatedAt'))
            return jsonify(location_data), 200
        else:
            return jsonify({'message': 'Location does not exist'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to add a check-in
@app.route('/checkins', methods=['POST'])
def add_checkin():
    try:
        data = request.json
        user_id = data['userId']
        location_id = data['locationId']
        checkin_ref = db.collection('checkIns').document()
        checkin_ref.set({
            'userId': user_id,
            'locationId': location_id,
            'timestamp': firestore.SERVER_TIMESTAMP,
        })
        return jsonify({'message': f'Check-in has been successfully added with ID: {checkin_ref.id}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get check-ins by user
@app.route('/users/<user_id>/checkins', methods=['GET'])
def get_user_checkins(user_id):
    try:
        checkins_ref = db.collection('checkIns')
        query = checkins_ref.where('userId', '==', user_id)
        docs = query.stream()
        checkins = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            data['timestamp'] = convert_timestamp(data.get('timestamp'))
            checkins.append(data)
        return jsonify(checkins), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get check-ins by location
@app.route('/locations/<location_id>/checkins', methods=['GET'])
def get_location_checkins(location_id):
    try:
        checkins_ref = db.collection('checkIns')
        query = checkins_ref.where('locationId', '==', location_id)
        docs = query.stream()
        checkins = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            data['timestamp'] = convert_timestamp(data.get('timestamp'))
            checkins.append(data)
        return jsonify(checkins), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # Get the ID token from the Authorization header
        id_token = request.headers.get('Authorization')
        if not id_token:
            return jsonify({'error': 'Authorization header missing'}), 401
        else:
            # Remove 'Bearer ' prefix if present
            id_token = id_token.split(' ').pop()
            try:
                # Verify the ID token
                decoded_token = auth.verify_id_token(id_token)
                request.user = decoded_token
            except Exception as e:
                return jsonify({'error': 'Invalid token'}), 401
            return f(*args, **kwargs)
    return wrap

# Protected route example
@app.route('/protected-endpoint', methods=['GET'])
@check_token
def protected_endpoint():
    uid = request.user['uid']
    return jsonify({'message': f'Hello, user {uid}!'}), 200


@app.route('/users', methods=['GET'])
def get_all_users():
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()
        users = []
        for doc in docs:
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            user_data['createdAt'] = convert_timestamp(user_data.get('createdAt'))
            user_data['updatedAt'] = convert_timestamp(user_data.get('updatedAt'))
            users.append(user_data)
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def home():
    return "hi"
# Test route for authentication

def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        auth_header = request.headers.get('Authorization')  # Fetch the Authorization header
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401  # If no Authorization header, return error
        
        # Extract the ID token from the Authorization header
        id_token = auth_header.split(' ').pop()
        try:
            # Verify the Firebase ID token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Store user data for use in the request
        except Exception as e:
            return jsonify({'error': 'Invalid token', 'message': str(e)}), 401  # If token invalid, return error
        return f(*args, **kwargs)
    
    
    return wrap
@app.route('/test-auth', methods=['GET'])
@check_token
def test_auth():
   def test_auth():
    return jsonify({'message': 'This is a response from Flask API!'})


if __name__ == '__main__':
    app.run(debug=True)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
