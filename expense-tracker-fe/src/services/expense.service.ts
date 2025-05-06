
import { Expense } from "../interfaces/Expense";
import api from "./api";

export const fetchAllExpenses = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user || !user.id) throw new Error("User not logged in");

  const response = await api.get(`/expenses/`);
  return response.data;
};

export const fetchExpenses = async (page = 1, limit = 5) => {
  try {
    const response = await api.get(`/expenses/?page=${page}&page_size=${limit}`);
    const totalCount = response.data.count || 0;

    return {
      data: response.data.results || response.data, totalCount,
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const addExpense = async (data: Expense) => {
  const response = await api.post(`/expenses/`, data);
  return response.data;
};



const expenseService = {
  addExpense,
  fetchAllExpenses,
  fetchExpenses,
};

export default expenseService
