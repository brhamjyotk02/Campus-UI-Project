import { assignmentsData } from "../data/mockData";

export function getAssignments() {
  return assignmentsData;
}

export function getAssignmentById(id) {
  return assignmentsData.find((item) => item.id === Number(id));
}