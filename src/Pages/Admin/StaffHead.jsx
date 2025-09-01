import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/StaffHead.css';

const StaffHead = () => {
  const [staffHeads, setStaffHeads] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    photo: null,
  });

  const AddedBy = localStorage.getItem('adminID');

  const fetchStaffHeads = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/staff-heads?search=${search}`);
      setStaffHeads(res.data);
    } catch (err) {
      toast.error('Failed to fetch staff heads');
    }
  };

  useEffect(() => {
    fetchStaffHeads();
  }, [search]);

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const openEditDialog = (row) => {
    setEditMode(true);
    setSelectedId(row._id);
    setForm({
      name: row.name,
      email: row.email,
      mobile: row.mobile,
      password: '',
      photo: null,
    });
    setVisible(true);
  };

  const handleAddOrEdit = async () => {
    if (!form.name || !form.email || !form.mobile) {
      toast.error('Name, Email, and Mobile are required!');
      return;
    }

    try {
      setLoading(true);

      if (editMode) {
        await axios.put(`http://localhost:5000/api/staff-heads/${selectedId}`, {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
        });
        toast.success('Staff head updated successfully');
      } else {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('mobile', form.mobile);
        formData.append('addedBy', AddedBy); // ✅ Critical fix

        if (form.password) formData.append('password', form.password);
        if (form.photo) formData.append('photo', form.photo);

        await axios.post('http://localhost:5000/api/staff-heads/add', formData);
        toast.success('Staff head added successfully');
      }

      fetchStaffHeads();
      setVisible(false);
      resetForm();
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will mark the staff head as deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/staff-heads/${id}`);
        toast.success('Staff head deleted');
        fetchStaffHeads();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', mobile: '', password: '', photo: null });
    setEditMode(false);
    setSelectedId(null);
  };

  const actionTemplate = (rowData) => (
    <div className="action-icons" style={{ display: 'flex', gap: '0.5rem' }}>
      {/* <Button icon="pi pi-eye" className="p-button-rounded p-button-info" /> */}
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditDialog(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData._id)} />
    </div>
  );

  const photoTemplate = (rowData) => (
    <Image src={rowData.photo} alt={rowData.name} width="50" preview />
  );

  return (
    <div className="staff-head-page">
      <ToastContainer />
      <div className="staff-head-header">
        <h2>Staff Heads</h2>
        <div className="staff-head-actions">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name/email/mobile"
          />
          <Button
            label="Add Staff Head"
            icon="pi pi-plus"
            onClick={() => {
              setVisible(true);
              resetForm();
            }}
          />
        </div>
      </div>

      <DataTable
        value={staffHeads}
        paginator
        rows={10}
        className="p-datatable-striped"
        responsiveLayout="scroll"
      >
        <Column header="Sr. No." body={(_, { rowIndex }) => rowIndex + 1} />
        <Column header="Photo" body={photoTemplate} />
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="password" header="Password" />
        <Column field="mobile" header="Mobile" />
        <Column field="addedBy.username" header="Added By" />
        <Column
          field="createdAt"
          header="Created"
          body={(row) => new Date(row.createdAt).toLocaleString()}
        />
        <Column header="Actions" body={actionTemplate} style={{ textAlign: 'center' }} />
      </DataTable>

      <Dialog
        header={editMode ? 'Edit Staff Head' : 'Add Staff Head'}
        visible={visible}
        style={{ width: '420px' }}
        onHide={() => setVisible(false)}
        className="custom-staff-dialog"
      >
        <div className="p-fluid">
          <InputText
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <InputText
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <InputText
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <InputText
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {!editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="p-mt-2"
            />
          )}

          <Button
            label={loading ? 'Saving...' : editMode ? 'Update' : 'Submit'}
            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
            onClick={handleAddOrEdit}
            disabled={loading}
            className="p-mt-3"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default StaffHead;
