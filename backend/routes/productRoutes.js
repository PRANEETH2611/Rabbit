import { Router } from "express";
import Product from "../models/Product.js";
import protect, { admin } from "../middleware/authMiddleware.js";

const router = Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id, // admin who created the product
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating product" });
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating product" });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Find the Product by id
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove the item from DB
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    let sort = {};

    // Filter logic
    if (collection && collection.toLowerCase() !== "all") {
      query.collection = collection;
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort Logic
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort.price = 1;
          break;
        case "priceDesc":
          sort.price = -1;
          break;
        case "popularity":
          sort.rating = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    }

    // Fetch products and apply sorting and limit
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//@route GET /api/products/best-seller
//@desc Retrive the product with highest rating
//@access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestseller = await Product.findOne().sort({ rating: -1 });
    if (bestseller) {
      res.json(bestseller);
    } else {
      res.status(404).json({ message: "No best seller" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});

//@route GET /api/products/new-arrivals
// @desc Retrive latest 8 products - Creation date
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


//@route GET /api/product/:id
//@desc Get a single product bh ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/products/similar/:id
//@desc Retrive similar products based on the current product products gender and category
//@access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
