INSERT INTO users (
    email, password
) VALUES ( 'admin@example.com', '$2a$10$eyFr9PqYiapA4HKVzkJbO.mjwj.YVbD3IJu0BEFscWUebUFN.O34G' ),
         ( 'user@example.com', '$2a$10$eyFr9PqYiapA4HKVzkJbO.mjwj.YVbD3IJu0BEFscWUebUFN.O34G' );

INSERT INTO tasks (
    user_id, title, description, status
) VALUES ( 1, 'Task 1', 'Description for Task 1', 'pending' ),
     ( 1, 'Task 2', 'Description for Task 2', 'in_progress' ),
     ( 2, 'Task 3', 'Description for Task 3', 'completed' ),
     ( 2, 'Task 4', 'Description for Task 4', 'pending' );


