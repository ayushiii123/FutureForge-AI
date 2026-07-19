import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data.user;
};

export const updateProfile = async (formData) => {
  const res = await api.put(
    "/users/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};