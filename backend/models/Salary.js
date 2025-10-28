import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: String, // ✅ Changed from ObjectId to String
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Credited", "Pending"], // ✅ Match your frontend
    default: "Pending",
  },
});

export default mongoose.model("Salary", salarySchema);
