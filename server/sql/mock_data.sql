INSERT INTO users (
    id, email, password
) VALUES ( 'a982f332-75fb-461a-97b3-469086fd75d8', 'admin@example.com', '$2a$10$eyFr9PqYiapA4HKVzkJbO.mjwj.YVbD3IJu0BEFscWUebUFN.O34G' ),
         ( '55a3c406-5dca-41ce-8f71-229ee36ff7ad', 'user@example.com', '$2a$10$eyFr9PqYiapA4HKVzkJbO.mjwj.YVbD3IJu0BEFscWUebUFN.O34G' );

INSERT INTO task_groups (
    id, user_id, name
) VALUES ( '0618fdb7-1ef8-4726-a3af-4a17e37dca56', '55a3c406-5dca-41ce-8f71-229ee36ff7ad', 'Group 1' ),
         ( 'c8a35fff-5844-41dd-9d23-fcf730e09ac1', '55a3c406-5dca-41ce-8f71-229ee36ff7ad', 'Group 2' ),
         ( '7d8f0128-a74c-4a7b-8e47-5a5c03b53ea5', '55a3c406-5dca-41ce-8f71-229ee36ff7ad', 'Group 3' ),
         ( '98cf2c02-6b9d-4a67-8bf7-ef71ff61a353', '55a3c406-5dca-41ce-8f71-229ee36ff7ad', 'Group 4' );

INSERT INTO tasks (
    user_id, group_id, title, description, status
) VALUES ( '55a3c406-5dca-41ce-8f71-229ee36ff7ad', '0618fdb7-1ef8-4726-a3af-4a17e37dca56', 'Task 1', 'Description for Task 1', 'pending' ),
         ( '55a3c406-5dca-41ce-8f71-229ee36ff7ad', '0618fdb7-1ef8-4726-a3af-4a17e37dca56', 'Task 2', 'Description for Task 2', 'in_progress' ),
         ( '55a3c406-5dca-41ce-8f71-229ee36ff7ad', '7d8f0128-a74c-4a7b-8e47-5a5c03b53ea5', 'Task 3', 'Description for Task 3', 'completed' ),
         ( '55a3c406-5dca-41ce-8f71-229ee36ff7ad', '7d8f0128-a74c-4a7b-8e47-5a5c03b53ea5', 'Task 4', 'Description for Task 4', 'pending' );


