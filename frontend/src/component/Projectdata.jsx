import React, { useState, useEffect } from "react";
import "./projectdata.css";
import Swal from "sweetalert2";

const BASE_URL=import.meta.env.VITE_BASE_URL;

const Projectdata = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    team: "",
    startDate: "",
    endDate: "",
    status: "On Going",
  });
  const [editingProject, setEditingProject] = useState(null);

  const API_URL = `${BASE_URL}/api/projects`;

  // Fetch all projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Project Added",
          text: "New project added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        setForm({ name: "", team: "", startDate: "", endDate: "", status: "On Going" });
        fetchProjects();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add project.",
        });
      }
    } catch (error) {
      console.error("Error adding project:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  // Save changes (update project)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Project Updated",
          text: "Changes saved successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        setEditingProject(null);
        setForm({ name: "", team: "", startDate: "", endDate: "", status: "On Going" });
        fetchProjects();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update project.",
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Project has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchProjects();
        } catch (error) {
          console.error("Error deleting project:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete project.",
          });
        }
      }
    });
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      team: project.team,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
    });
  };

  return (
    <div className="project-container">
      <h1 className="project-heading">Project Data Management</h1>

      <form
        className="project-form"
        onSubmit={editingProject ? handleSaveChanges : handleAddProject}
      >
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Project Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Team Members</label>
          <input
            type="text"
            name="team"
            value={form.team}
            onChange={handleFormChange}
            placeholder="e.g., John, Jane, Mike"
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleFormChange}>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Time-Out-Dated">Time-Out-Dated</option>
            <option value="Processing">Processing</option>
            <option value="On Going">On Going</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingProject ? "Save Changes" : "Add Project"}
          </button>
          {editingProject && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingProject(null);
                setForm({ name: "", team: "", startDate: "", endDate: "", status: "On Going" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-container">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Team</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.team}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                  <td>
                    <span
                      className={`status-badge ${p.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="button-group">
                    <button className="edit-btn" onClick={() => handleEditClick(p)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProject(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projectdata;
