import React from "react";
import "../styles/Card.css";

const Card = ({ title, subtitle, value, gradient }) => {
  return (
    <div className={`card ${gradient}`}>
      <div className="card-title">{title}</div>
      <div className="card-subtitle">{subtitle}</div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default Card;
