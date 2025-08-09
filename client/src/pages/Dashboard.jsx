// Main Dashboard page (protected).
// Dynamic Habits and Tasks with add/toggle/delete. All data comes from the API.

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HabitCard from "../components/HabitCard";
import TaskCard from "../components/TaskCard";
import WeeklyChart from "../components/WeeklyChart";
import HabitWiseChart from "../components/HabitWiseChart";
import Leaderboard from "../components/Leaderboard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../hooks/useAuth.jsx";
import { HabitsAPI, TasksAPI } from "../lib/api";

export default function Dashboard() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [newTask, setNewTask] = useState("");

  // Load habits and tasks from API on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!token) return; // will be present in Protected routes
      try {
        const data = await HabitsAPI.list(token);
        if (isMounted && Array.isArray(data?.habits)) {
          setHabits(
            data.habits.map((h) => ({
              id: h._id,
              name: h.name,
              color: h.color || "bg-emerald-100",
              streak: typeof h.streak === "number" ? h.streak : 0,
              completedToday: !!h.completedToday,
            }))
          );
        }
        const tasksData = await TasksAPI.list(token);
        if (isMounted && Array.isArray(tasksData?.tasks)) {
          setTasks(tasksData.tasks.map((t) => ({ id: t._id, title: t.title, completed: !!t.completed })));
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Habits: toggle, add, delete
  const handleToggleHabit = async (id) => {
    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const completedToday = !h.completedToday;
        const streak = completedToday ? h.streak + 1 : Math.max(0, h.streak - 1);
        return { ...h, completedToday, streak };
      })
    );

    try {
      const res = await HabitsAPI.toggle(id, token);
      const updated = res?.habit;
      if (updated) {
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? {
            id: updated._id,
            name: updated.name,
            color: updated.color || h.color,
            streak: typeof updated.streak === "number" ? updated.streak : 0,
            completedToday: !!updated.completedToday,
          } : h))
        );
      }
    } catch (err) {
      // Revert on failure
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h)));
      console.error("Failed to toggle habit:", err);
    }

  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    const name = newHabit.trim();
    if (!name) return;
    try {
      const { habit } = await HabitsAPI.create({ name }, token);
      setHabits((prev) => [
        { id: habit._id, name: habit.name, color: habit.color || "bg-emerald-100", streak: habit.streak || 0, completedToday: !!habit.completedToday },
        ...prev,
      ]);
      setNewHabit("");
    } catch (err) {
      console.error("Failed to create habit:", err);
    }
  };

  const handleDeleteHabit = async (id) => {
    const previous = habits;
    setHabits((prev) => prev.filter((h) => h.id !== id));
    try {
      await HabitsAPI.remove(id, token);
    } catch (err) {
      console.error("Failed to delete habit:", err);
      setHabits(previous);
    }
  };

  // Tasks: toggle, add, delete
  const handleAddTask = async (e) => {
    e.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    try {
      const { task } = await TasksAPI.create({ title }, token);
      setTasks((prev) => [{ id: task._id, title: task.title, completed: !!task.completed }, ...prev]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleToggleTask = async (id) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const nextCompleted = !current.completed;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)));
    try {
      await TasksAPI.update(id, { completed: nextCompleted }, token);
    } catch (err) {
      console.error("Failed to update task:", err);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !nextCompleted } : t)));
    }
  };

  const handleDeleteTask = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await TasksAPI.remove(id, token);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setTasks(previous);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav (logo + logout) */}
      {/* Main content container */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Habits + Graphs (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Habits */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Habits</h2>
              </div>
              <form onSubmit={handleAddHabit} className="flex gap-2">
                <Input
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="New habit name"
                  aria-label="New habit name"
                />
                <Button type="submit">Add Habit</Button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {habits.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    onToggle={() => handleToggleHabit(h.id)}
                    onDelete={() => handleDeleteHabit(h.id)}
                  />
                ))}
                {habits.length === 0 ? (
                  <Card className="p-4 text-sm text-muted-foreground">No habits yet. Add your first one above.</Card>
                ) : null}
              </div>
            </section>

            {/* Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyChart />
              <HabitWiseChart />
              <Leaderboard />
            </div>
          </div>

          {/* Right: Tasks (1 col) */}
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tasks</h2>
              </div>
              <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New task title"
                  aria-label="New task title"
                />
                <Button type="submit">Add Task</Button>
              </form>
              <div className="grid grid-cols-1 gap-3">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={() => handleToggleTask(t.id)}
                    onDelete={() => handleDeleteTask(t.id)}
                  />
                ))}
                {tasks.length === 0 ? (
                  <Card className="p-4 text-sm text-muted-foreground">No tasks yet. Add one above.</Card>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}