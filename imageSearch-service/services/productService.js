import axios from "axios";

export const getProductsByKeywords = async (keywords) => {
  try {
    const response = await axios.post(process.env.PRODUCT_SERVICE_URL, { keywords });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
};
