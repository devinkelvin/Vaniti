import React from 'react';
import { Battery, BatteryCharging, Navigation, Moon, EyeOff, ShieldAlert, Zap } from 'lucide-react';

export default function FriendCard({ friend, userLocation, onSelect, onEmojiPing }) {
  // Determine battery color and icon
  const getBatteryDetails = (percent, isCharging) => {
    let color = '#39ff14'; // high
    if (percent < 20) color = '#ff007f'; // low
    else if (percent < 50) color = '#f59e0b'; // medium

    return {
      color,
      icon: isCharging ? (
        <BatteryCharging size={16} style={{ color }} />
      ) : (
        <Battery size={16} style={{ color }} />
      )
    };
  };

  const { color: batColor, icon: batIcon } = getBatteryDetails(friend.battery, friend.isCharging);

  // Status badges
  const renderStatus = () => {
    switch (friend.status) {
      case 'ghost':
        return (
          <span style={{ color: 'var(--neon-purple)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <EyeOff size={12} /> Ghost Mode
          </span>
        );
      case 'sleeping':
        return (
          <span style={{ color: 'var(--neon-blue)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Moon size={12} /> Sleeping
          </span>
        );
      default:
        return (
          <span style={{ color: 'var(--neon-green)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} /> Online
          </span>
        );
    }
  };

  const reactionEmojis = ['❤️', '🔥', '🎉', '💩'];

  return (
    <div 
      className="glass glass-hover" 
      style={{
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        onClick={() => onSelect(friend)}
      >
        {/* Avatar Container */}
        <div style={{ position: 'relative' }}>
          <img 
            src={friend.avatar} 
            alt={friend.name}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${
                friend.status === 'ghost' ? 'var(--neon-purple)' : 
                friend.status === 'sleeping' ? 'var(--neon-blue)' : 
                'var(--neon-green)'
              }`
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px'
          }}>
            {friend.emoji}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {friend.name}
            </h4>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
              {friend.lastSeen}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            {renderStatus()}
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              {friend.distance}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Divider */}
      <div style={{ height: '1px', background: 'var(--border-glass)' }} />

      {/* Sub Info Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {batIcon}
          <span>{friend.battery}%</span>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {friend.speed && <span>🏃 {friend.speed}</span>}
        </div>

        {/* Action Panel: Pings */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                onEmojiPing(friend, emoji);
              }}
              style={{
                background: 'var(--border-glass)',
                border: 'none',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
