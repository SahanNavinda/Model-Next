import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  
  // ⬇️ PASTE YOUR CLIENT ID HERE ⬇️
  const CLIENT_ID = "693df46393d8df53a1b9b254"; 

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = () => {
    fetch(`http://localhost:5000/api/dashboard/client/${CLIENT_ID}`)
      .then(res => res.json())
      .then(data => { setClientData(data); setLoading(false); })
      .catch(err => console.error("Error:", err));
  };

  const handleCreateEvent = async (e) => {
      e.preventDefault();
      await fetch('http://localhost:5000/api/dashboard/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              clientName: clientData.profile.name,
              jobType: newEvent.title,
              date: newEvent.date,
              modelId: null, // Public Event
              isEvent: true,
              status: 'NEW'
          })
      });
      setShowModal(false); setNewEvent({ title: '', date: '' });
      fetchClientData(); // Refresh data
      alert("Public Event Created!");
  };

  const handleReviewApplication = async (bookingId, decision) => {
      // decision should be 'CONFIRMED' or 'DECLINED'
      await fetch(`http://localhost:5000/api/dashboard/booking/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision })
      });
      fetchClientData(); // Refresh list to remove reviewed item
  };

  if (loading) return <div style={{padding:'50px'}}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F9F5F0' }}>
      <aside style={{ width: '260px', background: '#FFF', padding: '30px', borderRight: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: '700', marginBottom: '50px' }}>ModelNext</div>
        <div style={{ padding: '12px', background: '#F2EBE5', borderRadius: '8px', fontWeight: '600' }}>Dashboard</div>
        <div style={{ marginTop:'auto', fontSize: '12px', color: '#666', cursor:'pointer' }} onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</div>
      </aside>

      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
                <h1 style={{ fontFamily: 'Playfair Display', fontSize: '42px', margin: '0 0 5px 0' }}>Client Portal</h1>
                <p style={{ color: '#666' }}>Welcome back, {clientData.profile.name}</p>
            </div>
            <button className="btn-gold" onClick={() => setShowModal(true)} style={{ padding: '15px 30px' }}>+ CREATE EVENT</button>
        </div>

        {/* 1. PENDING APPLICATIONS SECTION */}
        <h2 className="section-title">Pending Applications</h2>
        {clientData.applications.length === 0 ? <p style={{color:'#999', marginBottom:'30px'}}>No pending requests.</p> : (
            <div style={{ display: 'grid', gap: '20px', marginBottom:'40px' }}>
                {clientData.applications.map(app => (
                    <div key={app._id} style={{ background: '#FFF', padding: '20px', border: '1px solid #C5A572', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #C5A572' }}>
                        <div style={{ display:'flex', gap:'15px', alignItems:'center'}}>
                            {app.modelId && <img src={app.modelId.profileImage} style={{width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover'}} alt="model" />}
                            <div>
                                <div style={{ fontWeight: '700', fontSize:'16px' }}>{app.modelId ? app.modelId.name : 'Unknown Model'}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>Applied for: {app.jobType}</div>
                            </div>
                        </div>
                        <div style={{ display:'flex', gap:'10px'}}>
                            <button className="btn-gold" onClick={() => handleReviewApplication(app._id, 'CONFIRMED')}>Approve</button>
                            <button className="btn-outline" onClick={() => handleReviewApplication(app._id, 'DECLINED')}>Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 2. MY EVENTS LIST */}
        <h2 className="section-title">My Public Events</h2>
        <div style={{ display: 'grid', gap: '20px' }}>
            {clientData.events.map(event => (
                <div key={event._id} style={{ background: '#FFF', padding: '25px', border: '1px solid #EAEAEA', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: '700' }}>{event.jobType}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>{event.date}</div>
                    </div>
                    <span style={{ fontSize:'11px', padding:'5px 10px', background:'#eee', borderRadius:'4px' }}>Public Listing</span>
                </div>
            ))}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#FFF', padding: '40px', borderRadius: '8px', width: '400px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', marginTop: 0 }}>Create Event</h2>
                <form onSubmit={handleCreateEvent}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>EVENT NAME</label>
                        <input type="text" required placeholder="e.g. Open Casting" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>DATE</label>
                        <input type="text" required placeholder="e.g. March 10, 2025" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn-gold" style={{ flex: 1 }}>Publish</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;