// Small KPI card used in the quick stats grid.

import { Card } from "../components/ui/card";

export default function StatsCard({ label, value, delta }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {delta ? <p className="mt-1 text-xs text-muted-foreground">{delta}</p> : null}
    </Card>
  );
}