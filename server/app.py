# THIS IS THE FLASK FILE THAT DEALS WITH THE BACK END OF THE PROGRAM


from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, auth
from functools import wraps
from flask_cors import CORS
import os
from dotenv import load_dotenv 

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r'/*' : {'origins':'*'}})

reset_locations_on_start = False ## IMPORTANT, RESETS LOCATIONS ON START... ONLY TURN THIS ON IF WE AREN'T INSERTING LOCATIONS INTO THE DATABASE ON FRONTEND
reset_users_on_start = True

service_account_path = os.getenv('SERVICE_ACCOUNT_PATH')
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()


def delete_all_users():
    try:
        locations_ref = db.collection('users')
        docs = locations_ref.stream()
        for doc in docs:
            doc.reference.delete()
        print("All users have been deleted.")
    except Exception as e:
        print(f"Error deleting users: {str(e)}")

# Function to delete all documents from the "locations" collection
def delete_all_locations():
    try:
        locations_ref = db.collection('locations')
        docs = locations_ref.stream()
        for doc in docs:
            doc.reference.delete()
        print("All locations have been deleted.")
    except Exception as e:
        print(f"Error deleting locations: {str(e)}")

# Delete all locations if the flag is set to True
if reset_locations_on_start:
    delete_all_locations()

if reset_users_on_start:
    delete_all_users()

# Helper function to convert Firestore timestamp to ISO format
def convert_timestamp(timestamp):
    return timestamp.isoformat() if timestamp else None


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        auth_header = request.headers.get('Authorization')  # Fetch the Authorization header
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401  # If no Authorization header, return error
        
        # Extracts the ID token from the Authorization header (value)
        id_token = auth_header.split(' ').pop()
        try:
            # Verify the Firebase ID token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Store user data for use in the request
        except Exception as e:
            return jsonify({'error': 'Invalid token', 'message': str(e)}), 401  # If token invalid, return error
        return f(*args, **kwargs)
    return wrap

# Endpoint to create a user
@app.route('/auth/users', methods=['POST'])
def create_user():
    try:
        user_data = request.json
        username = user_data.get('username')
        email = user_data.get('email')
        points = user_data.get('points', 0)

        # Generate a new user_id if not provided

        # Reference the Firestore collection and set the new document
        user_ref = db.collection('users').document()
        user_id = user_ref.id
        user_ref.set({
            'username': username,
            'email': email,
            'points': points,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })
        return jsonify({'message': f'User document has been created with ID: {user_id}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get a user
@app.route('/auth/users/<user_id>', methods=['GET'])
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
@app.route('/auth/users/<user_id>', methods=['PUT'])
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
        data = request.json
        name = data.get('name')
        address = data.get('address')
        city = data.get('city')
        coordinates = data.get('coordinates', {})
        latitude = coordinates.get('latitude')
        longitude = coordinates.get('longitude')
        photoUrl = data.get('photoUrl')
        description = data.get('description')

        # Validate required fields
        if not all([name, address, city, latitude, longitude, description]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create the location document
        location_ref = db.collection('locations').document()
        singleton = {
            'name': name,
            'address': address,
            'city': city,
            'coordinates': {
                'latitude': latitude,
                'longitude': longitude,
            },
            'photoUrl': photoUrl,
            'descrpition' : description,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
        }
        location_ref.set(singleton)
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
        if location_doc.exists():
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
        
        # Extract user and location IDs from the request data
        user_id = data.get('userId')
        location_id = data.get('locationId')

        # Fetch the location document from Firestore based on locationId
        location_ref = db.collection('locations').document(location_id)
        location_doc = location_ref.get()

        if not location_doc.exists():
            return jsonify({'error': 'Location does not exist'}), 404

        # Get location details from the location document
        location_data = location_doc.to_dict()
        location_name = location_data.get('name')
        location_address = location_data.get('address')
        location_coordinates = location_data.get('coordinates', {})
        photoUrl = location_data.get('photoUrl', '')

        # Add check-in document with both user and location data
        checkin_ref = db.collection('checkIns').document()
        checkin_ref.set({
            'userId': user_id,
            'locationId': location_id,
            'locationName': location_name,  # Store location name
            'locationAddress': location_address,  # Store location address
            'locationCoordinates': {
                'latitude': location_coordinates.get('latitude'),
                'longitude': location_coordinates.get('longitude'),
            },  # Store location coordinates
            'locationPhotoUrl': photoUrl,  # Store location photo URL
            'timestamp': firestore.SERVER_TIMESTAMP,  # Store when the check-in occurred
        })

        return jsonify({'message': f'Check-in has been successfully added with ID: {checkin_ref.id}'}), 200
   except Exception as e:
       return jsonify({'error': str(e)}), 500

# Endpoint to get check-ins by user
@app.route('/auth/users/<user_id>/checkins', methods=['GET'])
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



@app.route('/test-auth', methods=['GET'])
@check_token
def test_auth():
    return jsonify({'message': 'This is a response from Flask API!'})


# Generate a custom token for a user with a specified UID
def generate_custom_token(uid):
    custom_token = auth.create_custom_token(uid)
    print(f"Custom token for user {uid}: {custom_token.decode('utf-8')}")
    return custom_token




# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
