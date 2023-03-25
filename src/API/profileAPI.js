import axios from "axios";

const URL = "http://127.0.0.1:5000";

export const getProfile = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${URL}/api/user/profile/`, config);
  return data;
};

export const updateProfile = async (updatedProfile, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${URL}/api/user/profile`, updatedProfile, config);
  return data;
};
