import { z } from 'zod';
import { Task } from '../models/Task.js';

const createSchema = z.object({ title: z.string().min(1) });
const updateSchema = z.object({ title: z.string().min(1).optional(), completed: z.boolean().optional() });

export async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    const { title } = createSchema.parse(req.body);
    const task = await Task.create({ userId: req.userId, title });
    res.status(201).json({ task });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const payload = updateSchema.parse(req.body);
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: payload }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}


