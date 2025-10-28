import mongoose from "mongoose";

const expenditureSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    expenditure: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Expenditure = mongoose.model("Expenditure", expenditureSchema);
export default Expenditure;
