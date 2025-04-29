import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT } from "../config/passport";
import { query } from "../config/db";
import { User } from "../models/user";

export const tasksRouter = Router();

tasksRouter.use(authenticateJWT);

tasksRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;

    const queryResult = await query(
        "SELECT * FROM tasks WHERE user_id = $1",
        [userId]
    );

    const tasks = queryResult.rows.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    }));

    res.status(200).json(tasks);
    return;
});

tasksRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id, 10);
    const queryResult = await query(
        "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
        [taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    });
});

tasksRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, title, description, status]
    );
    const task = queryResult.rows[0];
    res.status(201).json({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    });
});

tasksRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id, 10);
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
        [title, description, status, taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    });
});

tasksRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id, 10);
    const { title, description, status } = req.body;
    const queryResult = await query(
        "UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status) WHERE id = $4 AND user_id = $5 RETURNING *",
        [title, description, status, taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    });
});

tasksRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id, 10);
    const queryResult = await query(
        "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
        [taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    });
});
