import Revenue from "../models/Revenue.js";

// Get all records
export const getAllRevenue = async (req, res) => {
  try {
    const records = await Revenue.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue", error: error.message });
  }
};

// Add new record
export const addRevenue = async (req, res) => {
  try {
    const { date, projectName, clientName, amount, employeeName } = req.body;
    if (!date || !projectName || !clientName || !amount || !employeeName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecord = new Revenue({ date, projectName, clientName, amount, employeeName });
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to add record", error: error.message });
  }
};

// Update record
export const updateRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Revenue.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update record", error: error.message });
  }
};

// Delete record
export const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    await Revenue.findByIdAndDelete(id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete record", error: error.message });
  }
};
