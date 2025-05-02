import requests
import pytest
import uuid

def test_get_groups(base_url, session):
    response = session.get(f"{base_url}/groups")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0

@pytest.fixture(scope="session")
def test_create_group(base_url, session):
    group_data = {
        "name": f"Test group {uuid.uuid4()}",
    }

    response = session.post(f"{base_url}/groups", json=group_data)
    assert response.status_code == 201
    return response.json()

def test_get_group(base_url, session, test_create_group):
    group_id = test_create_group["id"]
    response = session.get(f"{base_url}/groups/{group_id}")
    assert response.status_code == 200
    assert response.json()["name"] == test_create_group["name"]

def test_update_group(base_url, session, test_create_group):
    group_id = test_create_group["id"]
    updated_data = {
        "name": f"Updated group {uuid.uuid4()}",
    }
    response = session.put(f"{base_url}/groups/{group_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["name"] == updated_data["name"]

def test_patch_group(base_url, session, test_create_group):
    group_id = test_create_group["id"]
    patch_data = {
        "name": f"Patched group name {uuid.uuid4()}",
    }
    response = session.patch(f"{base_url}/groups/{group_id}", json=patch_data)
    assert response.status_code == 200
    assert response.json()["name"] == patch_data["name"]

def test_delete_group(base_url, session, test_create_group):
    group_id = test_create_group["id"]
    response = session.delete(f"{base_url}/groups/{group_id}")
    assert response.status_code == 200
    response = session.get(f"{base_url}/groups/{group_id}")
    assert response.status_code == 404

def test_get_group_not_found(base_url, session):
    response = session.get(f"{base_url}/groups/{uuid.uuid4()}")
    assert response.status_code == 404

def test_create_group_invalid_data(base_url, session):
    invalid_data = {
        "name": "",
    }
    response = session.post(f"{base_url}/groups", json=invalid_data)
    assert response.status_code == 400

def test_create_group_not_authenticated(base_url):
    group_data = {
        "name": f"Test group {uuid.uuid4()}",
    }
    response = requests.post(f"{base_url}/groups", json=group_data)
    assert response.status_code == 401
