// Mock habits for the dashboard Habits section. Frontend-only for now.
// "completedToday" toggles in the UI and "streak" updates locally as a demo.

export const mockHabits = [
  {
    id: "h1",
    name: "Morning Yoga",
    streak: 5,              // current streak in days
    completedToday: false,  // whether user has marked it done today
    color: "bg-emerald-100",// just a tag color for the tile
  },
  {
    id: "h2",
    name: "Read 20 mins",
    streak: 7,
    completedToday: true,
    color: "bg-indigo-100",
  },
  {
    id: "h3",
    name: "Drink Water (8 glasses)",
    streak: 2,
    completedToday: false,
    color: "bg-amber-100",
  },
];