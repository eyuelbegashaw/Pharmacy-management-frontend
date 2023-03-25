import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getDrug = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/drug/`, config);
  return data;
};

export const getExpiredDrug = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/drug/expiredDrugs/`, config);
  return data;
};

export const getLowStockDrug = async (quantity, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/drug/lowStockDrugs/`, quantity, config);
  return data;
};

export const getExpiringSoonDrugs = async (days, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/drug/drugsExpiringSoon/`, days, config);
  return data;
};

export const getDailyStock = async (filter, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/drug/dailyStock`, filter, config);
  return data;
};

export const updateDrug = async (updatedDrug, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/drug/${updatedDrug._id}`, updatedDrug, config);
  return data;
};

export const createDrug = async (newDrug, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${URL}/api/drug/`, newDrug, config);
  return data;
};

export const deleteDrug = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${URL}/api/drug/${id}`, config);
  return data;
};
