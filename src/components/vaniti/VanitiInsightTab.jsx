import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  Zap, 
  Crown, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  BarChart3,
  PieChart,
  ShieldAlert,
  ArrowUp
} from 'lucide-react';

export default function VanitiInsightTab({ playVanitiSound, onOpenVip }) {
  const [selectedDay, setSelectedDay] = useState('Sat');

  const WEEKLY_DATA = [
    { day: 'Mon', amount: '₦20k', height: '15%', notes: 100 },
    { day: 'Tue', amount: '₦0k', height: '6%', notes: 0 },
    { day: 'Wed', amount: '₦45k', height: '28%', notes: 225 },
    { day: 'Thu', amount: '₦80k', height: '42%', notes: 400 },
    { day: 'Fri', amount: '₦280k', height: '88%', notes: 1400, isPeak: true },
    { day: 'Sat', amount: '₦350k', height: '100%', notes: 1750, isPeak: true },
    { day: 'Sun', amount: '₦125k', height: '55%', notes: 625 },
  ];

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px 24px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* 1. Header VIP Level Card */}
      <div 
        onClick={() => {
          if (onOpenVip) onOpenVip();
          if (playVanitiSound) playVanitiSound('auth');
        }}
        style={{
          background: 'linear-gradient(135deg, #261c10 0%, #1e1e24 100%)',
          border: '1px solid rgba(194, 120, 3, 0.4)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={20} color="#f59e0b" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Gold Baller Tier
            </span>
          </div>

          <div style={{
            background: 'rgba(194, 120, 3, 0.2)',
            borderRadius: '12px',
            padding: '3px 8px',
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: 700
          }}>
            Top 1% Sprayer
          </div>
        </div>

        <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '12px', letterSpacing: '-0.5px' }}>
          ₦2,450,000.00
        </div>
        <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
          Lifetime social cash sprayed across 28 VIP events
        </div>

        {/* Progress bar to Platinum */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8e8e93', marginBottom: '6px' }}>
            <span>Progress to Platinum Monarch Tier</span>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>82%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #c27803, #ffd700)', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* 2. Three Metric Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {/* Metric 1: Rank */}
        <div style={{
          background: '#232325',
          borderRadius: '16px',
          padding: '14px 10px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>#3</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', marginTop: '3px' }}>
            Club Rank
          </div>
        </div>

        {/* Metric 2: Spray Velocity */}
        <div style={{
          background: '#232325',
          borderRadius: '16px',
          padding: '14px 10px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#00e676' }}>16.7/s</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', marginTop: '3px' }}>
            Peak Speed
          </div>
        </div>

        {/* Metric 3: Total Notes */}
        <div style={{
          background: '#232325',
          borderRadius: '16px',
          padding: '14px 10px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>4,920</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', marginTop: '3px' }}>
            Notes Fumed
          </div>
        </div>
      </div>

      {/* 3. Weekly Volume Interactive Chart */}
      <div style={{
        background: '#232325',
        borderRadius: '20px',
        padding: '18px 16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Weekly Spray Rhythm</div>
            <div style={{ fontSize: '11px', color: '#8e8e93' }}>Weekend nightclub peaks (Fri & Sat)</div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
            {selectedDay ? `${WEEKLY_DATA.find(d => d.day === selectedDay)?.amount} (${WEEKLY_DATA.find(d => d.day === selectedDay)?.notes} notes)` : '₦900k Total'}
          </span>
        </div>

        {/* Bar chart container */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {WEEKLY_DATA.map(d => {
            const isSelected = selectedDay === d.day;
            return (
              <div 
                key={d.day}
                onClick={() => {
                  setSelectedDay(d.day);
                  if (playVanitiSound) playVanitiSound('flick');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  flex: 1,
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
              >
                {/* Bar */}
                <div style={{
                  width: '26px',
                  height: d.height,
                  borderRadius: '6px 6px 2px 2px',
                  background: isSelected 
                    ? 'linear-gradient(180deg, #ffd700, #c27803)' 
                    : d.isPeak ? 'rgba(194, 120, 3, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.5)' : 'none',
                  transition: 'all 0.25s ease'
                }} />
                
                {/* Day label */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: isSelected ? 800 : 500,
                  color: isSelected ? '#ffffff' : '#8e8e93',
                  marginBottom: '6px'
                }}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Denomination Distribution Breakdown */}
      <div style={{
        background: '#232325',
        borderRadius: '20px',
        padding: '18px 16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
          Favorite Banknotes Sprayed
        </div>

        {[
          { label: '₦200 Crisp Banknotes', pct: 68, amount: '₦1,666,000', color: '#c27803' },
          { label: '₦500 Nigerian Notes', pct: 22, amount: '₦539,000', color: '#38bdf8' },
          { label: '₦1,000 High Roller Notes', pct: 10, amount: '₦245,000', color: '#a855f7' },
        ].map(item => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: '#8e8e93' }}>{item.amount} ({item.pct}%)</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
