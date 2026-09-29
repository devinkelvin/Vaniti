import React, { useState } from 'react';
import { 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function VanitiHistoryTab({ onOpenReceipt, playVanitiSound }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'club' | 'wedding' | 'birthday'
  const [search, setSearch] = useState('');

  const HISTORY_ITEMS = [
    {
      id: 'tx-101',
      host: 'Benny',
      event: 'VIP Stage Live Spray',
      category: 'club',
      amount: '₦150,000',
      notes: 750,
      denom: '₦200',
      animation: 'Flying Cash',
      time: 'Today · 2:08 AM',
      status: 'Settled Instant',
      hash: 'VAN-779024X',
      avatarSeed: 'Benny'
    },
    {
      id: 'tx-102',
      host: 'Chioma & David',
      event: 'Adeleke Royal Wedding Reception',
      category: 'wedding',
      amount: '₦200,000',
      notes: 400,
      denom: '₦500',
      animation: 'Money Rain',
      time: 'Yesterday · 8:40 PM',
      status: 'Settled Instant',
      hash: 'VAN-882190A',
      avatarSeed: 'Chioma'
    },
    {
      id: 'tx-103',
      host: 'Club Quilox Vault',
      event: 'Burna Boy VIP Afterparty',
      category: 'club',
      amount: '₦180,000',
      notes: 900,
      denom: '₦200',
      animation: 'Fire Blast',
      time: '3 days ago · 3:15 AM',
      status: 'Settled Instant',
      hash: 'VAN-991204Q',
      avatarSeed: 'Tony'
    },
    {
      id: 'tx-104',
      host: 'Tunde Bakare',
      event: "Tunde's 30th Birthday Bash",
      category: 'birthday',
      amount: '₦120,000',
      notes: 120,
      denom: '₦1000',
      animation: 'Champagne Shower',
      time: 'Last Saturday · 11:30 PM',
      status: 'Settled Instant',
      hash: 'VAN-663910B',
      avatarSeed: 'Tunde'
    }
  ];

  const filteredItems = HISTORY_ITEMS.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.host.toLowerCase().includes(search.toLowerCase()) || 
                          item.event.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px 24px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #251c14 0%, #1e1e22 100%)',
        border: '1px solid rgba(194, 120, 3, 0.25)',
        borderRadius: '20px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Monthly Spray Volume
          </span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '2px', letterSpacing: '-0.5px' }}>
            ₦650,000.00
          </div>
          <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} color="#00e676" />
            <span style={{ color: '#00e676', fontWeight: 600 }}>+34%</span> vs last month · 4 events
          </div>
        </div>

        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(194, 120, 3, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(194, 120, 3, 0.4)'
        }}>
          <Sparkles size={22} color="#c27803" />
        </div>
      </div>

      {/* Search Input */}
      <div style={{
        background: '#232325',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <Search size={16} color="#8e8e93" />
        <input 
          type="text"
          placeholder="Search by host, party, or hash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '13px',
            width: '100%'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'all', label: 'All Sprays' },
          { id: 'club', label: '🔥 Club Nights' },
          { id: 'wedding', label: '💍 Weddings' },
          { id: 'birthday', label: '🎂 Birthdays' }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => {
              setFilter(chip.id);
              if (playVanitiSound) playVanitiSound('flick');
            }}
            style={{
              background: filter === chip.id ? '#c27803' : '#232325',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              color: filter === chip.id ? '#ffffff' : '#8e8e93',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => {
              if (onOpenReceipt) onOpenReceipt(item);
              if (playVanitiSound) playVanitiSound('flick');
            }}
            style={{
              background: '#232325',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(194, 120, 3, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
          >
            {/* Top row: Avatar + Name + Amount */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.avatarSeed}`}
                  alt={item.host}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{item.host}</div>
                  <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '1px' }}>{item.event}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#c27803' }}>{item.amount}</div>
                <div style={{ fontSize: '11px', color: '#8e8e93', marginTop: '1px' }}>{item.notes} notes</div>
              </div>
            </div>

            {/* Bottom info row */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px'
            }}>
              <span style={{ color: '#8e8e93' }}>{item.time}</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: 'rgba(0, 230, 118, 0.12)',
                  color: '#00e676',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontWeight: 600,
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <CheckCircle2 size={10} />
                  {item.status}
                </span>

                <button style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  Receipt
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
