import requests

def test_auth(base_url, auth_token):
    headers = { "Authorization": f"Bearer {auth_token}" }
    response = requests.get(f"{base_url}/auth", headers=headers)
    assert response.status_code == 200

def test_register_user_success(registered_user):
    assert registered_user is not None
    assert "email" in registered_user

def test_register_user_duplicate(base_url, registered_user):
    register_url = f"{base_url}/auth/register"
    response = requests.post(register_url, json=registered_user)
    assert response.status_code == 409

def test_login_user_success(auth_token):
    assert auth_token is not None
    assert isinstance(auth_token, str)
    assert len(auth_token) > 10

def test_login_user_invalid_password(base_url, registered_user):
    login_url = f"{base_url}/auth/login"
    login_data = {
        "email": registered_user["email"],
        "password": "wrongpassword"
    }
    response = requests.post(login_url, json=login_data)
    assert response.status_code == 401
