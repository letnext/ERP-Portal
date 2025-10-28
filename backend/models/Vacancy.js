import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    openings: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Vacancy = mongoose.model("Vacancy", vacancySchema);
export default Vacancy;
