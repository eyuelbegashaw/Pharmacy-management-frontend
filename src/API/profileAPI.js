import axios from "axios";

export const getProfile = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.get(`${process.env.API_URL}/api/user/profile/`, config);
  return data;
};

export const updateProfile = async (updatedProfile, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {data} = await axios.put(`${process.env.API_URL}/api/user/profile`, updatedProfile, config);
  return data;
};
