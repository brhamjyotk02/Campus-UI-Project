const API_URL = "https://dummyjson.com/users?limit=100";

const departments = [
  "CSE",
  "ECE",
  "Mechanical",
  "Civil",
  "Electrical"
];

export async function fetchDirectory() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Unable to fetch directory data.");
  }

  const data = await response.json();

  if (!Array.isArray(data.users)) {
    throw new Error("Invalid directory data received.");
  }

  return data.users.map((user, index) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    department: departments[index % departments.length],
    role: index % 5 === 0 ? "Faculty" : "Student"
  }));
}
