import express from "express";
import {
  getAllExpenditures,
  addExpenditure,
  updateExpenditure,
  deleteExpenditure,
} from "../controllers/expenditureController.js";

const router = express.Router();

router.get("/", getAllExpenditures);
router.post("/", addExpenditure);
router.put("/:id", updateExpenditure);
router.delete("/:id", deleteExpenditure);

export default router;
