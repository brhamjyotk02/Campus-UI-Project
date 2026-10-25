// Dummy data for the Clubs module.
// Replace this with real API data once the backend is ready —
// the shape (id, name, category, etc.) should stay the same.

export const clubsData = [
  {
    id: "coding-club",
    name: "Coding Club",
    category: "Technical",
    tagline: "Build things, break things, ship things.",
    description:
      "Weekly build sessions, hackathon prep, and peer code reviews. Open to all years — bring a laptop and an idea.",
    memberCount: 86,
    members: ["Ravi Kumar", "Simran Kaur", "Aditya Sharma", "Naina Verma"],
    events: ["hack-night", "web-dev-bootcamp"],
  },
  {
    id: "photography-society",
    name: "Photography Society",
    category: "Creative",
    tagline: "See campus the way no one else does.",
    description:
      "Monthly photo walks, an annual exhibition, and a darkroom you can actually book. DSLR not required.",
    memberCount: 54,
    members: ["Meher Gill", "Arjun Mehta", "Priya Nanda"],
    events: ["campus-photo-walk"],
  },
  {
    id: "dramatics-club",
    name: "Dramatics Club",
    category: "Performing Arts",
    tagline: "The stage is always half the fun.",
    description:
      "Two full productions a year plus open-mic nights. Actors, writers, and backstage crew all welcome.",
    memberCount: 41,
    members: ["Kabir Anand", "Sanya Kapoor"],
    events: ["open-mic-night"],
  },
  {
    id: "entrepreneurship-cell",
    name: "Entrepreneurship Cell",
    category: "Business",
    tagline: "Turn the 2 a.m. idea into a pitch deck.",
    description:
      "Founder talks, a student incubator, and a pitch competition each semester with real prize money.",
    memberCount: 63,
    members: ["Devika Rao", "Harshit Bansal", "Fatima Sheikh"],
    events: ["pitch-night"],
  },
  {
    id: "sports-committee",
    name: "Sports Committee",
    category: "Sports",
    tagline: "Every sport, one committee.",
    description:
      "Runs inter-department leagues across cricket, football, badminton, and athletics all year round.",
    memberCount: 120,
    members: ["Gurpreet Singh", "Ishaan Chopra"],
    events: ["inter-dept-cricket"],
  },
];

export function getClubById(clubId) {
  return clubsData.find((club) => club.id === clubId) || null;
}
