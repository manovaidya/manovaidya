import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [sidetoggle, setSideToggle] = useState(false);

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('login');
    navigate('/login');
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "fa-solid fa-gauge" },
    { to: "/all-orders", label: "Manage Orders", icon: "fa-solid fa-truck" },
    { to: "/All-Herbs-For-Natural", label: "All Herbs", icon: "fa-solid fa-leaf" },
    { to: "/all-tags", label: "All Tag", icon: "fa-solid fa-boxes" },
    { to: "/all-products", label: "All Products", icon: "fa-solid fa-boxes" },
    { to: "/all-dieses", label: "All Diseases", icon: "fa-solid fa-virus" },
    { to: "/sub-diseases", label: "Sub Diseases", icon: "fa-solid fa-heartbeat" },
    { to: "/all-banners", label: "Manage Banners", icon: "fa-solid fa-images" },
    { to: "/view-test", label: "Add Mind Health Test", icon: "fa-solid fa-brain" },
    { to: "/all-consult-doctor", label: "Manage Consult Advice URL", icon: "fa-solid fa-user-md" },
    { to: "/patient-details", label: "Consult Patient Details", icon: "fa-solid fa-user" },
    { to: "/all-coupen", label: "Manage Coupens", icon: "fa-solid fa-tag" },
    { to: "/all-users", label: "All Users", icon: "fa-solid fa-users" },
    { to: "/all-reviews", label: "All Reviews", icon: "fa-solid fa-star" },
    { to: "/all-blogs", label: "All Blogs", icon: "fa-solid fa-pen" },
    { to: "/news-letter", label: "News Letter", icon: "fa-solid fa-newspaper" },
  ];

  return (
    <header>
      <div className="top-head">
        <div className="right">
          <Link className='text-white text-decoration-none' to="/">
            <h2>Manovaidya Admin Panel</h2>
          </Link>
          <div className="bar" onClick={handletoggleBtn}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
        <div className="left">
          <a href="https://manovedya.vercel.app/" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-globe"></i> Go To Website
          </a>
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>
      </div>

      <div className={`rightNav ${sidetoggle ? "active" : ""}`}>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} onClick={handletoggleBtn}>
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;
