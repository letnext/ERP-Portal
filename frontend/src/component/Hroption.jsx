import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./hroption.css";

const Hroption = () => {
  const navigate = useNavigate(); // Get the navigate function

  // The handleButtonClick function now takes the route path directly
  const handleButtonClick = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div className="hroption-container">
      <div className="hroption-heading">
        <h2>HR Management Options</h2>
      </div>
      <div className="hroption-button-group">
        <button
          className="hroption-button"
          onClick={() => handleButtonClick("/employeedetail")}
        >
          Employee Details
        </button>
        <button
          className="hroption-button"
          onClick={() => handleButtonClick("/attendance")}
        >
          Attendance
        </button>
        <button
          className="hroption-button"
          onClick={() => handleButtonClick("/salerydetail")}
        >
          Salary Details
        </button>
        <button
          className="hroption-button"
          onClick={() => handleButtonClick("/employeevancey")}
        >
          Employee Vacancy
        </button>
      </div>
    </div>
  );
};

export default Hroption;