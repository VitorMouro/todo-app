import pytest
import requests
import uuid
import time

BASE_URL = "http://localhost:3000/api"

@pytest.fixture(scope="session")
def base_url():
    return BASE_URL

@pytest.fixture(scope="session")
def unique_user_data():
    timestamp = int(time.time()) # Use timestamp for uniqueness
    unique_id = uuid.uuid4().hex[:6] # Add more uniqueness
    username = f"testuser_{timestamp}_{unique_id}"
    return {
        "email": f"{username}@example.com",
        "password": "testpassword123"
    }

@pytest.fixture(scope="session")
def registered_user(base_url, unique_user_data):
    register_url = f"{base_url}/auth/register"
    print(f"\nAttempting to register user: {unique_user_data['email']}")
    response = requests.post(register_url, json=unique_user_data)

    if response.status_code not in (200, 201):
         pytest.fail(f"Failed to register user. Status: {response.status_code}, Response: {response.text}")

    print(f"User {unique_user_data['email']} registered successfully.")
    yield unique_user_data

    # TODO: Cleanup


@pytest.fixture(scope="session")
def auth_token(base_url, registered_user):
    login_url = f"{base_url}/auth/login"
    login_data = {
        "email": registered_user["email"],
        "password": registered_user["password"]
    }
    print(f"\nAttempting to log in user: {registered_user['email']}")
    response = requests.post(login_url, json=login_data)

    if response.status_code != 200:
        pytest.fail(f"Failed to log in user {registered_user['email']}. Status: {response.status_code}, Response: {response.text}")

    try:
        token = response.json().get("token")
        if not token:
             pytest.fail(f"Login successful, but 'access_token' not found in response: {response.json()}")
        print(f"Login successful, token obtained for {registered_user['email']}.")
        return token
    except requests.exceptions.JSONDecodeError:
         pytest.fail(f"Failed to decode JSON response from login endpoint. Response text: {response.text}")

@pytest.fixture(scope="session")
def session(auth_token):
    session = requests.Session()
    session.headers.update({
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    })
    return session
