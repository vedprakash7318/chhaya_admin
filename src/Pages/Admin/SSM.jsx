import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';   // ✅ Loader
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/SSM.css';
import { useNavigate } from 'react-router-dom';

const SSM = () => {

    const API_URL = import.meta.env.VITE_API_URL;
  const [ssms, setSsms] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);     
  const [pageLoading, setPageLoading] = useState(false);
  const [adminId,setadminId]=useState(null)
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', addedBy: adminId });

  const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
    const navigate=useNavigate()
  useEffect(()=>{
    if(!localStorage.getItem("adminID")){
        navigate('/')
    }
  })

  useEffect(() => {
    const adminID = localStorage.getItem('adminID');
    // console.log(adminID);
    setadminId(adminID)
    
    setForm((prev) => ({ ...prev, addedBy: adminID }));
  }, []);

  const fetchSSMs = async () => {
    try {
      setPageLoading(true);  // ✅ show loader
      const res = await axios.get(`${API_URL}/api/smm?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSsms(res.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setPageLoading(false); // ✅ hide loader
    }
  };

  useEffect(() => { 
    fetchSSMs(); 
  }, [search]);

  const openEditDialog = (row) => {
    setEditMode(true);
    setSelectedId(row._id);
    setForm({ name: row.name, email: row.email, mobile: row.mobile, password: '' });
    setVisible(true);
  };

  const handleAddOrEdit = async () => {
    if (!form.name || !form.email || !form.mobile) {
      toast.error('All fields except password are required!');
      return;
    }

    try {
      setLoading(true);
      if (editMode) {
        await axios.put(`${API_URL}/api/smm/${selectedId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('SMM updated successfully');
      } else {
        form.addedBy=adminId
        await axios.post(`${API_URL}/api/smm/add`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('SMM added successfully');
      }
      fetchSSMs();
      setVisible(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/smm/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('SMM deleted successfully');
        fetchSSMs();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', mobile: '', password: '' });
    setEditMode(false);
    setSelectedId(null);
  };

  const actionTemplate = (rowData) => (
    <div className="action-buttons">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-outlined p-button-warning edit-btn"
        onClick={() => openEditDialog(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-outlined p-button-danger delete-btn"
        onClick={() => handleDelete(rowData._id)}
      />
    </div>
  );

  const leftToolbarTemplate = () => (
    <div className="table-header">
      <h2>Social Media Managers</h2>
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="toolbar-buttons">
      <span className="p-input-icon-left search-box">
        <i className="pi pi-search" />
        <InputText 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search SMMs..." 
          className="p-inputtext-sm pass"
        />
      </span>
      <Button 
        label="Add SMM" 
        icon="pi pi-plus" 
        className="p-button-sm p-button-raised add-btn"
        onClick={() => { setVisible(true); resetForm(); }} 
      />
    </div>
  );

  const footerContent = (
    <div className="dialog-footer">
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        onClick={() => setVisible(false)} 
        className="p-button-text cancel-btn" 
      />
      <Button 
        label={loading ? 'Saving...' : editMode ? 'Update' : 'Save'} 
        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'} 
        onClick={handleAddOrEdit} 
        disabled={loading} 
        autoFocus 
        className="save-btn"
      />
    </div>
  );

  return (
    <div className="ssm-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Full screen loader overlay */}
      {pageLoading && (
        <div className="loader-overlay">
          <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="4" />
        </div>
      )}
      
      <Card className="card">
        <Toolbar className="custom-toolbar" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      </Card>

      <DataTable 
        value={ssms} 
        paginator 
        rows={10} 
        responsiveLayout="scroll"
        emptyMessage="No SMMs found."
        className="p-datatable-sm p-datatable-striped custom-datatable"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      >
        <Column header="Sr. No." body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '70px' }} />
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="mobile" header="Mobile" sortable />
        <Column field="addedBy.username" header="Added By" sortable />
        <Column field="createdAt" header="Created" body={(row) => new Date(row.createdAt).toLocaleString()} sortable />
        <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} />
      </DataTable>
     
      <Dialog 
        header={editMode ? 'Edit Social Media Manager' : 'Add New Social Media Manager'} 
        visible={visible} 
        style={{ width: '500px' }} 
        onHide={() => setVisible(false)}
        footer={footerContent}
        className="smm-dialog"
      >
        <div className="p-fluid grid formgrid p-2">
          <div className="field col-12">
            <label htmlFor="name">Name <span className="required-field">*</span></label>
            <InputText 
              id="name"
              placeholder="Enter full name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              className="p-inputtext-sm"
            />
          </div>
          
          <div className="field col-12">
            <label htmlFor="email">Email <span className="required-field">*</span></label>
            <InputText 
              id="email"
              placeholder="Enter email address" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              className="p-inputtext-sm"
            />
          </div>
          
          <div className="field col-12">
            <label htmlFor="mobile">Mobile <span className="required-field">*</span></label>
            <InputText 
              id="mobile"
              placeholder="Enter mobile number" 
              value={form.mobile} 
              onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
              className="p-inputtext-sm"
            />
          </div>
          
          <div className="field col-12">
            <label htmlFor="password">Password {!editMode && <span className="required-field">*</span>}</label>
            <Password
              id="password"
              placeholder={editMode ? "Leave blank to keep current password" : "Enter password"}
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              className="p-inputtext-sm"
              feedback={false}
            />
            {!editMode && <small className="p-text-secondary">Password must be at least 6 characters long</small>}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SSM;
