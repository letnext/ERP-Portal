import express from "express";
import { getAllStaffs, addStaff, deleteStaff, saveAttendance, getAllAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/staffs", getAllStaffs);
router.post("/staffs", addStaff);
router.delete("/staffs/:name", deleteStaff);

router.post("/save", saveAttendance);
router.get("/", getAllAttendance);

export default router;
