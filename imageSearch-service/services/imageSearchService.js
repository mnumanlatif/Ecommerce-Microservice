import vision from "@google-cloud/vision";
import { getProductsByKeywords } from "./productService.js";

const client = new vision.ImageAnnotatorClient();

export const searchByImage = async (imageBuffer) => {
  // Detect objects/labels from image
  const [result] = await client.labelDetection({ image: { content: imageBuffer } });
  const labels = result.labelAnnotations.map(label => label.description);

  console.log("Detected labels:", labels);

  // Send labels to product-service
  const products = await getProductsByKeywords(labels);

  return { labels, products };
};
