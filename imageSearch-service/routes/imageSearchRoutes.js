import express from "express";
import upload from "../utils/upload.js";
import { handleImageSearch } from "../controllers/imageSearchController.js";

const router = express.Router();

router.post("/", upload.single("image"), handleImageSearch);

export default router;
