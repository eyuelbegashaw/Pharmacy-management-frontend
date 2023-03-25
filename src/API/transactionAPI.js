import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getTransaction = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/transaction/`, config);
  return data;
};

export const getDailyTransaction = async (newTransaction, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/transaction/daily`, newTransaction, config);
  return data;
};

export const createTransaction = async (newTransaction, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${URL}/api/transaction/`, newTransaction, config);
  return data;
};

export const deleteTransaction = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${URL}/api/transaction/${id}`, config);
  return data;
};
