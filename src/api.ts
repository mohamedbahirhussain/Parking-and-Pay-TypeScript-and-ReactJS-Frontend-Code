import axios from 'axios';

// Define the User interface
export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  role: string;
  password: string;
}

const API_URL = 'http://localhost:8080/api/users';

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(API_URL);
  return response.data;
};

// Create a new user
export const createUser = async (user: User): Promise<User> => {
  const response = await axios.post<User>(API_URL, user);
  return response.data;
};

// Update an existing user
export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${id}`, user);
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
