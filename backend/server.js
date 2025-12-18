import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js"

const app = express();
app.use(json());
app.use(cors());

config();

const port = process.env.PORT || 3000;

//connect to mongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
