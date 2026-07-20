const getProductImageUrl = (image, name = "Product") => {
  if (!image || !String(image).trim()) {
    return `https://via.placeholder.com/600x400?text=${encodeURIComponent(name || "No Image")}`;
  }

  const value = String(image).trim();

  if (/^https?:\/\//i.test(value) || /^data:/i.test(value) || value.startsWith("blob:")) {
    return value;
  }

  const normalized = value.replace(/\\/g, "/");
  const baseUrl = import.meta.env.VITE_API_URL || "https://futureforge-ai-server.onrender.com";

  if (normalized.startsWith("/")) {
    return `${baseUrl}${normalized}`;
  }

  if (normalized.startsWith("uploads/")) {
    return `${baseUrl}/${normalized}`;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.includes("/uploads/")) {
    const fileName = normalized.split("/uploads/").pop();
    return `${baseUrl}/uploads/${fileName}`;
  }

  if (normalized.includes("\\uploads\\")) {
    const fileName = normalized.split(/[/\\]+uploads[/\\]+/).pop();
    return `${baseUrl}/uploads/${fileName}`;
  }

  if (/^[a-zA-Z]:\//.test(normalized)) {
    const fileName = normalized.split(/[\\/]/).pop();
    return `${baseUrl}/uploads/${fileName}`;
  }

  return `${baseUrl}/uploads/${normalized}`;
};

export default getProductImageUrl;
