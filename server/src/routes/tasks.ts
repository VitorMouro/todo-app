import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT } from "../config/passport";
import { query } from "../config/db";
import { User } from "../models/user";
import { Task } from "../models/task";

export const tasksRouter = Router();

tasksRouter.use(authenticateJWT);

function filterData(task: Task) {
    return {
        id: task.id,
        group_id: task.group_id,
        title: task.title,
        description: task.description,
        status: task.status,
        due: task.due,
        created_at: task.created_at,
        updated_at: task.updated_at,
    };
}

tasksRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;

    const queryResult = await query(
        "SELECT * FROM tasks WHERE user_id = $1",
        [userId]
    );

    const tasks = queryResult.rows.map((task) => filterData(task));

    res.status(200).json(tasks);
    return;
});

tasksRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = req.params.id;
    const queryResult = await query(
        "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
        [taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json(filterData(task));
});

tasksRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const { group_id: groupId, title, description, status, due } = req.body;
    if (!groupId || !title || !status) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "INSERT INTO tasks (user_id, group_id, title, description, status, due) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [userId, groupId, title, description, status, due]
    );
    const task = queryResult.rows[0];
    res.status(201).json(filterData(task));
});

tasksRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = req.params.id;
    const { group_id: groupId, title, description, status, due } = req.body;
    if (!groupId || !title || !status) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "UPDATE tasks SET group_id = $1, title = $2, description = $3, status = $4, due = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
        [groupId, title, description, status, due, taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json(filterData(task));
});

tasksRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = req.params.id;
    const { group_id: groupId, title, description, status, due } = req.body;
    const queryResult = await query(
        "UPDATE tasks SET group_id = COALESCE($1, group_id), title = COALESCE($2, title), description = COALESCE($3, description), status = COALESCE($4, status), due = COALESCE($5, due) WHERE id = $6 AND user_id = $7 RETURNING *",
        [groupId, title, description, status, due, taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json(filterData(task));
});

tasksRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const taskId = req.params.id;
    const queryResult = await query(
        "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
        [taskId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const task = queryResult.rows[0];
    res.status(200).json(filterData(task));
});
