import React, { useState } from 'react';
import './StyleCss/Sidebar.css';
import {
  FaChevronDown, FaChevronRight,
  FaQuestionCircle,
  FaCcVisa,
  FaGlobeAsia,
  FaPhoneVolume,
} from 'react-icons/fa';

import { FiSettings } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdOutlineSocialDistance } from 'react-icons/md';
import { IoPeople } from 'react-icons/io5';
import { RiTimeZoneFill } from 'react-icons/ri';

export default function Sidebar({ isOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { icon: <MdDashboard />, label: 'Dashboard', path: '/dashboard' },
    { icon: <MdOutlineSocialDistance />, label: 'Social Media Manager', path: '/social-media-manager' },
    { icon: <IoPeople />, label: 'Staff Head', path: '/staffHead' },
    { icon: <FaPhoneVolume/>, label: 'Calling Team', path: '/calling-team' },
    { icon: <FaQuestionCircle />, label: 'Interview Manager', path: '/interview-manager' },
    { icon: <FaCcVisa />, label: 'Pre-Visa (Sneha)', path: '/pre-visa' },
    { icon: <FaCcVisa />, label: 'Final Visa(Shamiksha)', path: '/final-visa' },
    {
      icon: <FiSettings />, label: 'Settings', dropdown: [
        { label: 'Zone', icon: <RiTimeZoneFill />, path: '/settings/zone' },
        { label: 'Country', icon: <FaGlobeAsia />, path: '/settings/country' },
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
        {menu.map((item, i) => {
          const isActive = item.path === location.pathname;

          // Check if any subItem is active
          const isSubActive = item.dropdown?.some(
            (subItem) => subItem.path === location.pathname
          );

          return (
            <React.Fragment key={i}>
              <li
                onClick={() => handleItemClick(item)}
                className={isActive || isSubActive ? "active" : ""}
              >
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
                  {item.dropdown.map((subItem, subIndex) => {
                    const isSubItemActive = subItem.path === location.pathname;
                    return (
                      <li
                        key={subIndex}
                        className={`dropdown-item ${isSubItemActive ? "active" : ""}`}
                        onClick={() => navigate(subItem.path)}
                      >
                        <span className="admin-icon">{subItem.icon}</span>
                        <span className="admin-label">{subItem.label}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}
