import React, { useState } from 'react';
import './StyleCss/Sidebar.css';
import {
  FaHome, FaImage, FaCubes ,
  FaChevronDown, FaChevronRight, FaFilm,
} from 'react-icons/fa';

import { FiSettings } from "react-icons/fi";

import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menu = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaCubes />, label: 'Social Media Manager', path: '/social-media-manager' },
    { icon: <FaCubes />, label: 'Staff Head', path: '/staffHead' }, 
    { icon: <FaCubes />, label: 'Interview Manager', path: '/interview-manager' }, 
    { icon: <FaImage />, label: 'Pre-Visa (Sneha)', path: '/pre-visa' },
    { icon: <FaImage />, label: 'Final Visa(Shamiksha)', path: '/final-visa' },
    {
      icon: <FiSettings />, label: 'Settings', dropdown: [
        { label: 'Zone', icon: <FaFilm />, path: '/settings/zone' },
      ]
    },
 
  ];

  const handleItemClick = (item) => {
    if (item.dropdown) {
      setVideoDropdownOpen(!videoDropdownOpen);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div
      className={`admin-sidebar ${isOpen ? 'open' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul>
        {menu.map((item, i) => (
          <React.Fragment key={i}>
            <li onClick={() => handleItemClick(item)}>
              <span className="admin-icon">{item.icon}</span>
              <span className="admin-label">{item.label}</span>
              {item.dropdown && (
                <span className="dropdown-arrow">
                  {videoDropdownOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              )}
            </li>

            {/* Dropdown Submenu */}
            {item.dropdown && videoDropdownOpen && (
              <ul className="dropdown-menu open">
                {item.dropdown.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className="dropdown-item"
                    onClick={() => navigate(subItem.path)}
                  >
                    <span className="admin-icon">{subItem.icon}</span>
                    <span className="admin-label">{subItem.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
