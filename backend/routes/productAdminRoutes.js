import express, { Router } from "express";
import Product from "../models/Product.js";
import protect, { admin } from "../middleware/authMiddleware.js";

const router = Router();

// @route   GET /api/admin/products
// @desc    Get all products (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    console.log("DELETE PRODUCT HIT:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    // IMPORTANT: return deleted id for Redux
    res.json(req.params.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
