// components/Zone.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Zone.css';

const Zone = () => {
  const [zones, setZones] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ zoneName: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const adminId = localStorage.getItem('adminID');

  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/setting/zone?search=${search}`);
      setZones(res.data);
    } catch {
      toast.error('Failed to fetch zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [search]);

  const handleSubmit = async () => {
    if (!form.zoneName) {
      toast.error('Zone name required');
      return;
    }

    if (!adminId) {
      toast.error('Admin ID not found. Please login again.');
      return;
    }

    setSaving(true);
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/setting/zone/${selectedId}`, form);
        toast.success('Zone updated');
      } else {
        await axios.post(`http://localhost:5000/api/setting/zone/add`, {
          ...form,
          zoneAddedBy: adminId,
        });
        toast.success('Zone added');
      }

      fetchZones();
      setVisible(false);
      setForm({ zoneName: '' });
      setEditMode(false);
    } catch {
      toast.error('Error saving zone');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete?',
      text: 'This will mark the zone as deleted.',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/setting/zone/${id}`);
        toast.success('Zone deleted');
        fetchZones();
      } catch {
        toast.error('Delete failed');
      }
    }
  };

  const openEdit = (row) => {
    setForm({ zoneName: row.zoneName });
    setSelectedId(row._id);
    setEditMode(true);
    setVisible(true);
  };
  console.log(zones);
  

  return (
    <div className="zone-page">
      <ToastContainer />
      <div className='zone-header'>
        <h2>Zone Management</h2>
        <div className="zone-controls">
          <InputText
            placeholder="Search zones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-inputtext-sm"
          />
          <Button
            label="Add Zone"
            icon="pi pi-plus"
            className="p-button-sm p-button-success"
            onClick={() => {
              setVisible(true);
              setEditMode(false);
              setForm({ zoneName: '' });
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-center">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable value={zones} paginator rows={10} className="p-datatable-sm">
          <Column header="Sr. No." body={(_, { rowIndex }) => rowIndex + 1} />
          <Column field="zoneName" header="Zone Name" />
          <Column field="zoneAddedBy.role" header="Added By (Role)" />
          <Column
            field="createdAt"
            header="Date"
            body={(row) => new Date(row.createdAt).toLocaleString()}
          />
          <Column
            header="Actions"
            body={(row) => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => openEdit(row)} />
                <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => handleDelete(row._id)} />
              </div>
            )}
          />
        </DataTable>
      )}

      <Dialog
        header={editMode ? 'Edit Zone' : 'Add Zone'}
        visible={visible}
        style={{ width: '30vw' }}
        onHide={() => setVisible(false)}
        className='dialog'
      >
        <div className="dialog-form">
          <label>Zone Name</label>
          <InputText
            placeholder="Enter zone name"
            value={form.zoneName}
            onChange={(e) => setForm({ zoneName: e.target.value })}
            className="p-inputtext-sm"
          />
          <Button
            label={saving ? 'Saving...' : 'Save'}
            disabled={saving}
            onClick={handleSubmit}
            className="p-mt-3 p-button-sm p-button-primary"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Zone;
