import axios from "axios";

/**
 * Upload an image to Cloudinary using a short-lived signature minted by our
 * server, so the API secret never reaches the browser.
 *
 * Extracted from the product form so the category form uses the same path
 * rather than a second copy that can drift.
 *
 * @param {File} file
 * @param {import("axios").AxiosInstance} axiosSecure authenticated instance
 * @returns {Promise<string>} the secure_url of the uploaded image
 */
export const uploadToCloudinary = async (file, axiosSecure) => {
  const { data: sig } = await axiosSecure.get("/admin/cloudinary-signature");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);

  const { data: uploaded } = await axios.post(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    formData
  );
  return uploaded.secure_url;
};

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
