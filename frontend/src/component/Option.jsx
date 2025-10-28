import React from "react";
import "./option.css";
import { useNavigate } from "react-router-dom";

const Option = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/finance");
  };
  const handlehrClick = () => {
    navigate("/hroption");
  };
  const handleProjectClick = () => {
    navigate("/projectdata");
  };

  return (
    <div className="option-container">
      <h1 className="option-heading">ERP Portal </h1>
      <div className="option-buttons">
        <button className="option-button" onClick={handleAdminClick}>
          Finance Management
        </button>
        <button className="option-button" onClick={handlehrClick}>
          HR Management
        </button>
        <button className="option-button" onClick={handleProjectClick}>
          Project Management
        </button>
      </div>
    </div>
  );
};

export default Option;
