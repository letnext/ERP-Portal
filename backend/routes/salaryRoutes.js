import express from "express";
import {
  createSalary,
  getSalaries,
  updateSalary,
  deleteSalary,
} from "../controllers/salaryController.js";

const router = express.Router();

router.post("/", createSalary);
router.get("/", getSalaries);
router.put("/:id", updateSalary);
router.delete("/:id", deleteSalary);

export default router;
