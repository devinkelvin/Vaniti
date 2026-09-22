import React, { useState } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Award, 
  FileText, 
  PieChart, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function HostAnalytics() {
  const { activeEvent, setRole, setHostStep, playVanitiSound } = useVaniti();
  const [downloadStatementSuccess, setDownloadStatementSuccess] = useState(false);

  const totalSprayed = activeEvent?.totalSprayed || 1845000;
  const totalNotes = activeEvent?.totalNotes || 3420;
  const totalDonors = (activeEvent?.topSprayers?.length || 5) + 43;
  const avgSpray = Math.round(totalSprayed / Math.max(1, totalDonors));
  const peakSpeed = "340 notes / min";

  const handleDownloadStatement = () => {
    playVanitiSound('cash_drop');
    setDownloadStatementSuccess(true);
    setTimeout(() => setDownloadStatementSuccess(false), 2500);
  };

  const handleDone = () => {
    playVanitiSound('flick');
    setRole(null);
    setHostStep('setup');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 4px 20px 4px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={handleDone}
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
          Post-Event Executive Summary
        </span>

        <button
          onClick={handleDownloadStatement}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          {downloadStatementSuccess ? 'Saved! ✓' : 'Export PDF'}
        </button>
      </div>

      {/* Hero Settlement Banner */}
      <div
        className="glass"
        style={{
          borderRadius: '24px',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(18, 22, 30, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={14} color="#000" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#34d399', letterSpacing: '0.5px' }}>
            STAGE COMPLETED & SETTLEMENT DISPATCHED
          </span>
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', margin: '4px 0 6px 0' }}>
          ₦{totalSprayed.toLocaleString()}
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Gross funds sprayed at <strong style={{ color: '#fff' }}>{activeEvent.title}</strong>
        </p>

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Settlement Account: <strong style={{ color: '#fff' }}>{activeEvent.settlementWallet}</strong>
          </span>
          <span style={{ color: 'var(--neon-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Payout Confirmed
          </span>
        </div>
      </div>

      {/* 4-Stat Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="glass" style={{ borderRadius: '18px', padding: '16px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            TOTAL DONORS
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{totalDonors}</h3>
          <span style={{ fontSize: '11px', color: 'var(--neon-green)' }}>100% verified guests</span>
        </div>

        <div className="glass" style={{ borderRadius: '18px', padding: '16px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            AVERAGE SPRAY
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24' }}>₦{avgSpray.toLocaleString()}</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Per attending sprayer</span>
        </div>

        <div className="glass" style={{ borderRadius: '18px', padding: '16px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            NOTES FLICKED
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa' }}>{totalNotes.toLocaleString()}</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Digital notes & bricks</span>
        </div>

        <div className="glass" style={{ borderRadius: '18px', padding: '16px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            PEAK VELOCITY
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f43f5e' }}>{peakSpeed}</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>During celebrant entrance</span>
        </div>
      </div>

      {/* Denomination Breakdown */}
      <div className="glass" style={{ borderRadius: '20px', padding: '18px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.4px' }}>
          Denomination Breakdown
        </h4>

        {/* Multi-segment progress bar */}
        <div style={{ height: '12px', width: '100%', borderRadius: '10px', overflow: 'hidden', display: 'flex', marginBottom: '14px' }}>
          <div style={{ width: '42%', background: '#3b82f6' }} title="₦1,000 Notes (42%)" />
          <div style={{ width: '28%', background: '#059669' }} title="₦500 Notes (28%)" />
          <div style={{ width: '18%', background: '#e86a82' }} title="₦200 Notes (18%)" />
          <div style={{ width: '12%', background: '#eab308' }} title="Bundles (12%)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ color: 'var(--text-secondary)' }}>₦1,000 Notes: <strong style={{ color: '#fff' }}>42%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
            <span style={{ color: 'var(--text-secondary)' }}>₦500 Notes: <strong style={{ color: '#fff' }}>28%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e86a82' }} />
            <span style={{ color: 'var(--text-secondary)' }}>₦200 Notes: <strong style={{ color: '#fff' }}>18%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Mint Bundles: <strong style={{ color: '#fff' }}>12%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Sprayers Hall of Fame */}
      <div className="glass" style={{ borderRadius: '20px', padding: '18px', border: '1px solid var(--border-glass)', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.4px' }}>
          Top Sprayers Hall of Fame
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeEvent?.topSprayers?.slice(0, 5).map((sp, idx) => (
            <div
              key={sp.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#d97706' : 'var(--text-muted)', width: '20px' }}>
                  #{idx + 1}
                </span>
                <img src={sp.avatar} alt={sp.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{sp.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sp.noteCount || 100} notes sprayed</span>
                </div>
              </div>

              <strong style={{ color: '#fbbf24', fontSize: '14px' }}>
                ₦{sp.amount.toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Return Action */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={handleDone}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '15px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
          }}
        >
          Return to Zengly Social Map
        </button>
      </div>
    </div>
  );
}
