import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModelDashboard = () => {
  const navigate = useNavigate();
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ⬇️ PASTE YOUR MODEL ID HERE ⬇️
  const MODEL_ID = "693df46393d8df53a1b9b252"; 

  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/${MODEL_ID}`)
      .then(res => res.json())
      .then(data => { setModelData(data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  // ✅ FIXED: Instantly updates the UI when you click Apply
  const handleApply = async (event) => {
    // 1. Send request to backend
    const res = await fetch('http://localhost:5000/api/dashboard/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clientName: event.clientName,
            jobType: event.jobType,
            date: event.date,
            modelId: MODEL_ID, 
            status: 'APPLIED', 
            isEvent: false 
        })
    });

    if (res.ok) {
        const newApplication = await res.json();
        
        // 2. INSTANTLY Update State (Don't wait for refresh)
        setModelData(prev => ({
            ...prev,
            // Add to "My Applications" list at the top
            bookings: [newApplication, ...prev.bookings],
            // REMOVE from "Public Events" list so you don't apply twice
            events: prev.events.filter(e => e._id !== event._id)
        }));
        
        alert("Application Sent! It is now in 'My Applications'.");
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
      // (Keep existing accept/decline logic for direct bookings)
      const res = await fetch(`http://localhost:5000/api/dashboard/booking/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setModelData(prev => ({
          ...prev,
          bookings: prev.bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
        }));
      }
  };

  if (loading) return <div style={{padding:'50px'}}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ width: '260px', background: '#FFF', padding: '30px', borderRight: '1px solid #EAEAEA' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: '700', marginBottom: '50px' }}>ModelNext</div>
        <div style={{ padding: '12px', background: '#F2EBE5', borderRadius: '8px', fontWeight: '600' }}>Dashboard</div>
        <div style={{ marginTop:'auto', fontSize: '12px', color: '#666', cursor:'pointer' }} onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</div>
      </aside>

      <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
           <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '50px' }}>
              <img src={modelData.profile.profileImage} style={{ width: '140px', height: '180px', objectFit: 'cover' }} alt="profile" />
              <div>
                  <h1 style={{ fontFamily: 'Playfair Display', fontSize: '56px', margin: '0' }}>{modelData.profile.name}</h1>
                  <p style={{ color: '#666' }}>Verified Model <i className="fa-solid fa-circle-check" style={{ color: '#C5A572' }}></i></p>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* MY APPLICATIONS & JOBS */}
              <div>
                  <h2 className="section-title">My Applications</h2>
                  {modelData.bookings.length === 0 && <p style={{color:'#ccc'}}>No applications yet.</p>}
                  {modelData.bookings.map((booking) => (
                      <div key={booking._id} style={{ background: '#FFF', padding: '25px', border: '1px solid #f0f0f0', marginBottom: '20px' }}>
                          <span style={{ fontWeight: '700' }}>{booking.clientName}</span>
                          <div style={{ fontSize: '13px', color: '#666', margin: '5px 0 20px 0' }}>{booking.jobType} • {booking.date}</div>
                          
                          {/* STATUS BADGE */}
                          <span style={{ 
                              fontSize:'11px', fontWeight:'bold', padding:'5px 10px', borderRadius:'4px',
                              background: booking.status === 'CONFIRMED' ? '#E8F5E9' : booking.status === 'APPLIED' ? '#FFF3E0' : '#EEE',
                              color: booking.status === 'CONFIRMED' ? '#2E7D32' : booking.status === 'APPLIED' ? '#E65100' : '#333'
                          }}>
                              {booking.status === 'APPLIED' ? 'Pending Approval' : booking.status}
                          </span>

                          {/* Allow Accepting Direct Invites */}
                          {booking.status === 'NEW' && (
                             <div style={{marginTop:'10px', display:'flex', gap:'10px'}}>
                                <button className="btn-gold" style={{flex:1}} onClick={() => handleStatusUpdate(booking._id, 'ACCEPTED')}>Accept Invite</button>
                             </div>
                          )}
                      </div>
                  ))}
              </div>
              
              {/* PUBLIC EVENTS */}
              <div>
                  <h2 className="section-title">Public Events</h2>
                  {modelData.events.length === 0 && <p style={{color:'#ccc'}}>No new events available.</p>}
                  {modelData.events.map((event) => (
                      <div key={event._id} style={{ background: '#FFF', padding: '25px', border: '1px solid #f0f0f0', marginBottom: '20px' }}>
                          <div style={{display:'flex', justifyContent:'space-between'}}>
                            <span style={{ fontWeight: '700' }}>{event.clientName}</span>
                            <span style={{fontSize:'10px', background:'#eee', padding:'3px 6px'}}>PUBLIC</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', margin: '5px 0 20px 0' }}>{event.jobType} • {event.date}</div>
                          <button className="btn-gold" style={{width:'100%'}} onClick={() => handleApply(event)}>Apply Now</button>
                      </div>
                  ))}
              </div>
           </div>
      </main>
    </div>
  );
};

export default ModelDashboard;