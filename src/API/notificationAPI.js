import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/notification/`, config);
  return data;
};

export const readNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/notification/readNotification/`, config);
  return data;
};

export const clearNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/notification/clearNotification`, config);
  return data;
};
