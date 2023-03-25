import axios from "axios";

export const getNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${process.env.API_URL}/api/notification/`, config);
  return data;
};

export const readNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(
    `${process.env.API_URL}/api/notification/readNotification/`,
    config
  );
  return data;
};

export const clearNotification = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(
    `${process.env.API_URL}/api/notification/clearNotification`,
    config
  );
  return data;
};
