import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import subsciberRoutes from "./routes/subscriberRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import productAdminRoutes from "./routes/productAdminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://rabbit-n685.vercel.app", // frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subsciberRoutes);

// Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
