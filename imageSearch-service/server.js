import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Image Search Service running on port ${PORT}`);
});
