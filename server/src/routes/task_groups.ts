import { Router, Request, Response } from "express";
import { authenticateJWT } from "../config/passport";
import { query } from "../config/db";
import { User } from "../models/user";
import TaskGroup from "../models/tast_group";

export const taskGroupRouter = Router();

taskGroupRouter.use(authenticateJWT);

function filterData(group: TaskGroup) {
    return {
        id: group.id,
        name: group.name,
        created_at: group.created_at,
        updated_at: group.updated_at
    };
}

taskGroupRouter.get("/", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;

    const queryResult = await query(
        "SELECT * FROM task_groups WHERE user_id = $1",
        [userId]
    );

    const groups = queryResult.rows.map((group) => filterData(group));

    res.status(200).json(groups);
    return;
});

taskGroupRouter.get("/:id", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const groupId = req.params.id;
    const queryResult = await query(
        "SELECT * FROM task_groups WHERE id = $1 AND user_id = $2",
        [groupId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Group not found" });
        return;
    }
    const group = queryResult.rows[0];
    res.status(200).json(filterData(group));
});

taskGroupRouter.post("/", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "INSERT INTO task_groups (user_id, name) VALUES ($1, $2) RETURNING *",
        [userId, name]
    );
    const group = queryResult.rows[0];
    res.status(201).json(filterData(group));
});

taskGroupRouter.put("/:id", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const groupId = req.params.id;
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const queryResult = await query(
        "UPDATE task_groups SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
        [name, groupId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Group not found" });
        return;
    }
    const group = queryResult.rows[0];
    res.status(200).json(filterData(group));
});

taskGroupRouter.patch("/:id", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const groupId = req.params.id;
    const { name } = req.body;
    const queryResult = await query(
        "UPDATE task_groups SET name  = COALESCE($1, name) WHERE id = $2 AND user_id = $3 RETURNING *",
        [name, groupId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    const group = queryResult.rows[0];
    res.status(200).json(filterData(group));
});

taskGroupRouter.delete("/:id", async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const groupId = req.params.id;
    const queryResult = await query(
        "DELETE FROM task_groups WHERE id = $1 AND user_id = $2 RETURNING *",
        [groupId, userId]
    );
    if (queryResult.rowCount === 0) {
        res.status(404).json({ message: "Group not found" });
        return;
    }
    const group = queryResult.rows[0];
    res.status(200).json(filterData(group));
});
