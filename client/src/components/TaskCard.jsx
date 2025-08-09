import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={onToggle}
          aria-label="Toggle task"
        />
        <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onDelete} title="Delete task">
        Delete
      </Button>
    </Card>
  );
}


