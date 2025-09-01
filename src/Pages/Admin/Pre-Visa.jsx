import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/PreVisa.css';

const PreVisa = () => {
  const [preVisas, setPreVisas] = useState([]);
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
  });

  const AddedBy = localStorage.getItem('adminID');

  const fetchPreVisas = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pre-visa?search=${search}`);
      setPreVisas(res.data);
    } catch (err) {
      toast.error('Failed to fetch pre-visa records');
    }
  };

  useEffect(() => {
    fetchPreVisas();
  }, [search]);

  const openEditDialog = (row) => {
    setEditMode(true);
    setSelectedId(row._id);
    setForm({
      name: row.name,
      email: row.email,
      mobile: row.mobile,
      password: '',
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
        await axios.put(`http://localhost:5000/api/pre-visa/${selectedId}`, {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
        });
        toast.success('Pre-Visa record updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/pre-visa/add', {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password || undefined,
          addedBy: AddedBy,
        });
        toast.success('Pre-Visa record added successfully');
      }

      fetchPreVisas();
      setVisible(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will mark the pre-visa record as deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/pre-visa/${id}`);
        toast.success('Pre-Visa record deleted');
        fetchPreVisas();
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
    <div className="action-icons" style={{ display: 'flex', gap: '0.5rem' }}>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditDialog(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData._id)} />
    </div>
  );

  return (
    <div className="pre-visa-page">
      <ToastContainer />
      <div className="pre-visa-header">
        <h2>Pre-Visa Officers</h2>
        <div className="pre-visa-actions">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name/email/mobile"
          />
          <Button
            label="Add Pre-Visa"
            icon="pi pi-plus"
            onClick={() => {
              setVisible(true);
              resetForm();
            }}
          />
        </div>
      </div>

      <DataTable
        value={preVisas}
        paginator
        rows={10}
        className="p-datatable-striped"
        responsiveLayout="scroll"
      >
        <Column header="Sr. No." body={(_, { rowIndex }) => rowIndex + 1} />
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
        header={editMode ? 'Edit Pre-Visa' : 'Add Pre-Visa'}
        visible={visible}
        style={{ width: '420px' }}
        onHide={() => setVisible(false)}
        className="custom-pre-visa-dialog"
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

export default PreVisa;
