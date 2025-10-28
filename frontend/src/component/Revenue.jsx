import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./revenue.css";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Revenue = () => {
  const API_URL = `${BASE_URL}/api/revenue`;

  const [revenueData, setRevenueData] = useState([]);
  const [form, setForm] = useState({
    date: "",
    projectName: "",
    clientName: "",
    amount: "",
    employeeName: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({
    date: "",
    projectName: "",
    clientName: "",
    amount: "",
    employeeName: "",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(""); // ✅ new month filter
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartView, setChartView] = useState("monthly");
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const res = await axios.get(API_URL);
      setRevenueData(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch data", "error");
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const { date, projectName, clientName, amount, employeeName } = form;
    if (!date || !projectName || !clientName || !amount || !employeeName) {
      Swal.fire("Warning", "Please fill in all fields.", "warning");
      return;
    }
    try {
      await axios.post(API_URL, { ...form, amount: parseFloat(amount) });
      setForm({
        date: "",
        projectName: "",
        clientName: "",
        amount: "",
        employeeName: "",
      });
      Swal.fire("Success", "Record added successfully!", "success");
      fetchRevenueData();
    } catch (error) {
      Swal.fire("Error", "Error adding record", "error");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setEditingForm({
      date: record.date.split("T")[0],
      projectName: record.projectName,
      clientName: record.clientName,
      amount: record.amount,
      employeeName: record.employeeName,
    });
  };

  const handleSave = async () => {
    const { date, projectName, clientName, amount, employeeName } = editingForm;
    if (!date || !projectName || !clientName || !amount || !employeeName) {
      Swal.fire("Warning", "Please fill in all fields.", "warning");
      return;
    }
    try {
      await axios.put(`${API_URL}/${editingId}`, {
        ...editingForm,
        amount: parseFloat(amount),
      });
      setEditingId(null);
      Swal.fire("Updated", "Record updated successfully!", "success");
      fetchRevenueData();
    } catch (error) {
      Swal.fire("Error", "Error updating record", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchRevenueData();
        Swal.fire("Deleted!", "Record has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Error deleting record", "error");
      }
    }
  };

  // ✅ Filter by search, date range, and month
  const filteredData = revenueData.filter((record) => {
    const searchLower = search.toLowerCase();
    const recordDate = new Date(record.date);
    const today = new Date();

    const isMatch =
      record.projectName.toLowerCase().includes(searchLower) ||
      record.clientName.toLowerCase().includes(searchLower) ||
      record.employeeName.toLowerCase().includes(searchLower);

    const isToday =
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear();

    const isThisMonth =
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear();

    const isThisYear = recordDate.getFullYear() === today.getFullYear();

    const matchesMonthFilter = monthFilter
      ? record.date.startsWith(monthFilter)
      : true;

    if (filter === "day" && !isToday) return false;
    if (filter === "month" && !isThisMonth) return false;
    if (filter === "year" && !isThisYear) return false;
    if (!matchesMonthFilter) return false;

    return isMatch;
  });

  useEffect(() => {
    const total = filteredData.reduce((sum, record) => sum + record.amount, 0);
    setTotalRevenue(total);
  }, [filteredData]);

  const getChartData = () => {
    if (chartView === "monthly") {
      const monthlyData = {};
      filteredData.forEach((record) => {
        const month = new Date(record.date).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthlyData[month] = (monthlyData[month] || 0) + record.amount;
      });
      return {
        labels: Object.keys(monthlyData),
        datasets: [
          {
            label: "Revenue",
            data: Object.values(monthlyData),
            borderColor: "#42A5F5",
            backgroundColor: "rgba(66, 165, 245, 0.5)",
            tension: 0.1,
          },
        ],
      };
    } else {
      const yearlyData = {};
      filteredData.forEach((record) => {
        const year = new Date(record.date).getFullYear().toString();
        yearlyData[year] = (yearlyData[year] || 0) + record.amount;
      });
      return {
        labels: Object.keys(yearlyData),
        datasets: [
          {
            label: "Revenue",
            data: Object.values(yearlyData),
            borderColor: "#FFA726",
            backgroundColor: "rgba(255, 167, 38, 0.5)",
            tension: 0.1,
          },
        ],
      };
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${chartView.charAt(0).toUpperCase() + chartView.slice(1)} Revenue Chart`,
      },
    },
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=650");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Revenue Records</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Revenue Records</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="revenue-container">
      <h1 className="revenue-heading">Revenue Management</h1>

      <form className="revenue-form" onSubmit={handleAddRecord}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Project Name"
          value={form.projectName}
          onChange={(e) => setForm({ ...form, projectName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Client Name"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (INR)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Employee Name"
          value={form.employeeName}
          onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
        />
        <button type="submit" className="add-record-btn">
          Add Record
        </button>
      </form>

      <div className="utility-bar">
        <input
          type="text"
          placeholder="Search..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ Month filter input */}
        <input
          type="month"
          className="month-selector"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />

        <div className="button-group">
          <div className="filter-buttons">
            {["all", "day", "month", "year"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All"
                  : f === "day"
                  ? "Today"
                  : f === "month"
                  ? "This Month"
                  : "This Year"}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={showTable ? "active" : ""}
              onClick={() => setShowTable(true)}
            >
              Table View
            </button>
            <button
              className={!showTable ? "active" : ""}
              onClick={() => setShowTable(false)}
            >
              Chart View
            </button>
          </div>
          <button className="print-btn" onClick={handlePrint}>
            Print Records
          </button>
        </div>
      </div>

      <div className="total-expenditure">
        Total Revenue: <span>₹ {totalRevenue.toLocaleString()}</span>
      </div>

      {showTable ? (
        <div id="print-section" className="table-responsive">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Amount (INR)</th>
                <th>Employee Name</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record._id}>
                    {editingId === record._id ? (
                      <>
                        <td>
                          <input
                            type="date"
                            className="edit-input"
                            value={editingForm.date}
                            onChange={(e) =>
                              setEditingForm({
                                ...editingForm,
                                date: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingForm.projectName}
                            onChange={(e) =>
                              setEditingForm({
                                ...editingForm,
                                projectName: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingForm.clientName}
                            onChange={(e) =>
                              setEditingForm({
                                ...editingForm,
                                clientName: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="edit-input"
                            value={editingForm.amount}
                            onChange={(e) =>
                              setEditingForm({
                                ...editingForm,
                                amount: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="edit-input"
                            value={editingForm.employeeName}
                            onChange={(e) =>
                              setEditingForm({
                                ...editingForm,
                                employeeName: e.target.value,
                              })
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
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.projectName}</td>
                        <td>{record.clientName}</td>
                        <td>₹ {record.amount.toLocaleString()}</td>
                        <td>{record.employeeName}</td>
                        <td className="action-buttons no-print">
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
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No records found</td>
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
          <div className="chart-container">
            <Line data={getChartData()} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
