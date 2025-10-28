import Salary from "../models/Salary.js";

// Create salary record
export const createSalary = async (req, res) => {
  try {
    const { employeeId, name, salary, date, status } = req.body;

    if (!employeeId || !name || !salary || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSalary = new Salary({
      employeeId,
      name,
      salary,
      date,
      status,
    });

    await newSalary.save();
    res.status(201).json(newSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all salaries
export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ date: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update salary record
export const updateSalary = async (req, res) => {
  try {
    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete salary record
export const deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
