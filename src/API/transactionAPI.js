import axios from "axios";

export const getTransaction = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${process.env.API_URL}/api/transaction/`, config);
  return data;
};

export const getDailyTransaction = async (newTransaction, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(
    `${process.env.API_URL}/api/transaction/daily`,
    newTransaction,
    config
  );
  return data;
};

export const createTransaction = async (newTransaction, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(
    `${process.env.API_URL}/api/transaction/`,
    newTransaction,
    config
  );
  return data;
};

export const deleteTransaction = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${process.env.API_URL}/api/transaction/${id}`, config);
  return data;
};
