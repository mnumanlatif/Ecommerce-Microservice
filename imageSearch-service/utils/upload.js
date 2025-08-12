import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory for processing
const upload = multer({ storage });

export default upload;
