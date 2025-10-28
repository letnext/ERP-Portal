import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./salerydetail.css";

const BASE_URL=import.meta.env.VITE_BASE_URL;

const Salerydetail = () => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    salary: "",
    date: "",
  });
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  const backendURL = `${BASE_URL}/api/salary`;

  // 🟢 Fetch all salary records
  const fetchSalaries = async () => {
    try {
      const res = await fetch(backendURL);
      const data = await res.json();
      if (res.ok) setSalaryRecords(data);
      else Swal.fire("Error", data.message || "Failed to fetch records.", "error");
    } catch (error) {
      console.error("Failed to fetch salary records:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // 🟡 Handle input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🟠 Add or Update a salary record
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const { employeeId, name, salary, date } = form;

    if (!employeeId || !name || !salary || !date) {
      Swal.fire("Missing Fields", "Please fill in all fields.", "warning");
      return;
    }

    const recordData = {
      employeeId: employeeId.trim(),
      name: name.trim(),
      salary: parseFloat(salary),
      date,
      status,
    };

    try {
      const url = editId ? `${backendURL}/${editId}` : backendURL;
      const method = editId ? "PUT" : "POST";

      // ✅ Merged correct fetch method
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: form.employeeId,
          name: form.name,
          salary: form.salary,
          date: form.date,
          status: status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire(
          editId ? "Updated!" : "Added!",
          editId
            ? "Salary record updated successfully."
            : "New salary record added successfully.",
          "success"
        );
        setForm({ employeeId: "", name: "", salary: "", date: "" });
        setStatus("Pending");
        setEditId(null);
        fetchSalaries();
      } else {
        Swal.fire("Error", data.message || "Failed to save record.", "error");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // 🔵 Edit record (load data into form)
  const handleEdit = (record) => {
    setForm({
      employeeId: record.employeeId,
      name: record.name,
      salary: record.salary,
      date: record.date.split("T")[0],
    });
    setStatus(record.status);
    setEditId(record._id);
  };

  // 🔴 Delete record
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${backendURL}/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", "The record has been deleted.", "success");
          fetchSalaries();
        } else {
          Swal.fire("Error", data.message || "Failed to delete record.", "error");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  // 🟣 Change salary status (Credited / Pending)
  const handleStatusChange = async (recordId, newStatus) => {
    try {
      const res = await fetch(`${backendURL}/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setSalaryRecords((prev) =>
          prev.map((r) => (r._id === recordId ? { ...r, status: newStatus } : r))
        );
        Swal.fire("Success", `Status changed to ${newStatus}.`, "success");
      } else {
        Swal.fire("Error", data.message || "Failed to update status.", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 📅 Format month-year
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long" });
  };

  // 📤 Download CSV
  const downloadCSV = () => {
    if (salaryRecords.length === 0) {
      Swal.fire("No Data", "No records to export.", "info");
      return;
    }
    const header = "Employee ID,Name,Salary,Month/Year,Status\n";
    const rows = salaryRecords
      .map(
        (r) =>
          `${r.employeeId},${r.name},${r.salary},${formatDate(r.date)},${r.status}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Salary_Records.csv`;
    a.click();
    Swal.fire("Downloaded!", "Salary CSV exported successfully.", "success");
  };

  return (
    <div className="salerydetail-container">
      <h1 className="salerydetail-heading">Salary Management</h1>

      {/* Form Section */}
      <form className="salerydetail-form" onSubmit={handleAddOrUpdate}>
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
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleFormChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleFormChange}
          required
        />
        <div className="status-selector">
          <label>Status:</label>
          <div>
            <button
              type="button"
              onClick={() => setStatus("Credited")}
              className={`save-btn ${status === "Credited" ? "active" : ""}`}
            >
              Credited
            </button>
            <button
              type="button"
              onClick={() => setStatus("Pending")}
              className={`cancel-btn ${status === "Pending" ? "active" : ""}`}
            >
              Pending
            </button>
          </div>
        </div>

        <button type="submit" className="add-record-btn">
          {editId ? "Update Record" : "Add Record"}
        </button>
      </form>

      {/* Download CSV */}
      <div className="filter-download-container">
        <button onClick={downloadCSV} className="download-btn">
          Download CSV
        </button>
      </div>

      {/* Salary Table */}
      <div className="table-container">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Month/Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryRecords.length > 0 ? (
              salaryRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeId}</td>
                  <td>{record.name}</td>
                  <td>${record.salary.toFixed(2)}</td>
                  <td>{formatDate(record.date)}</td>
                  <td className={record.status.toLowerCase()}>
                    {record.status}
                  </td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleStatusChange(record._id, "Credited")}
                      className="save-btn"
                    >
                      Credited
                    </button>
                    <button
                      onClick={() => handleStatusChange(record._id, "Pending")}
                      className="cancel-btn"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleEdit(record)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No salary records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salerydetail;
