import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'react-toastify/dist/ReactToastify.css';
import '../Admin/CSS/PreVisa.css';
import { useNavigate } from 'react-router-dom';

const CallingTeam = () => {
    const API_URL = import.meta.env.VITE_API_URL;
  const [callingTeam, setCallingTeam] = useState([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(true);
    const navigate=useNavigate()
  useEffect(()=>{
    if(!localStorage.getItem("adminID")){
        navigate('/')
    }
  })

  // pagination states
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);

  const fetchCallingTeam = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${API_URL}/api/calling-team/all?page=${page + 1}&limit=${rows}&search=${search}`
      );
      console.log(res.data.data);
      
      setCallingTeam(res.data.data);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      toast.error('Failed to fetch calling team records');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCallingTeam();
  }, [page, rows, search]);

  return (
    <div className="pre-visa-page">
      <ToastContainer />
      <div className="pre-visa-header">
        <h2>Calling Team</h2>
        <div className="pre-visa-actions">
          <InputText
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset to first page on search
            }}
            placeholder="Search by name/email/mobile"
          />
        </div>
      </div>

      {fetching ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={callingTeam}
          paginator
          rows={rows}
          first={page * rows}
          totalRecords={totalRecords}
          lazy
          onPage={(e) => {
            setPage(e.page);
            setRows(e.rows);
          }}
          className="p-datatable-striped"
          responsiveLayout="scroll"
          emptyMessage="No Calling Team Members found."
        >
          <Column header="Sr. No." body={(_, { rowIndex }) => page * rows + rowIndex + 1} />
          <Column field="name" header="Name" />
          <Column field="email" header="Email" />
          <Column field="phone" header="Mobile" />
          <Column field="password" header="Password" />
          <Column field="addedBy.name" header="Added By" />
          <Column
            field="createdAt"
            header="Created"
            body={(row) => new Date(row.createdAt).toLocaleString()}
          />
        </DataTable>
      )}
    </div>
  );
};

export default CallingTeam;
