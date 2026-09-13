import { notesData } from "../data/mockData";

export function getNotes() {
  return notesData;
}

export function getNoteById(id) {
  return notesData.find((item) => item.id === Number(id));
}