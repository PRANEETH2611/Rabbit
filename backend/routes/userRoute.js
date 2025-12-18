import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/authMiddleware.js";

const router = Router();

//@route POST/api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Registration logic

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        //Send the user token in response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//@route POST /api/users/login
//@desc Authentication user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        //Send the user token in response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error")
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile [protected route]
// @access private
router.get("/profile", protect , async (req, res) => {
  res.json(req.user);

})

export default router;
