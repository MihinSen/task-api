// src/routes/taskRoutes.js
import { Router } from "express";

const router = Router();

// Temporary in-memory data (replace with DB later if needed)
const tasks = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Finish homework", completed: true },
];

/**
 * GET /tasks/:id
 * - 200: Task object
 * - 400: ValidationError when id isn't an integer
 * - 404: NotFoundError when task not found
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Validate integer id
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: "Validation failed",
      details: ["ID must be a number"],
    });
  }

  const taskId = Number(id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json(task);
});

export default router;
