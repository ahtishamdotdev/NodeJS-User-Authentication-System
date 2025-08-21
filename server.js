import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log(" Starting server...");

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(` Server running on http:
  });
} catch (err) {
  console.error(" Failed to start server:", err);
  process.exit(1);
}
