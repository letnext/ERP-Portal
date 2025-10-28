import React from "react";
import { useNavigate } from "react-router-dom";
import "./finance.css";

const Finance = () => {
  const navigate = useNavigate();

  const handleExpandClick = () => {
    navigate("/expandmanage");
  };

  const handleRevenueClick = () => {
    navigate("/revenue");
  };

  return (
    <div className="finance-container">
      <h1 className="finance-heading">Finance Dashboard</h1>
      <div className="finance-buttons">
        <button className="finance-button" onClick={handleExpandClick}>
          Expenditure Management
        </button>
        <button className="finance-button" onClick={handleRevenueClick}>
          Revenue Management
        </button>
      </div>
    </div>
  );
};

export default Finance;
