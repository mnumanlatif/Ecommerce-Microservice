import { searchByImage } from "../services/imageSearchService.js";

export const handleImageSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const results = await searchByImage(req.file.buffer);
    res.json(results);
  } catch (error) {
    console.error("Error in handleImageSearch:", error.message);
    res.status(500).json({ error: "Image search failed" });
  }
};
