import axios from "axios";
import {URL} from "../util/url";

export const Login = async newData => {
  const {data} = await axios.post(`${URL}/api/user/login`, newData);
  return data;
};

export const registerUser = async (newUser, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.post(`${URL}/api/user/register`, newUser, config);
  return data;
};

export const updateUser = async (updatedUser, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const {data} = await axios.put(`${URL}/api/user/${updatedUser._id}`, updatedUser, config);
  return data;
};

export const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.delete(`${URL}/api/user/${id}`, config);
  return data;
};

export const getUsers = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/user/`, config);
  return data;
};

export const forgotPassword = async email => {
  const {data} = await axios.put(`${URL}/api/user/forgot-password`, email);
  return data;
};

export const CheckLink = async resetLink => {
  console.log("data1");
  const {data} = await axios.put(`${URL}/api/user/checkLink`, resetLink);
  console.log("data2");
  return data;
};

export const resetPassword = async newPassword => {
  const {data} = await axios.put(`${URL}/api/user/reset-password`, newPassword);
  return data;
};
