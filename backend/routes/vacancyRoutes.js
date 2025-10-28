import express from "express";
import {
  addVacancy,
  getVacancies,
  updateVacancy,
  deleteVacancy,
} from "../controllers/vacancyController.js";

const router = express.Router();

router.route("/")
  .get(getVacancies)
  .post(addVacancy);

router.route("/:id")
  .put(updateVacancy)
  .delete(deleteVacancy);

export default router;
