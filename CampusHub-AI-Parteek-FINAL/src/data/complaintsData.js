// Seed data for Complaints. Complaints.jsx copies this into localStorage
// the first time it runs, then reads/writes localStorage after that —
// so submissions survive a refresh.

export const complaintCategories = [
  "Wi-Fi",
  "Electricity",
  "Water Supply",
  "Furniture",
  "Cleanliness",
  "Other",
];

export const complaintStatuses = ["Pending", "In Progress", "Resolved"];

export const seedComplaints = [
  {
    id: "C001",
    category: "Wi-Fi",
    location: "Lab 4",
    description: "Wi-Fi drops every few minutes during afternoon classes.",
    status: "Pending",
    createdAt: "2026-09-01",
  },
  {
    id: "C002",
    category: "Furniture",
    location: "Room 214",
    description: "Two chairs in the back row are broken.",
    status: "In Progress",
    createdAt: "2026-08-28",
  },
];
