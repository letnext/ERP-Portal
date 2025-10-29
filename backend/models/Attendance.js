import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: String,
  employee: String,
  status: String,
  reason: String,
});

export default mongoose.model("Attendance", attendanceSchema);
