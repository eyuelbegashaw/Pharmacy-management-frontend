import axios from "axios";

export const getCategory = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${process.env.API_URL}/api/category/`, config);
  return data;
};

export const updateCategory = async (updatedCategory, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(
    `${process.env.API_URL}/api/category/${updatedCategory.id}`,
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
  const {data} = await axios.post(`${process.env.API_URL}/api/category/`, newCategory, config);
  return data;
};

export const deleteCategory = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${process.env.API_URL}/api/category/${id}`, config);
  return data;
};
