import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  leaveDays: {
    type: Number,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
