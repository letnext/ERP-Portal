import Expenditure from "../models/Expenditure.js";

// ✅ Get all records
export const getAllExpenditures = async (req, res) => {
  try {
    const records = await Expenditure.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
};

// ✅ Add new record
export const addExpenditure = async (req, res) => {
  try {
    const { date, name, expenditure, amount } = req.body;

    if (!date || !name || !expenditure || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecord = new Expenditure({ date, name, expenditure, amount });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: "Failed to add record", error: error.message });
  }
};

// ✅ Update record by ID
export const updateExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Expenditure.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update record", error: error.message });
  }
};

// ✅ Delete record by ID
export const deleteExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    await Expenditure.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete record", error: error.message });
  }
};
