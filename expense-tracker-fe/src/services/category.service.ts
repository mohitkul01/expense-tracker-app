import api from "./api";

export const fetchAllCategories = async () => {
  const response = await api.get(`/categories/`);
  return response.data;
};

export const addCategories = async () => {
    const response = await api.post(`/categories/`)
    return response.data;
}