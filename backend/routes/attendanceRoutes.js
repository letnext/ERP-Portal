import express from "express";
import {
  getAllStaffs,
  addStaff,
  deleteStaff,
  editStaff,
  saveAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/staffs", getAllStaffs);
router.post("/staffs", addStaff);
router.put("/staffs/:oldName", editStaff); // ✅ added edit route
router.delete("/staffs/:name", deleteStaff);
router.post("/save", saveAttendance);
router.get("/", getAllAttendance);

export default router;
