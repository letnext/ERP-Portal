import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./employeedetail.css";

const BASE_URL=import.meta.env.VITE_BASE_URL;

const Employeedetail = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    joiningDate: "",
    workingDays: "",
    leaveDays: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingForm, setEditingForm] = useState({
    employeeId: "",
    name: "",
    joiningDate: "",
    workingDays: "",
    leaveDays: "",
  });

  const API_URL = `${BASE_URL}/api/employee`;

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleEditingFormChange = (e) => {
    const { name, value } = e.target;
    setEditingForm({ ...editingForm, [name]: value });
  };

  // Add new employee
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      Swal.fire({
        icon: "success",
        title: "Employee Added",
        text: `${form.name} has been added successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setForm({
        employeeId: "",
        name: "",
        joiningDate: "",
        workingDays: "",
        leaveDays: "",
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add employee. Please try again.",
      });
    }
  };

  // Edit an employee
  const handleEdit = (index) => {
    const recordToEdit = data[index];
    setEditingIndex(index);
    setEditingForm({ ...recordToEdit });
  };

  // Save edited employee
  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/${editingForm._id}`, editingForm);
      setEditingIndex(null);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: `${editingForm.name}'s details have been updated.`,
        timer: 1500,
        showConfirmButton: false,
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update employee details.",
      });
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingIndex(null);
  };

  // Delete employee with SweetAlert confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Employee record has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete employee.",
        });
      }
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="employee-container">
      <h1 className="employee-heading">Employee Details Management</h1>

      {/* Add Form */}
      <form className="employee-form" onSubmit={handleAdd}>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          type="date"
          name="joiningDate"
          value={form.joiningDate}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="workingDays"
          placeholder="Working Days"
          value={form.workingDays}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="leaveDays"
          placeholder="Leave Days"
          value={form.leaveDays}
          onChange={handleFormChange}
          required
        />
        <button type="submit" className="add-btn">
          Add Employee
        </button>
      </form>

      {/* Table */}
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Joining Date</th>
              <th>Working Days</th>
              <th>Leave Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row._id}>
                  {editingIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="employeeId"
                          value={editingForm.employeeId}
                          onChange={handleEditingFormChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editingForm.name}
                          onChange={handleEditingFormChange}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="joiningDate"
                          value={editingForm.joiningDate.split("T")[0]}
                          onChange={handleEditingFormChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="workingDays"
                          value={editingForm.workingDays}
                          onChange={handleEditingFormChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="leaveDays"
                          value={editingForm.leaveDays}
                          onChange={handleEditingFormChange}
                        />
                      </td>
                      <td className="action-buttons no-print">
                        <button onClick={handleSave} className="save-btn">
                          Save
                        </button>
                        <button onClick={handleCancel} className="cancel-btn">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.employeeId}</td>
                      <td>{row.name}</td>
                      <td>{formatDate(row.joiningDate)}</td>
                      <td>{row.workingDays}</td>
                      <td>{row.leaveDays}</td>
                      <td className="action-buttons no-print">
                        <button
                          onClick={() => handleEdit(index)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No employee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employeedetail;
