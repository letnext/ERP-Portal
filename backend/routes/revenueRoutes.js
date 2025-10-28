import express from "express";
import {
  getAllRevenue,
  addRevenue,
  updateRevenue,
  deleteRevenue,
} from "../controllers/revenueController.js";

const router = express.Router();

router.get("/", getAllRevenue);
router.post("/", addRevenue);
router.put("/:id", updateRevenue);
router.delete("/:id", deleteRevenue);

export default router;
