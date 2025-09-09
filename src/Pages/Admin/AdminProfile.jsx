import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { LogOut, Mail, Building2 } from "lucide-react";
import Swal from "sweetalert2";
import './CSS/AdminProfile.css';
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    photo: "",
    company: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminID")) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
    if (storedAdmin) {
      setAdmin(storedAdmin);
    } else {
      setAdmin({
        name: "John Doe",
        email: "admin@chhaya.com",
        photo: "logo.jpg",
        company: "Chhaya International Pvt. Ltd.",
      });
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
      }
    });
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-wrapper">
        
        <div className="admin-profile-header">
          <h1 className="admin-profile-title">Admin Profile</h1>
        </div>

        <div className="admin-profile-card">
          <div className="admin-profile-content">
            
            <div className="admin-profile-photo-section">
              <img
                src={admin.photo}
                alt="Admin"
                className="admin-profile-photo"
              />
              <h2 className="admin-profile-name">{admin.name}</h2>
              <span className="admin-profile-role">Administrator</span>
            </div>

            <div className="admin-profile-info">
              
              <div className="admin-profile-info-item">
                <Mail className="admin-profile-icon" size={18} />
                <div className="admin-profile-info-text">
                  <span className="admin-profile-label">Email</span>
                  <span className="admin-profile-value">{admin.email}</span>
                </div>
              </div>

              <div className="admin-profile-info-item">
                <Building2 className="admin-profile-icon" size={18} />
                <div className="admin-profile-info-text">
                  <span className="admin-profile-label">Company</span>
                  <span className="admin-profile-value">{admin.company}</span>
                </div>
              </div>
            </div>

            <div className="admin-profile-actions">
              <Button
                label="Logout"
                icon={<LogOut size={16} />}
                className="admin-profile-logout-btn"
                onClick={handleLogout}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
