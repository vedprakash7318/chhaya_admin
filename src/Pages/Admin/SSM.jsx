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
import './CSS/SSM.css';

const SSM = () => {
  const [ssms, setSsms] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });

  const token = localStorage.getItem('adminToken');

  const fetchSSMs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/smm?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSsms(res.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => { fetchSSMs(); }, [search]);

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
        await axios.put(`http://localhost:5000/api/smm/${selectedId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('SMM updated');
      } else {
        await axios.post('http://localhost:5000/api/smm/add', form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('SMM added');
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
      title: 'Delete?',
      text: 'This will mark as deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/smm/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Deleted');
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
    <div className="action-icons" style={{ display: 'flex', gap: '0.5rem' }}>
      {/* <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info"
        onClick={() => openViewDialog(rowData)}
      /> */}
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"

        onClick={() => openEditDialog(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDelete(rowData._id)}
      />
    </div>
  );
  return (
    <div className="ssm-page">
      <ToastContainer />
      <div className="ssm-header">
        <h2>Social Media Managers</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
          <Button label="Add SMM" icon="pi pi-plus" onClick={() => { setVisible(true); resetForm(); }} />
        </div>
      </div>

      <DataTable value={ssms} paginator rows={10} responsiveLayout="scroll" className="p-datatable-striped">
        <Column header="Sr. No." body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="password" header="Password" />
        <Column field="mobile" header="Mobile" />
        <Column field="addedBy.username" header="Added By" />
        <Column field="createdAt" header="Created" body={(row) => new Date(row.createdAt).toLocaleString()} />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>

      <Dialog header={editMode ? 'Edit SMM' : 'Add SMM'} visible={visible} style={{ width: '400px' }} onHide={() => setVisible(false)}>
        <div className="p-fluid">
          <InputText placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <InputText placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <InputText placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          <InputText placeholder="Password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button label={loading ? 'Saving...' : editMode ? 'Update' : 'Submit'} icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'} onClick={handleAddOrEdit} disabled={loading} />
        </div>
      </Dialog>
    </div>
  );
};

export default SSM;
