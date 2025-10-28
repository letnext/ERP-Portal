import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./employeevancey.css";

const BASE_URL=import.meta.env.VITE_BASE_URL;

const Employeevancey = () => {
  const backendURL = `${BASE_URL}/api/vacancies`;

  const [vacancies, setVacancies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    openings: "",
    description: "",
  });
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch vacancies
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(backendURL);
        const data = await res.json();
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  // 🟡 Handle input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🟠 Add new vacancy
  const handleAddVacancy = async (e) => {
    e.preventDefault();
    const { title, openings, description } = form;

    if (!title || !openings || !description) {
      Swal.fire("Warning", "Please fill in all fields.", "warning");
      return;
    }

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          openings: parseInt(openings, 10),
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setVacancies([data, ...vacancies]);
        setForm({ title: "", openings: "", description: "" });

        Swal.fire("Success", "Vacancy added successfully!", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add vacancy", "error");
      }
    } catch (error) {
      console.error("Error adding vacancy:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // ✏️ Save changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const { title, openings, description } = form;

    if (!title || !openings || !description) {
      Swal.fire("Warning", "Please fill in all fields.", "warning");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/${editingVacancy._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          openings: parseInt(openings, 10),
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setVacancies((prev) =>
          prev.map((v) => (v._id === editingVacancy._id ? data : v))
        );
        setEditingVacancy(null);
        setForm({ title: "", openings: "", description: "" });

        Swal.fire("Updated!", "Vacancy updated successfully!", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to update vacancy", "error");
      }
    } catch (error) {
      console.error("Error updating vacancy:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // 🧾 Edit
  const handleEditClick = (vacancy) => {
    setEditingVacancy(vacancy);
    setForm({
      title: vacancy.title,
      openings: vacancy.openings,
      description: vacancy.description,
    });
  };

  // ❌ Delete
  const handleDeleteVacancy = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${backendURL}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setVacancies((prev) => prev.filter((v) => v._id !== id));
        Swal.fire("Deleted!", "Vacancy has been deleted.", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to delete vacancy", "error");
      }
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="vacancy-container">
      <h1 className="vacancy-heading">Job Vacancy Management</h1>

      {/* Form */}
      <form
        className="vacancy-form"
        onSubmit={editingVacancy ? handleSaveChanges : handleAddVacancy}
      >
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="openings"
          placeholder="Number of Openings"
          value={form.openings}
          onChange={handleFormChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleFormChange}
          required
        />
        <div className="button-group">
          <button type="submit" className="add-vacancy-btn">
            {editingVacancy ? "Save Changes" : "Add Vacancy"}
          </button>
          {editingVacancy && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingVacancy(null);
                setForm({ title: "", openings: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p className="loading">Loading vacancies...</p>
        ) : vacancies.length > 0 ? (
          <table className="expand-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Openings</th>
                <th>Description</th>
                <th>Date Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.map((vacancy) => (
                <tr key={vacancy._id}>
                  <td>{vacancy.title}</td>
                  <td>{vacancy.openings}</td>
                  <td>{vacancy.description}</td>
                  <td>{new Date(vacancy.datePosted).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEditClick(vacancy)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVacancy(vacancy._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-records">No job vacancies found.</p>
        )}
      </div>
    </div>
  );
};

export default Employeevancey;
