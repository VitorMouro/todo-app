DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_groups;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    -- id SERIAL PRIMARY KEY,
    id uuid DEFAULT gen_random_uuid(),
    -- username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS task_groups (
    -- id SERIAL PRIMARY KEY,
    id uuid DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    -- id SERIAL PRIMARY KEY,
    id uuid DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    group_id uuid NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    due DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES task_groups(id) ON DELETE CASCADE
);
