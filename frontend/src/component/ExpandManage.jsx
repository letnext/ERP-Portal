import React, { useState, useEffect } from "react";
import "./expandmanage.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Swal from "sweetalert2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/expenditure`;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExpandManager = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // ✅ New month filter state
  const [form, setForm] = useState({
    date: "",
    name: "",
    expenditure: "",
    amount: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingForm, setEditingForm] = useState({
    date: "",
    name: "",
    expenditure: "",
    amount: "",
  });
  const [showTable, setShowTable] = useState(true);
  const [chartView, setChartView] = useState("monthly");

  const fetchRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to fetch data from server.", "error");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.name || !form.expenditure || !form.amount) {
      Swal.fire("Missing Fields", "Please fill all the fields.", "warning");
      return;
    }
    const newRecord = {
      date: form.date,
      name: form.name,
      expenditure: form.expenditure,
      amount: parseFloat(form.amount),
    };

    try {
      await axios.post(API_URL, newRecord);
      setForm({ date: "", name: "", expenditure: "", amount: "" });
      fetchRecords();
      Swal.fire("Success", "Record added successfully!", "success");
    } catch (error) {
      console.error("Error adding record:", error);
      Swal.fire("Error", "Failed to add record.", "error");
    }
  };

  const handleEdit = (record) => {
    setEditingIndex(record._id);
    const formattedDate = record.date ? record.date.split("T")[0] : "";
    setEditingForm({
      date: formattedDate,
      name: record.name,
      expenditure: record.expenditure,
      amount: record.amount,
    });
  };

  const handleSave = async () => {
    if (!editingForm.date || !editingForm.name || !editingForm.expenditure || !editingForm.amount) {
      Swal.fire("Missing Fields", "Please fill all the fields before saving.", "warning");
      return;
    }

    const updatedRecord = { ...editingForm, amount: parseFloat(editingForm.amount) };

    try {
      await axios.put(`${API_URL}/${editingIndex}`, updatedRecord);
      setEditingIndex(null);
      setEditingForm({ date: "", name: "", expenditure: "", amount: "" });
      fetchRecords();
      Swal.fire("Saved!", "Record updated successfully.", "success");
    } catch (error) {
      console.error("Error saving record:", error);
      Swal.fire("Error", "Failed to save changes.", "error");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingForm({ date: "", name: "", expenditure: "", amount: "" });
    Swal.fire("Cancelled", "Editing has been cancelled.", "info");
  };

  const handleDelete = async (recordId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${recordId}`);
        fetchRecords();
        Swal.fire("Deleted!", "Record deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting record:", error);
        Swal.fire("Error", "Failed to delete record.", "error");
      }
    }
  };

  // ✅ Filtering logic
  const filteredData = data.filter((item) => {
    const recordDate = new Date(item.date);
    const today = new Date();

    const isToday =
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear();
    const isThisMonth =
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear();
    const isThisYear = recordDate.getFullYear() === today.getFullYear();

    if (filter === "day" && !isToday) return false;
    if (filter === "month" && !isThisMonth) return false;
    if (filter === "year" && !isThisYear) return false;

    // ✅ If user selected a specific month
    if (selectedMonth) {
      const selected = new Date(selectedMonth);
      if (
        recordDate.getMonth() !== selected.getMonth() ||
        recordDate.getFullYear() !== selected.getFullYear()
      ) {
        return false;
      }
    }

    if (
      search &&
      !(
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.expenditure.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  const totalExpenditure = filteredData.reduce((sum, record) => sum + record.amount, 0);

  const handlePrint = () => {
    const printContent = document.getElementById("print-section");
    const printWindow = window.open("", "", "width=1000,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Records</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            body { font-family: Arial, sans-serif; margin: 20px; }
          </style>
        </head>
        <body>
          <h2>Company Expenditure Records</h2>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatDate = (dateStr) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-GB", options);
    } catch (e) {
      return dateStr;
    }
  };

  const getChartData = () => {
    const dataGrouped = {};
    let labelFormat;

    if (chartView === "monthly") {
      labelFormat = { month: "short", year: "numeric" };
    } else {
      labelFormat = { year: "numeric" };
    }

    filteredData.forEach((record) => {
      const label = new Date(record.date).toLocaleString("default", labelFormat);
      dataGrouped[label] = (dataGrouped[label] || 0) + record.amount;
    });

    return {
      labels: Object.keys(dataGrouped),
      datasets: [
        {
          label: "Expenditure",
          data: Object.values(dataGrouped),
          borderColor: "#dc3545",
          backgroundColor: "rgba(220, 53, 69, 0.5)",
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text:
          chartView === "monthly"
            ? "Monthly Expenditure Chart"
            : "Yearly Expenditure Chart",
      },
    },
  };

  return (
    <div className="expand-container">
      <h1 className="expand-heading">Company Expenditure Management</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Expenditure Type"
          value={form.expenditure}
          onChange={(e) => setForm({ ...form, expenditure: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (INR)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <button type="submit" className="add-btn">
          Add Record
        </button>
      </form>

      <div className="utility-bar">
        <input
          type="text"
          placeholder="Search by Name or Expenditure"
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="button-group">
          <div className="filter-buttons">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              All
            </button>
            <button className={filter === "day" ? "active" : ""} onClick={() => setFilter("day")}>
              Today
            </button>
            <button className={filter === "month" ? "active" : ""} onClick={() => setFilter("month")}>
              This Month
            </button>
            <button className={filter === "year" ? "active" : ""} onClick={() => setFilter("year")}>
              This Year
            </button>
          </div>

          {/* ✅ New month picker */}
          <input
            type="month"
            className="month-selector"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />

          <div className="view-toggle">
            <button className={showTable ? "active" : ""} onClick={() => setShowTable(true)}>
              Table View
            </button>
            <button className={!showTable ? "active" : ""} onClick={() => setShowTable(false)}>
              Chart View
            </button>
          </div>
          <button className="print-btn" onClick={handlePrint}>
            Print Records
          </button>
        </div>
      </div>

      <div className="total-expenditure">
        Total Expenditure: <span>₹ {totalExpenditure.toLocaleString()}</span>
      </div>

      {showTable ? (
        <div className="table-responsive" id="print-section">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Expenditure</th>
                <th>Amount (INR)</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row._id}>
                    {editingIndex === row._id ? (
                      <>
                        <td>
                          <input
                            type="date"
                            className="edit-input"
                            value={editingForm.date}
                            onChange={(e) =>
                              setEditingForm({ ...editingForm, date: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingForm.name}
                            onChange={(e) =>
                              setEditingForm({ ...editingForm, name: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingForm.expenditure}
                            onChange={(e) =>
                              setEditingForm({ ...editingForm, expenditure: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="edit-input"
                            value={editingForm.amount}
                            onChange={(e) =>
                              setEditingForm({ ...editingForm, amount: e.target.value })
                            }
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
                        <td>{formatDate(row.date)}</td>
                        <td>{row.name}</td>
                        <td>{row.expenditure}</td>
                        <td>₹ {row.amount.toLocaleString()}</td>
                        <td className="action-buttons no-print">
                          <button onClick={() => handleEdit(row)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(row._id)} className="delete-btn">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-section">
          <div className="chart-view-buttons">
            <button
              className={chartView === "monthly" ? "active" : ""}
              onClick={() => setChartView("monthly")}
            >
              Monthly
            </button>
            <button
              className={chartView === "yearly" ? "active" : ""}
              onClick={() => setChartView("yearly")}
            >
              Yearly
            </button>
          </div>
          <Line data={getChartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ExpandManager;
