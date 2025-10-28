import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Time-Out-Dated", "Processing", "On Going"],
    default: "On Going",
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
