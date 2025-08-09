// Mock data used only by the dashboard for a realistic look.
// Replace later with API responses.

export const userProfile = {
  name: "Momentum User",
  email: "user@momentum.app",
  avatarUrl: "", // keep empty to show initials bubble
};

export const quickStats = [
  { id: 1, label: "Active Tasks", value: 8, delta: "+2 this week" },
  { id: 2, label: "Completed", value: 21, delta: "+5 this week" },
  { id: 3, label: "Pending", value: 3, delta: "−1 today" },
  { id: 4, label: "Focus Time", value: "5h 20m", delta: "this week" },
];

export const recentActivity = [
  { id: 101, title: "Finished: Landing page polish", time: "2 hours ago" },
  { id: 102, title: "New task: Implement signup validation", time: "yesterday" },
  { id: 103, title: "Commented on: Dashboard layout", time: "2 days ago" },
  { id: 104, title: "Marked streak complete", time: "3 days ago" },
];

export const pinnedNotes = [
  { id: "p1", title: "Priority", body: "Finish auth wiring by Friday." },
  { id: "p2", title: "Idea", body: "Add dark mode toggle on Navbar." },
];

export const weeklyProgress = [
  // Simple 7-day sample for the chart
  { day: "Mon", value: 30 },
  { day: "Tue", value: 50 },
  { day: "Wed", value: 20 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 80 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 70 },
];