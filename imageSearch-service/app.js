import express from "express";
import imageSearchRoutes from "./routes/imageSearchRoutes.js";
import cors from 'cors';
const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use("/api/image-search", imageSearchRoutes);

app.get("/", (req, res) => {
  res.send("Image Search Service is running");
});

export default app;
