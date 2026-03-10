import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/notes/";

// ✅ Get all notes
export const getNotes = async () => {
  return await axios.get(API_URL, { headers: authHeader() });
};

// ✅ Get single note
export const getNote = async (id) => {
  return await axios.get(`${API_URL}${id}/`, { headers: authHeader() });
};

// ✅ Create note
export const createNote = async (note) => {
  return await axios.post(`${API_URL}create/`, note, { headers: authHeader() });
};

// ✅ Update note
export const updateNote = async (id, note) => {
  return await axios.put(`${API_URL}update/${id}/`, note, { headers: authHeader() });
};

// ✅ Delete note
export const deleteNote = async (id) => {
  return await axios.delete(`${API_URL}delete/${id}/`, { headers: authHeader() });
};
