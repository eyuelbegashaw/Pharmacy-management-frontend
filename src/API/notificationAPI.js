import axios from "axios";
import {URL} from "../util/url";

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
