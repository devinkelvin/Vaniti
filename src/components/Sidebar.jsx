import React, { useState } from 'react';
import { Search, UserCheck, Moon, EyeOff, Users, Sparkles } from 'lucide-react';
import FriendCard from './FriendCard';
import { useVaniti } from './vaniti/VanitiContext';

export default function Sidebar({ friends, userLocation, onSelectFriend, onEmojiPing }) {
  const { setIsOpen, playVanitiSound } = useVaniti();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, sleeping, ghost

  // Filter logic
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return friend.status === 'online';
    if (activeFilter === 'sleeping') return friend.status === 'sleeping';
    if (activeFilter === 'ghost') return friend.status === 'ghost';
    return true;
  });

  return (
    <div 
      className="glass" 
      style={{
        width: '380px',
        height: 'calc(100vh - 40px)',
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Friends
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
          {friends.filter(f => f.status === 'online').length} online now
        </p>
      </div>

      {/* Vaniti Live Stage Quick Access Banner */}
      <div
        onClick={() => {
          playVanitiSound('flick');
          setIsOpen(true);
        }}
        className="glass-hover"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>💸</span>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Vaniti Stage Active</span>
            <span style={{ fontSize: '11px', color: 'var(--neon-green)' }}>Chioma & David's Wedding • 15m</span>
          </div>
        </div>
        <span style={{ fontSize: '11px', background: 'var(--neon-green)', color: '#000', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
          SPRAY
        </span>
      </div>

      {/* Search Input */}
      <div 
        style={{
          position: 'relative',
          marginBottom: '16px',
        }}
      >
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input 
          type="text" 
          placeholder="Search friends..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-panel-hover)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '12px 16px 12px 44px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--neon-green)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
        />
      </div>

      {/* Quick Filters */}
      <div 
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {[
          { id: 'all', label: 'All', icon: <Users size={14} /> },
          { id: 'active', label: 'Active', icon: <UserCheck size={14} /> },
          { id: 'sleeping', label: 'Sleep', icon: <Moon size={14} /> },
          { id: 'ghost', label: 'Ghost', icon: <EyeOff size={14} /> },
        ].map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background: isSelected ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#000' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Friends List */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          marginRight: '-10px',
          paddingRight: '10px'
        }}
      >
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <FriendCard 
              key={friend.id} 
              friend={friend} 
              userLocation={userLocation}
              onSelect={onSelectFriend}
              onEmojiPing={onEmojiPing}
            />
          ))
        ) : (
          <div 
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '40px 20px',
              fontSize: '14px'
            }}
          >
            No friends found in this category 🔍
          </div>
        )}
      </div>
    </div>
  );
}
