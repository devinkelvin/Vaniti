import React, { useState } from 'react';
import { Settings, Plus, Smartphone, Wind, EyeOff, User, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useVaniti } from './vaniti/VanitiContext';

export default function ControlPanel({ 
  user, 
  onUpdateGhostMode, 
  onSimulateBump, 
  onAddFriend, 
  onToggleSpeed, 
  isSpeedToggled,
  soundEnabled,
  onToggleSound
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useVaniti();

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px'
      }}
    >
      {/* Expand/Collapse Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass glass-hover"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '1px solid var(--border-glass)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isOpen ? 'var(--neon-green)' : '#fff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        <Settings size={22} className={isOpen ? 'spin-anim' : ''} />
      </button>

      {/* Control Panel Panel */}
      {isOpen && (
        <div 
          className="glass"
          style={{
            width: '320px',
            borderRadius: '24px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            animation: 'pop-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={user.avatar} 
                alt="My Profile" 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: `2px solid ${user.ghostMode !== 'none' ? 'var(--neon-purple)' : 'var(--neon-green)'}`
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: '#12161e',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px'
              }}>
                👑
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '15px' }}>My Account</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Mode: {user.ghostMode === 'none' ? 'Precise 📍' : user.ghostMode === 'frozen' ? 'Frozen ❄️' : 'Blurred 🌫️'}
              </p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Privacy/Ghost Mode Selection */}
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Ghost Mode (Privacy)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'none', label: 'Precise', desc: 'Realtime location' },
                { id: 'blurred', label: 'Blur', desc: 'Approximate region' },
                { id: 'frozen', label: 'Freeze', desc: 'Lock last point' }
              ].map((mode) => {
                const isSelected = user.ghostMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onUpdateGhostMode(mode.id)}
                    title={mode.desc}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--neon-purple)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulations / Actions */}
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Simulation Tools
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={onAddFriend}
                style={{
                  width: '100%',
                  background: 'rgba(57, 255, 20, 0.08)',
                  color: 'var(--neon-green)',
                  border: '1px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(57, 255, 20, 0.15)';
                  e.target.style.borderColor = 'var(--neon-green)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(57, 255, 20, 0.08)';
                  e.target.style.borderColor = 'rgba(57, 255, 20, 0.2)';
                }}
              >
                <Plus size={16} /> Add Mock Friend
              </button>

              <button
                onClick={onSimulateBump}
                style={{
                  width: '100%',
                  background: 'rgba(0, 240, 255, 0.08)',
                  color: 'var(--neon-blue)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 240, 255, 0.15)';
                  e.target.style.borderColor = 'var(--neon-blue)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 240, 255, 0.08)';
                  e.target.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                }}
              >
                <Smartphone size={16} /> Simulate Phone Bump
              </button>

              <button
                onClick={onToggleSpeed}
                style={{
                  width: '100%',
                  background: isSpeedToggled ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSpeedToggled ? 'var(--neon-pink)' : 'var(--text-secondary)',
                  border: isSpeedToggled ? '1px solid var(--neon-pink)' : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <Wind size={16} /> 
                {isSpeedToggled ? 'Slow Down Movements' : 'Simulate Speeding (3G)'}
              </button>

              <button
                onClick={toggleTheme}
                id="theme-toggle-btn"
                style={{
                  width: '100%',
                  background: theme === 'light' ? 'rgba(255, 170, 0, 0.12)' : 'rgba(124, 58, 237, 0.12)',
                  color: theme === 'light' ? '#d97706' : '#a855f7',
                  border: theme === 'light' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} /> Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <Sun size={16} /> Switch to Light Mode
                  </>
                )}
              </button>

              <button
                onClick={onToggleSound}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 size={16} /> Mute Interactions
                  </>
                ) : (
                  <>
                    <VolumeX size={16} /> Enable Sounds
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
