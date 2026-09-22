import React, { useState } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Tv, 
  Eye, 
  EyeOff, 
  Sliders, 
  Wallet, 
  Radio, 
  ArrowLeft,
  ChevronRight,
  Layers,
  Lock
} from 'lucide-react';

export default function HostSetup() {
  const { createEvent, setRole, playVanitiSound } = useVaniti();

  const [title, setTitle] = useState("Chioma & David's Wedding Reception");
  const [hostName, setHostName] = useState("Chioma & David Adeleke");
  const [category, setCategory] = useState("Wedding");
  const [venue, setVenue] = useState("The Monarch Event Centre, Lekki, Lagos");
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [settlementWallet, setSettlementWallet] = useState("ZenVault • Access Bank (0123***891)");
  
  // Privacy toggles
  const [proximityDiscovery, setProximityDiscovery] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [hideTotalRaised, setHideTotalRaised] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);

  const categories = ["Wedding", "Birthday", "Nightlife / Club", "Concert / Gala", "Anniversary"];

  const handleLaunch = () => {
    playVanitiSound('auth');
    createEvent({
      title,
      hostName,
      category,
      venue,
      geofenceRadius,
      settlementWallet,
      hideTotals: hideTotalRaised,
      privacyToggles: {
        proximityDiscovery,
        showLeaderboard,
        hideTotalRaised,
        requireApproval
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 4px 20px 4px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => setRole(null)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Host Stage Setup
        </span>

        <div style={{ width: '38px' }} />
      </div>

      {/* Hero Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(18, 22, 30, 0.6) 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
            flexShrink: 0
          }}
        >
          <Tv size={26} color="#000" />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>
            Create Stage & Live Projector
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Broadcast real-time sprays on wedding hall projectors, track live leaderboard, settle to bank.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
        {/* Event Title */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Event Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '12px 14px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              fontWeight: 600,
            }}
          />
        </div>

        {/* Celebrant / Host Name */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Celebrant(s) / Recipient Name
          </label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '12px 14px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Category selector */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Category
          </label>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#000' : '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Venue & Geofence Radius */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Venue & Bluetooth Beacon Radius
            </label>
            <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 700 }}>
              {geofenceRadius}m radius
            </span>
          </div>

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <MapPin size={16} color="var(--neon-green)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '12px 14px 12px 40px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Slider */}
          <input
            type="range"
            min="25"
            max="300"
            step="25"
            value={geofenceRadius}
            onChange={(e) => setGeofenceRadius(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            <span>VIP Table (25m)</span>
            <span>Hall (100m)</span>
            <span>Grand Arena (300m)</span>
          </div>
        </div>

        {/* Recipient Settlement Wallet */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Settlement Destination (Instant Payout)
          </label>
          <div style={{ position: 'relative' }}>
            <Wallet size={16} color="var(--neon-green)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={settlementWallet}
              onChange={(e) => setSettlementWallet(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '12px 14px 12px 40px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Privacy & Display Toggles */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.4px' }}>
            Stage Display & Privacy Controls
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Proximity Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>
                  Live Proximity Discovery
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Allow guests within {geofenceRadius}m to detect stage via radar
                </span>
              </div>
              <button
                onClick={() => setProximityDiscovery(!proximityDiscovery)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '20px',
                  background: proximityDiscovery ? 'var(--neon-green)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#000',
                    position: 'absolute',
                    top: '3px',
                    left: proximityDiscovery ? '23px' : '3px',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>

            {/* Leaderboard on Projector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>
                  Show Leaderboard on Big Screen
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Display top 5 sprayers and podium ranks on venue projector
                </span>
              </div>
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '20px',
                  background: showLeaderboard ? 'var(--neon-green)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#000',
                    position: 'absolute',
                    top: '3px',
                    left: showLeaderboard ? '23px' : '3px',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>

            {/* Hide Total Raised */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>
                  Hide Total Amount Raised (Privacy Mode)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Keep grand total private, only showing note animations
                </span>
              </div>
              <button
                onClick={() => setHideTotalRaised(!hideTotalRaised)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '20px',
                  background: hideTotalRaised ? 'var(--neon-purple)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#000',
                    position: 'absolute',
                    top: '3px',
                    left: hideTotalRaised ? '23px' : '3px',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Launch CTA */}
      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <button
          onClick={handleLaunch}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#000',
            fontWeight: 800,
            fontSize: '16px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Tv size={20} />
          <span>Launch Live Projector Broadcast</span>
        </button>
      </div>
    </div>
  );
}
