import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getCategory = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/category/`, config);
  return data;
};

export const updateCategory = async (updatedCategory, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(
    `${URL}/api/category/${updatedCategory.id}`,
    updatedCategory,
    config
  );
  return data;
};

export const createCategory = async (newCategory, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${URL}/api/category/`, newCategory, config);
  return data;
};

export const deleteCategory = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${URL}/api/category/${id}`, config);
  return data;
};
