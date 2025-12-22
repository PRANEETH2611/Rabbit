import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import checkoutRoutes from "./routes/checkoutRoutes.js"

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
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
