import api from "./api";

export const searchProductsByImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error("Please select an image.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post(
    "/ai/search-image",
    formData,
    {
      timeout: 45000,
    }
  );

  return response.data;
};
