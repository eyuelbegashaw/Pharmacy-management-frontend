import axios from "axios";

export const getSupplier = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const {data} = await axios.get(`${process.env.API_URL}/api/supplier/`, config);
  return data;
};

export const updateSupplier = async (id, updatedSupplier, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(
    `${process.env.API_URL}/api/supplier/${id}`,
    updatedSupplier,
    config
  );
  return data;
};

export const createSupplier = async (newSupplier, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${process.env.API_URL}/api/supplier/`, newSupplier, config);
  return data;
};

export const deleteSupplier = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${process.env.API_URL}/api/supplier/${id}`, config);
  return data;
};
