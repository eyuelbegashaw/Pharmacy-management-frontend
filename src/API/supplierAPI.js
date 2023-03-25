import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getSupplier = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const {data} = await axios.get(`${URL}/api/supplier/`, config);
  return data;
};

export const updateSupplier = async (id, updatedSupplier, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/supplier/${id}`, updatedSupplier, config);
  return data;
};

export const createSupplier = async (newSupplier, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${URL}/api/supplier/`, newSupplier, config);
  return data;
};

export const deleteSupplier = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${URL}/api/supplier/${id}`, config);
  return data;
};