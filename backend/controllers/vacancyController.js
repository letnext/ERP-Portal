import Vacancy from "../models/Vacancy.js";

// ➕ Add new vacancy
export const addVacancy = async (req, res) => {
  try {
    const { title, openings, description } = req.body;

    if (!title || !openings || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newVacancy = await Vacancy.create({ title, openings, description });
    res.status(201).json(newVacancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all vacancies
export const getVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update a vacancy
export const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, openings, description } = req.body;

    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      id,
      { title, openings, description },
      { new: true }
    );

    if (!updatedVacancy)
      return res.status(404).json({ message: "Vacancy not found." });

    res.status(200).json(updatedVacancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete a vacancy
export const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVacancy = await Vacancy.findByIdAndDelete(id);

    if (!deletedVacancy)
      return res.status(404).json({ message: "Vacancy not found." });

    res.status(200).json({ message: "Vacancy deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
