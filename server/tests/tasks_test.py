import requests
import pytest
import uuid

def test_get_tasks(base_url, session):
    response = session.get(f"{base_url}/tasks")
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

@pytest.fixture(scope="session")
def test_create_task(base_url, session, test_create_group):
    task_data = {
        "group_id": test_create_group["id"],
        "title": f"Test Task {uuid.uuid4()}",
        "description": "This is a test task.",
        "status": "pending"
    }

    response = session.post(f"{base_url}/tasks", json=task_data)
    print(response.json())
    assert response.status_code == 201
    return response.json()

def test_get_task(base_url, session, test_create_task):
    task_id = test_create_task["id"]
    response = session.get(f"{base_url}/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id
    assert response.json()["group_id"] == test_create_task["group_id"]
    assert response.json()["title"] == test_create_task["title"]
    assert response.json()["description"] == test_create_task["description"]
    assert response.json()["status"] == test_create_task["status"]

def test_update_task(base_url, session, test_create_task):
    task_id = test_create_task["id"]
    updated_data = {
        "group_id": test_create_task["group_id"],
        "title": f"Updated Task {uuid.uuid4()}",
        "description": "This is an updated test task.",
        "status": "completed"
    }
    response = session.put(f"{base_url}/tasks/{task_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["id"] == task_id
    assert response.json()["group_id"] == updated_data["group_id"]
    assert response.json()["title"] == updated_data["title"]
    assert response.json()["description"] == updated_data["description"]
    assert response.json()["status"] == updated_data["status"]

def test_patch_task(base_url, session, test_create_task):
    task_id = test_create_task["id"]
    patch_data = {
        "status": "completed"
    }
    response = session.patch(f"{base_url}/tasks/{task_id}", json=patch_data)
    assert response.status_code == 200
    assert response.json()["id"] == task_id
    assert response.json()["status"] == patch_data["status"]

def test_delete_task(base_url, session, test_create_task):
    task_id = test_create_task["id"]
    response = session.delete(f"{base_url}/tasks/{task_id}")
    assert response.status_code == 200
    response = session.get(f"{base_url}/tasks/{task_id}")
    assert response.status_code == 404

def test_get_task_not_found(base_url, session):
    response = session.get(f"{base_url}/tasks/{uuid.uuid4()}")
    assert response.status_code == 404

def test_create_task_invalid_data(base_url, session):
    invalid_data = {
        "title": "",
        "description": "This task has no title.",
        "status": "pending"
    }
    response = session.post(f"{base_url}/tasks", json=invalid_data)
    assert response.status_code == 400

def test_create_task_not_authenticated(base_url):
    task_data = {
        "title": f"Test Task {uuid.uuid4()}",
        "description": "This is a test task.",
        "status": "pending"
    }
    response = requests.post(f"{base_url}/tasks", json=task_data)
    assert response.status_code == 401
