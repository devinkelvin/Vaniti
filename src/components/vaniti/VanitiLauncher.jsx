import React from 'react';
import { useVaniti } from './VanitiContext';
import { Sparkles, Radio, ChevronRight } from 'lucide-react';

export default function VanitiLauncher() {
  const { setIsOpen, isOpen, setRole, events, playVanitiSound } = useVaniti();

  if (isOpen) return null;

  const liveCount = events.filter(e => e.isLive).length;

  const handleOpen = () => {
    playVanitiSound('flick');
    setIsOpen(true);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleOpen}
        className="glass glass-hover vaniti-launcher-pulse"
        style={{
          background: 'rgba(12, 16, 22, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          borderRadius: '30px',
          padding: '8px 20px 8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(57, 255, 20, 0.25)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Animated Icon Avatar */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
          }}
        >
          💸
        </div>

        {/* Text Details */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              Vaniti
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(57, 255, 20, 0.15)', color: 'var(--neon-green)', padding: '2px 6px', borderRadius: '6px' }}>
              LIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)', display: 'inline-block', boxShadow: '0 0 6px var(--neon-green)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {liveCount} stages active in range • Tap to Spray
            </span>
          </div>
        </div>

        <ChevronRight size={18} color="var(--neon-green)" style={{ marginLeft: '4px' }} />
      </button>
    </div>
  );
}
