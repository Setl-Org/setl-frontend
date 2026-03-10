/**
 * Example service - Template for API service structure.
 * Copy and adapt for entity-specific services.
 */

import api from "@/lib/api";

export const listItems = async (params = {}) => {
  const response = await api.get("/items", { params });
  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (body) => {
  const response = await api.post("/items", body);
  return response.data;
};

export const updateItem = async (id, body) => {
  const response = await api.put(`/items/${id}`, body);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};
