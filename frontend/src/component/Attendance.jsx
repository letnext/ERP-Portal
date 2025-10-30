import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./attendance.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Show message temporarily
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  // ✅ Fetch employees & attendance from backend
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const empRes = await fetch(`${BASE_URL}/api/attendance/staffs`);
        const empData = await empRes.json();

        if (!Array.isArray(empData)) {
          showMessage("Invalid employee data received");
          return;
        }

        setEmployees(empData.map((e) => e.name));

        const attRes = await fetch(`${BASE_URL}/api/attendance`);
        const attData = await attRes.json();

        const formatted = {};
        attData.forEach((entry) => {
          if (!formatted[entry.date]) formatted[entry.date] = {};
          formatted[entry.date][entry.employee] = {
            status: entry.status,
            reason: entry.reason,
          };
        });
        setAttendanceData(formatted);
      } catch (err) {
        console.error("Error fetching data:", err);
        showMessage("Failed to fetch data from server");
      }
    };
    fetchAllData();
  }, []);

  // ✅ Add Employee
  const handleAddEmployee = async () => {
    if (!newEmployee.trim()) {
      showMessage("Enter employee name!");
      return;
    }
    if (employees.includes(newEmployee.trim())) {
      showMessage("Employee already exists!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/attendance/staffs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newEmployee }),
      });

      if (res.ok) {
        setEmployees([...employees, newEmployee.trim()]);
        setNewEmployee("");
        showMessage("Employee added successfully!");
      } else {
        showMessage("Failed to add employee");
      }
    } catch {
      showMessage("Error adding employee");
    }
  };

  // ✅ Edit Employee
  const handleEditEmployee = async (oldName) => {
    const newName = prompt("Enter new employee name:", oldName);
    if (!newName || newName === oldName) return;

    try {
      const res = await fetch(`${BASE_URL}/api/attendance/staffs/${oldName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });

      if (res.ok) {
        const updatedEmployees = employees.map((n) =>
          n === oldName ? newName : n
        );
        const updatedAttendance = { ...attendanceData };
        for (const date in updatedAttendance) {
          if (updatedAttendance[date][oldName]) {
            updatedAttendance[date][newName] = updatedAttendance[date][oldName];
            delete updatedAttendance[date][oldName];
          }
        }
        setEmployees(updatedEmployees);
        setAttendanceData(updatedAttendance);
        showMessage("Employee name updated!");
      } else {
        showMessage("Failed to update name");
      }
    } catch {
      showMessage("Error updating employee");
    }
  };

  // ✅ Delete Employee
  const handleDeleteEmployee = async (name) => {
    const confirmDelete = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await fetch(`${BASE_URL}/api/attendance/staffs/${name}`, {
        method: "DELETE",
      });
      const updatedEmployees = employees.filter((e) => e !== name);
      const updatedAttendance = { ...attendanceData };
      for (const d in updatedAttendance) delete updatedAttendance[d][name];
      setEmployees(updatedEmployees);
      setAttendanceData(updatedAttendance);
      showMessage(`${name} removed successfully.`);
    } catch {
      showMessage("Error deleting employee");
    }
  };

  // ✅ Save Attendance
  const handleStatusChange = async (name, status) => {
    if (!selectedDate) {
      showMessage("Select a date first!");
      return;
    }

    const updated = { ...attendanceData };
    if (!updated[selectedDate]) updated[selectedDate] = {};
    updated[selectedDate][name] = {
      status,
      reason: status === "Present" ? "" : updated[selectedDate][name]?.reason || "",
    };
    setAttendanceData(updated);

    try {
      await fetch(`${BASE_URL}/api/attendance/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          employee: name,
          status,
          reason: updated[selectedDate][name]?.reason || "",
        }),
      });
      showMessage(`${name}'s attendance updated.`);
    } catch {
      showMessage("Error saving attendance");
    }
  };

  const handleReasonChange = async (name, reason) => {
    const updated = { ...attendanceData };
    if (!updated[selectedDate]) updated[selectedDate] = {};
    updated[selectedDate][name] = {
      ...updated[selectedDate][name],
      reason,
    };
    setAttendanceData(updated);

    try {
      await fetch(`${BASE_URL}/api/attendance/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          employee: name,
          status: updated[selectedDate][name]?.status || "",
          reason,
        }),
      });
      showMessage("Reason updated successfully.");
    } catch {
      showMessage("Error updating reason");
    }
  };

  // ✅ Date Restriction
  const today = new Date().toISOString().split("T")[0];
  const handleDateChange = (e) => {
    const v = e.target.value;
    if (v > today) {
      showMessage("Cannot select a future date!");
      return;
    }
    setSelectedDate(v);
  };

  // ✅ Summary
  const getSummary = (dayData) => {
    const s = { Present: 0, Absent: 0, Training: 0, "Half Day": 0, Holiday: 0 };
    Object.values(dayData || {}).forEach((r) => {
      if (r.status && s[r.status] !== undefined) s[r.status]++;
    });
    return s;
  };

  // ✅ Excel Export
  const downloadExcel = (type) => {
    if (Object.keys(attendanceData).length === 0) {
      showMessage("No attendance data available!");
      return;
    }

    const rows = [];
    Object.keys(attendanceData).forEach((date) => {
      const year = date.split("-")[0];
      const month = date.split("-")[1];

      if (
        (type === "monthly" &&
          month === selectedDate.split("-")[1] &&
          year === selectedDate.split("-")[0]) ||
        (type === "yearly" && year === selectedDate.split("-")[0])
      ) {
        const dayData = attendanceData[date];
        for (const emp in dayData) {
          rows.push({
            Date: date,
            Employee: emp,
            Status: dayData[emp].status,
            Reason: dayData[emp].reason || "-",
          });
        }
        const sum = getSummary(dayData);
        rows.push({
          Date: date,
          Employee: "→ Summary",
          Status: `P:${sum.Present} | A:${sum.Absent} | T:${sum.Training} | H:${sum["Half Day"]} | Ho:${sum.Holiday}`,
          Reason: "-",
        });
      }
    });

    if (rows.length === 0) {
      showMessage(`No ${type} data found for selected date.`);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const fileName =
      type === "monthly"
        ? `Attendance_${selectedDate.slice(0, 7)}.xlsx`
        : `Attendance_${selectedDate.slice(0, 4)}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      fileName
    );

    showMessage(`${type} Excel downloaded successfully!`);
  };

  // ✅ Print
  const handlePrint = () => {
    if (!selectedDate) {
      showMessage("Select a date first!");
      return;
    }

    const currentDay = attendanceData[selectedDate] || {};
    const summary = getSummary(currentDay);

    const printableHTML = `
      <html>
        <head>
          <title>Attendance - ${selectedDate}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <h2>Attendance Report - ${selectedDate}</h2>
          <table>
            <thead>
              <tr><th>Employee</th><th>Status</th><th>Reason</th></tr>
            </thead>
            <tbody>
              ${employees
                .map((name) => {
                  const rec = currentDay[name] || {};
                  return `<tr><td>${name}</td><td>${rec.status || "-"} </td><td>${rec.reason || "-"}</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
          <h3>Summary</h3>
          <p>Present: ${summary.Present} | Absent: ${summary.Absent} | Training: ${summary.Training} | Half Day: ${summary["Half Day"]} | Holiday: ${summary.Holiday}</p>
        </body>
      </html>`;
    const w = window.open("", "_blank");
    w.document.write(printableHTML);
    w.document.close();
    w.print();
  };

  const statusOptions = ["Present", "Absent", "Training", "Half Day", "Holiday"];
  const currentDay = selectedDate ? attendanceData[selectedDate] || {} : {};
  const summary = getSummary(currentDay);

  return (
    <div className="attendance-container">
      <h2>Employee Attendance Management</h2>

      {message && <div className="message-bar">{message}</div>}

      <div className="date-picker">
        <label>Select Date: </label>
        <input type="date" max={today} value={selectedDate} onChange={handleDateChange} />
      </div>

      <div className="action-buttons">
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={() => downloadExcel("monthly")}>⬇️ Monthly Excel</button>
        <button onClick={() => downloadExcel("yearly")}>📊 Yearly Excel</button>
      </div>

      <div className="add-employee">
        <input
          type="text"
          value={newEmployee}
          placeholder="Enter employee name"
          onChange={(e) => setNewEmployee(e.target.value)}
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="4" align="center">No employees</td></tr>
          ) : (
            employees.map((n, i) => {
              const rec = currentDay[n] || {};
              return (
                <tr key={i}>
                  <td>{n}</td>
                  <td>
                    <select
                      value={rec.status || ""}
                      onChange={(e) => handleStatusChange(n, e.target.value)}
                      disabled={!selectedDate}
                    >
                      <option value="">Select</option>
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {["Absent", "Training", "Half Day", "Holiday"].includes(rec.status) && (
                      <input
                        type="text"
                        value={rec.reason || ""}
                        placeholder="Enter reason"
                        onChange={(e) => handleReasonChange(n, e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditEmployee(n)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteEmployee(n)}>Delete</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {selectedDate && (
        <div className="summary">
          <h3>Summary for {selectedDate}</h3>
          <p>
            Present: <b>{summary.Present}</b> | Absent: <b>{summary.Absent}</b> | Training:{" "}
            <b>{summary.Training}</b> | Half Day: <b>{summary["Half Day"]}</b> | Holiday:{" "}
            <b>{summary.Holiday}</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
