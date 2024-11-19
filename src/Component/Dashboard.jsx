import React, { useState } from "react";
import './Dashboard.css';
import Users from "./Users";
import { useLocation } from "react-router-dom";  // Import useLocation to access state passed via navigate
import Client from './Client'
import Employee from "./Employee";
import Product from "./Products";
function Dashboard() {
  const [CurrentView, setCurrentView] = useState('UDashboard');
  const handlemenuclick = (view) => {
    setCurrentView(view);
  };

  // Access name from location state (passed via navigate)
  const location = useLocation();
  const { name } = location.state || {};

  const renderContent = () => {
    switch (CurrentView) {
      case "setting":
        return <div>Setting</div>;
      case "Users":
        return <div><Users /></div>;
      case "Client":
        return <div><Client/></div>;
        case "Employee":
        return <div><Employee/></div>;
        case "product":
        return <div><Product/></div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dashboard-container">
        {/* sidebar */}
        <div className="sidebar">
          <h3>Sidebar Menu</h3>
          <ul>
            <li onClick={() => handlemenuclick("UDashboard")}>Dashboard</li>
            <li onClick={() => handlemenuclick("Users")}>Users</li>
            <li onClick={() => handlemenuclick("Client")}>Clients</li>
            <li onClick={() => handlemenuclick("setting")}>Setting</li>
            <li onClick={() => handlemenuclick("Employee")}>Employee</li>

            <li onClick={() => handlemenuclick("product")}>Product</li>

          </ul>
        </div>
        {/* main dashboard */}
        <div className="main-content">
          {/* header */}
          <header className="header">
            <div className="profile-section">
              <img src="https://via.placeholder.com/40" alt="profile" className="profile-picture" />
              <span className="profile-name">Welcome Back !! {name ? name : "Guest"} !! </span>
            </div>
            <h2 className="view-title">Dashboard</h2>
          </header>
          <main className="content">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
