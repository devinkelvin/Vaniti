import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Radio, 
  Users, 
  Check, 
  Sparkles, 
  Search, 
  Share2, 
  Download, 
  Flashlight, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  Copy,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// 1. QR CODE SCANNER MODAL (Scanner + My QR Code)
// ============================================================================
export const QrScannerModal = ({ isOpen, onClose, onSelectRecipient, playVanitiSound }) => {
  const [tab, setTab] = useState('scan'); // 'scan' | 'my_qr'
  const [torchOn, setTorchOn] = useState(false);
  const [scannedHost, setScannedHost] = useState(null);

  useEffect(() => {
    if (isOpen && tab === 'scan') {
      // Simulate automatic target acquisition after 1.8 seconds
      const timer = setTimeout(() => {
        setScannedHost({ name: 'Benny', venue: 'VIP Stage 1', id: 'benny' });
        if (playVanitiSound) playVanitiSound('flick');
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setScannedHost(null);
    }
  }, [isOpen, tab]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#1c1c1f',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Segmented Tab: Scan Host | My QR */}
          <div style={{
            background: '#2c2c2e',
            borderRadius: '20px',
            padding: '3px',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => {
                setTab('scan');
                if (playVanitiSound) playVanitiSound('flick');
              }}
              style={{
                background: tab === 'scan' ? '#c27803' : 'transparent',
                border: 'none',
                borderRadius: '16px',
                padding: '6px 14px',
                color: tab === 'scan' ? '#ffffff' : '#8e8e93',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Scan Host QR
            </button>
            <button
              onClick={() => {
                setTab('my_qr');
                if (playVanitiSound) playVanitiSound('flick');
              }}
              style={{
                background: tab === 'my_qr' ? '#c27803' : 'transparent',
                border: 'none',
                borderRadius: '16px',
                padding: '6px 14px',
                color: tab === 'my_qr' ? '#ffffff' : '#8e8e93',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              My QR Code
            </button>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab 1: Live Viewfinder */}
        {tab === 'scan' ? (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '240px',
              height: '240px',
              background: '#0d0d0f',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '2px solid rgba(194, 120, 3, 0.4)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Corner Reticles */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '3px solid #c27803', borderLeft: '3px solid #c27803', borderTopLeftRadius: '8px' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '3px solid #c27803', borderRight: '3px solid #c27803', borderTopRightRadius: '8px' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '3px solid #c27803', borderLeft: '3px solid #c27803', borderBottomLeftRadius: '8px' }} />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '3px solid #c27803', borderRight: '3px solid #c27803', borderBottomRightRadius: '8px' }} />

              {/* Laser Scanning Line */}
              <div 
                style={{
                  position: 'absolute',
                  left: '10px',
                  right: '10px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #c27803, #ffd700, #c27803, transparent)',
                  boxShadow: '0 0 12px #c27803, 0 0 20px #ffd700',
                  animation: 'laserScan 2.4s ease-in-out infinite'
                }}
              />

              {/* Viewfinder Center Ghost QR */}
              <QrCode size={110} color={torchOn ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"} />

              {/* Torch Glow Effect */}
              {torchOn && (
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
              )}
            </div>

            {/* Target Found Pill */}
            {scannedHost ? (
              <div style={{
                marginTop: '16px',
                background: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid #00e676',
                borderRadius: '18px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'scaleIn 0.2s ease-out'
              }}>
                <Check size={16} color="#00e676" strokeWidth={3} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  Target Acquired: <strong>{scannedHost.name}</strong> ({scannedHost.venue})
                </span>
              </div>
            ) : (
              <p style={{ color: '#8e8e93', fontSize: '13px', marginTop: '16px', textAlign: 'center' }}>
                Align host QR code within the frame to spray
              </p>
            )}

            {/* Controls Bar: Torch | Select Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setTorchOn(!torchOn);
                  if (playVanitiSound) playVanitiSound('flick');
                }}
                style={{
                  background: torchOn ? '#c27803' : '#2c2c2e',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Flashlight size={20} />
              </button>

              <button
                onClick={() => {
                  if (onSelectRecipient) onSelectRecipient('benny');
                  if (playVanitiSound) playVanitiSound('auth');
                  onClose();
                }}
                style={{
                  flex: 1,
                  background: scannedHost ? '#c27803' : '#333336',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px 0',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: scannedHost ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
              >
                {scannedHost ? `Lock Target: ${scannedHost.name}` : 'Simulate Lock'}
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: My Personal QR Code */
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              marginBottom: '16px'
            }}>
              <QrCode size={180} color="#000000" />
            </div>

            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Kelvin Ekuhoho (@kelvinballer)
            </div>
            <div style={{ fontSize: '12px', color: '#8e8e93', marginBottom: '16px' }}>
              Vaniti VIP Radar ID: VAN-08291
            </div>

            <div style={{
              background: '#232325',
              borderRadius: '14px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#c27803',
              border: '1px solid rgba(194, 120, 3, 0.2)'
            }}>
              <ShieldCheck size={16} />
              <span>Ready to receive social sprays automatically</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes laserScan {
          0% { top: 12px; opacity: 0.3; }
          50% { top: 220px; opacity: 1; }
          100% { top: 12px; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// 2. NFC TAP PRO MODAL (Radar Radar Simulation)
// ============================================================================
export const NfcTapModal = ({ isOpen, onClose, onSelectRecipient, playVanitiSound }) => {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocked(false);
      // Simulate NFC lock after 1.5 seconds
      const timer = setTimeout(() => {
        setLocked(true);
        if (playVanitiSound) playVanitiSound('cash_drop');
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '360px',
          background: '#1c1c1f',
          borderRadius: '28px',
          padding: '28px 24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Radar concentric pulsing animation */}
        <div style={{
          width: '140px',
          height: '140px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          {/* Animated concentric rings */}
          <div style={{
            position: 'absolute',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: '2px solid rgba(194, 120, 3, 0.3)',
            animation: 'nfcPulse 2s ease-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '2px solid rgba(194, 120, 3, 0.5)',
            animation: 'nfcPulse 2s ease-out infinite 0.6s'
          }} />

          {/* Center Device Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: locked ? 'linear-gradient(135deg, #00e676, #008751)' : 'linear-gradient(135deg, #c27803, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            boxShadow: locked ? '0 0 25px rgba(0, 230, 118, 0.6)' : '0 0 25px rgba(194, 120, 3, 0.6)',
            transition: 'all 0.3s ease'
          }}>
            {locked ? <Check size={32} strokeWidth={3} /> : <Radio size={30} />}
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          {locked ? 'Host Connected!' : 'NFC Ready to Tap'}
        </h3>

        <p style={{ color: '#8e8e93', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>
          {locked 
            ? 'Paired with Benny’s VIP wristband. Spray target locked!'
            : 'Hold top of your phone near host’s phone or VIP badge to pair.'}
        </p>

        <button
          onClick={() => {
            if (onSelectRecipient) onSelectRecipient('benny');
            if (playVanitiSound) playVanitiSound('auth');
            onClose();
          }}
          style={{
            width: '100%',
            background: locked ? '#00e676' : '#c27803',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 0',
            color: locked ? '#000000' : '#ffffff',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          {locked ? 'Proceed with Benny' : 'Simulate Instant Tap'}
        </button>
      </div>

      <style>{`
        @keyframes nfcPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// 3. CONTACTS & NEARBY HOSTS DISCOVERY MODAL
// ============================================================================
export const ContactsModal = ({ isOpen, onClose, onSelectRecipient, currentSelected, playVanitiSound }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all'); // 'all' | 'nearby' | 'vip'

  const CONTACTS = [
    {
      id: 'benny',
      name: 'Benny',
      handle: '@bennystage',
      role: 'VIP Celebrant & DJ',
      distance: '2m away',
      avatarSeed: 'Benny',
      isNearby: true,
      badge: '👑 Featured Host',
      accent: '#c27803'
    },
    {
      id: 'obi',
      name: 'Chief Obi Okoye',
      handle: '@chiefobi',
      role: 'High Roller VIP',
      distance: '6m away',
      avatarSeed: 'ChiefObi',
      isNearby: true,
      badge: '⚡ Top Baller',
      accent: '#eab308'
    },
    {
      id: 'sarah',
      name: 'Sarah Connor',
      handle: '@sarah',
      role: 'Celebrity Guest',
      distance: '14m away',
      avatarSeed: 'Sarah',
      isNearby: true,
      badge: '🌟 Verified Host',
      accent: '#38bdf8'
    },
    {
      id: 'alex',
      name: 'Alex Mercer',
      handle: '@alexm',
      role: 'Event Organizer',
      distance: '25m away',
      avatarSeed: 'Alex',
      isNearby: false,
      badge: '🎟️ Host',
      accent: '#a855f7'
    },
    {
      id: 'chioma',
      name: 'Chioma Adeleke',
      handle: '@chiomaa',
      role: 'Bride & Hostess',
      distance: '50m away',
      avatarSeed: 'Chioma',
      isNearby: false,
      badge: '💍 Wedding Host',
      accent: '#ec4899'
    }
  ];

  if (!isOpen) return null;

  const filtered = CONTACTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.handle.toLowerCase().includes(search.toLowerCase());
    if (category === 'nearby') return matchesSearch && c.isNearby;
    if (category === 'vip') return matchesSearch && c.badge.includes('VIP') || c.badge.includes('Baller');
    return matchesSearch;
  });

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1c1c1f',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 32px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '80dvh',
          boxShadow: '0 -15px 50px rgba(0,0,0,0.9)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Select Recipient</span>
            <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>Choose a celebrant or scan nearby radar</div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          background: '#2c2c2e',
          borderRadius: '16px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <Search size={18} color="#8e8e93" />
          <input
            type="text"
            placeholder="Search host by name or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '14px',
              width: '100%'
            }}
          />
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Hosts' },
            { id: 'nearby', label: '🔥 Nearby (Radar)' },
            { id: 'vip', label: '👑 VIP Kings' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => {
                setCategory(chip.id);
                if (playVanitiSound) playVanitiSound('flick');
              }}
              style={{
                background: category === chip.id ? 'rgba(194, 120, 3, 0.2)' : '#27272a',
                border: category === chip.id ? '1px solid #c27803' : '1px solid transparent',
                borderRadius: '20px',
                padding: '6px 14px',
                color: category === chip.id ? '#ffffff' : '#a1a1aa',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Contacts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '380px' }}>
          {filtered.map(contact => {
            const isSelected = currentSelected === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => {
                  if (onSelectRecipient) onSelectRecipient(contact.id);
                  if (playVanitiSound) playVanitiSound('flick');
                  onClose();
                }}
                style={{
                  background: isSelected ? '#33291d' : '#27272a',
                  border: isSelected ? '1px solid #c27803' : '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${contact.avatarSeed}`}
                    alt={contact.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{contact.name}</span>
                      <span style={{ fontSize: '11px', color: contact.accent, fontWeight: 600 }}>{contact.badge}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
                      {contact.role} · <span style={{ color: contact.isNearby ? '#00e676' : '#8e8e93' }}>{contact.distance}</span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#c27803', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} color="#000000" strokeWidth={3} />
                  </div>
                ) : (
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. ANIMATION PICKER BOTTOM SHEET
// ============================================================================
export const AnimationPickerSheet = ({ isOpen, onClose, selectedAnimation, onSelectAnimation, playVanitiSound }) => {
  const ANIMATIONS = [
    {
      id: 'Flying Cash',
      title: 'Flying Cash (Signature)',
      desc: 'Central Bank crisp banknote drift with realistic air resistance flutter.',
      icon: '💸'
    },
    {
      id: 'Money Rain',
      title: 'Money Rain (Downpour)',
      desc: 'Rapid vertical spray stream covering the host in cascading banknotes.',
      icon: '🌧️'
    },
    {
      id: 'Fire Blast',
      title: 'Fire Blast (Golden Embers)',
      desc: 'Explosive high-velocity spray with sparkling golden flare particles.',
      icon: '🔥'
    },
    {
      id: 'Champagne Shower',
      title: 'Champagne Shower (Vortex)',
      desc: 'Spiral 3D circular spray mimicking high-roller club celebration.',
      icon: '🍾'
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1c1c1e',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 32px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
            Select Spray Animation
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {ANIMATIONS.map(anim => {
          const isSelected = selectedAnimation === anim.id;
          return (
            <div
              key={anim.id}
              onClick={() => {
                onSelectAnimation(anim.id);
                if (playVanitiSound) playVanitiSound('flick');
                setTimeout(onClose, 150);
              }}
              style={{
                background: '#2c2c2e',
                border: isSelected ? '1px solid #c27803' : '1px solid transparent',
                borderRadius: '16px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>{anim.icon}</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                    {anim.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
                    {anim.desc}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#c27803',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={14} color="#000000" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
