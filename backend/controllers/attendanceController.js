import Attendance from "../models/Attendance.js";
import Staff from "../models/Staff.js";

export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addStaff = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Staff.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Employee already exists" });
    const staff = new Staff({ name });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    await Staff.findOneAndDelete({ name: req.params.name });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveAttendance = async (req, res) => {
  try {
    const { date, employee, status, reason } = req.body;
    const existing = await Attendance.findOne({ date, employee });
    if (existing) {
      existing.status = status;
      existing.reason = reason;
      await existing.save();
    } else {
      await Attendance.create({ date, employee, status, reason });
    }
    res.status(200).json({ message: "Attendance saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
