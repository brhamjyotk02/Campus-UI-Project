export const COMPLAINT_CATEGORIES = ["Wi-Fi", "Electricity", "Water Supply", "Furniture", "Cleanliness", "Other"];
export const COMPLAINT_STATUSES = ["Pending", "In Progress", "Resolved"];

// Shown the first time the app runs, then everything lives in localStorage.
export const SEED_COMPLAINTS = [
  { id: "001", category: "Wi-Fi", location: "Lab 4", description: "Wi-Fi drops every few minutes during afternoon classes.", status: "Pending", createdAt: "2026-10-18" },
  { id: "002", category: "Furniture", location: "Room 214", description: "Two chairs in the back row are broken.", status: "In Progress", createdAt: "2026-10-15" },
];
