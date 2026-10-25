// Dummy data for the Events module.

export const eventsData = [
  {
    id: "hack-night",
    title: "Hack Night: Build in 6 Hours",
    club: "Coding Club",
    category: "Technical",
    date: "2026-09-12",
    time: "6:00 PM – 12:00 AM",
    location: "CS Block, Lab 3",
    description:
      "Form a team of up to 3, pick a track, and ship something working by midnight. Pizza is on the club.",
    seatsLeft: 14,
  },
  {
    id: "web-dev-bootcamp",
    title: "Weekend Web Dev Bootcamp",
    club: "Coding Club",
    category: "Technical",
    date: "2026-09-20",
    time: "10:00 AM – 4:00 PM",
    location: "Seminar Hall 2",
    description:
      "Two days, React from zero to a deployed project. Laptops required, no prior experience needed.",
    seatsLeft: 0,
  },
  {
    id: "campus-photo-walk",
    title: "Campus Photo Walk: Golden Hour",
    club: "Photography Society",
    category: "Creative",
    date: "2026-09-14",
    time: "5:30 PM – 7:00 PM",
    location: "Meet at Main Gate",
    description:
      "An hour-long walk across campus chasing the best light of the day. All camera types welcome, phones too.",
    seatsLeft: 22,
  },
  {
    id: "open-mic-night",
    title: "Open Mic Night",
    club: "Dramatics Club",
    category: "Performing Arts",
    date: "2026-09-18",
    time: "7:00 PM – 9:30 PM",
    location: "Amphitheatre",
    description:
      "Five minutes, any act — music, poetry, stand-up, monologues. Sign up at the door or in advance.",
    seatsLeft: 30,
  },
  {
    id: "pitch-night",
    title: "Pitch Night: Semester Finals",
    club: "Entrepreneurship Cell",
    category: "Business",
    date: "2026-09-25",
    time: "4:00 PM – 6:30 PM",
    location: "Auditorium",
    description:
      "Eight finalist teams pitch to a panel of alumni founders. Winner gets seed funding for their idea.",
    seatsLeft: 45,
  },
  {
    id: "inter-dept-cricket",
    title: "Inter-Department Cricket: Finals",
    club: "Sports Committee",
    category: "Sports",
    date: "2026-09-10",
    time: "3:00 PM – 6:00 PM",
    location: "Main Ground",
    description:
      "CSE vs Mechanical for the department cup. Snacks stall open from 2:30 PM.",
    seatsLeft: 200,
  },
];

export function getEventById(eventId) {
  return eventsData.find((event) => event.id === eventId) || null;
}
