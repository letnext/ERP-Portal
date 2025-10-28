import express from "express";
const router = express.Router();

// Fixed login credentials
const ADMIN_EMAIL = "sabari@gmail.com";
const ADMIN_PASSWORD = "sabari@2002";

// POST /api/login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { email },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});

export default router;
