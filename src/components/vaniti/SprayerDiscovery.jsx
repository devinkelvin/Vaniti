import React, { useState } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  Radio, 
  MapPin, 
  Users, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Compass
} from 'lucide-react';

export default function SprayerDiscovery() {
  const { 
    events, 
    selectedEventId, 
    setSelectedEventId, 
    setSprayerStep, 
    setRole,
    isSearchingProximity, 
    rescanProximity,
    playVanitiSound
  } = useVaniti();

  const [filterRadius, setFilterRadius] = useState(250); // meters
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [manualPin, setManualPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Filter events by proximity radius unless empty simulated
  const visibleEvents = simulateEmpty 
    ? [] 
    : events.filter(e => e.distanceMeters <= filterRadius);

  const handleSelectEvent = (eventId) => {
    playVanitiSound('flick');
    setSelectedEventId(eventId);
    setSprayerStep('confirm');
  };

  const handleManualPinSubmit = (e) => {
    e.preventDefault();
    if (!manualPin.trim()) {
      setPinError('Please enter a 4-digit stage code');
      return;
    }
    const found = events.find(ev => ev.id.toLowerCase().includes(manualPin.toLowerCase()) || manualPin === '1024' || manualPin === '777');
    if (found) {
      setSelectedEventId(found.id);
      setSprayerStep('confirm');
    } else {
      // Default to first wedding event for smooth recovery
      setSelectedEventId(events[0].id);
      setSprayerStep('confirm');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 4px 20px 4px' }}>
      {/* Radar Discovery Header */}
      <div 
        style={{
          position: 'relative',
          padding: '24px 20px 20px 20px',
          background: 'radial-gradient(circle at 50% 30%, rgba(57, 255, 20, 0.08) 0%, rgba(9, 11, 14, 0) 70%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '20px',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Animated Sonar Radar Waves */}
        <div 
          style={{
            width: '110px',
            height: '110px',
            margin: '0 auto 14px auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            className="radar-ring"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(57, 255, 20, 0.35)',
              animation: 'radar-pulse 2.2s infinite ease-out'
            }}
          />
          <div 
            className="radar-ring-2"
            style={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              border: '1.5px solid rgba(57, 255, 20, 0.5)',
              animation: 'radar-pulse 2.2s infinite ease-out 0.7s'
            }}
          />
          <div 
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
              zIndex: 2,
            }}
          >
            <Radio size={22} color="#fff" className={isSearchingProximity ? 'spin-anim' : ''} />
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(57, 255, 20, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(57, 255, 20, 0.25)', marginBottom: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)', display: 'inline-block', boxShadow: '0 0 8px var(--neon-green)' }} />
          <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 600, letterSpacing: '0.3px' }}>
            {isSearchingProximity ? 'SCANNING RADIUS...' : 'PROXIMITY RADAR ACTIVE'}
          </span>
        </div>

        <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 700, margin: '4px 0 6px 0', letterSpacing: '-0.3px' }}>
          Live Events Around You
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto' }}>
          Zengly uses Bluetooth LE & high-accuracy geofencing to lock onto your celebrant's stage instantly.
        </p>

        {/* Quick Radius and Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={rescanProximity}
            className="glass-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={isSearchingProximity ? 'spin-anim' : ''} />
            Rescan Beacons
          </button>

          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            title="Test empty / error state where no events are in range"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: simulateEmpty ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: simulateEmpty ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              color: simulateEmpty ? '#f87171' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <AlertCircle size={13} />
            {simulateEmpty ? 'Empty State Active (Click to Restore)' : 'Test Edge Case: No Events'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {visibleEvents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Nearby Stages ({visibleEvents.length})
            </span>
            <span style={{ fontSize: '12px', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass size={13} /> Within {filterRadius}m
            </span>
          </div>

          {visibleEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => handleSelectEvent(evt.id)}
              className="glass glass-hover"
              style={{
                borderRadius: '20px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(18, 22, 30, 0.75)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Card Top: Avatar, Host & Distance */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={evt.hostAvatar}
                    alt={evt.hostName}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid rgba(57, 255, 20, 0.4)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      background: '#10b981',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #090b0e'
                    }}
                  >
                    <ShieldCheck size={11} color="#fff" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: 'rgba(57, 255, 20, 0.12)', 
                        color: 'var(--neon-green)', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px'
                      }}
                    >
                      {evt.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 600 }}>
                      {evt.distanceMeters}m away
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, margin: '2px 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.title}
                  </h4>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.venue}
                    </span>
                  </p>
                </div>

                <ChevronRight size={20} color="var(--text-muted)" style={{ alignSelf: 'center' }} />
              </div>

              {/* Card Bottom: Metrics pills */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                    <Users size={13} color="var(--neon-blue)" />
                    <strong style={{ color: '#fff' }}>{evt.activeSprayers}</strong> sprayers in room
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Total: <strong style={{ color: '#fbbf24' }}>₦{evt.totalSprayed.toLocaleString()}</strong>
                  </span>
                </div>

                <span 
                  style={{
                    background: 'rgba(57, 255, 20, 0.1)',
                    color: 'var(--neon-green)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  ⚡ Ready to Spray
                </span>
              </div>
            </div>
          ))}

          {/* Manual Stage Code Fallback */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              onClick={() => setShowPinInput(!showPinInput)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'underline'
              }}
            >
              <KeyRound size={14} /> Don't see your stage? Enter 4-Digit Event Code
            </button>

            {showPinInput && (
              <form onSubmit={handleManualPinSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. 1024 or WEDDING"
                  value={manualPin}
                  onChange={(e) => { setManualPin(e.target.value); setPinError(''); }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    width: '190px',
                    textAlign: 'center',
                    letterSpacing: '1px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--neon-green)',
                    color: '#000',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Join
                </button>
              </form>
            )}
            {pinError && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{pinError}</p>}
          </div>
        </div>
      ) : (
        /* Empty State & Error Recovery */
        <div 
          className="glass"
          style={{
            borderRadius: '24px',
            padding: '36px 24px',
            textAlign: 'center',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            marginTop: '10px'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}
          >
            📡
          </div>

          <div>
            <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>
              No Live Events Detected
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: '1.5' }}>
              We searched within 500 meters of your current location. Make sure you are inside the event hall or try one of the options below:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px', marginTop: '6px' }}>
            <button
              onClick={() => { setSimulateEmpty(false); rescanProximity(); }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 18px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} /> Simulate Nearby Wedding Event
            </button>

            <button
              onClick={() => setShowPinInput(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
              }}
            >
              Enter Event PIN Manually
            </button>

            <button
              onClick={() => { setRole('host'); }}
              style={{
                background: 'transparent',
                color: 'var(--neon-green)',
                fontSize: '13px',
                fontWeight: 600,
                padding: '8px 16px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Are you the host? Launch a stage →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
