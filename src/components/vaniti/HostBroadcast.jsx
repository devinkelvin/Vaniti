import React, { useState, useEffect, useRef } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  Tv, 
  Pause, 
  Play, 
  Eye, 
  EyeOff, 
  StopCircle, 
  Maximize2, 
  Minimize2, 
  QrCode, 
  Trophy, 
  Sparkles, 
  Flame, 
  Users, 
  TrendingUp, 
  Volume2, 
  VolumeX,
  X,
  Crown,
  Zap,
  ChevronRight
} from 'lucide-react';
import podiumImg from '../../assets/vaniti/podium.png';

export default function HostBroadcast() {
  const { 
    activeEvent, 
    toggleEventPause, 
    toggleHideTotals, 
    endEvent, 
    recentSprayToast, 
    setRecentSprayToast,
    sprayHistory,
    setRole,
    playVanitiSound,
    soundEnabled,
    setSoundEnabled,
    sprayNote,
    isHostOffline,
    setIsHostOffline,
    syncStatus,
  } = useVaniti();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  const containerRef = useRef(null);
  const broadcastCanvasRef = useRef(null);
  const broadcastParticles = useRef([]);

  // Trigger celebration particle effect whenever a spray occurs
  useEffect(() => {
    if (!recentSprayToast) return;

    playVanitiSound('cash_drop');

    // Spawn 15 golden particles
    const canvas = broadcastCanvasRef.current;
    if (canvas) {
      for (let i = 0; i < 18; i++) {
        broadcastParticles.current.push({
          x: canvas.width / 2 + (Math.random() * 200 - 100),
          y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 400,
          vy: -250 - Math.random() * 300,
          gravity: 280,
          color: ['#fbbf24', '#10b981', '#f59e0b', '#fff'][Math.floor(Math.random() * 4)],
          size: 6 + Math.random() * 8,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 8,
          opacity: 1,
          lifetime: 2.5,
          age: 0,
        });
      }
    }

    const timer = setTimeout(() => {
      setRecentSprayToast(null);
    }, 4500);

    return () => clearTimeout(timer);
  }, [recentSprayToast, playVanitiSound, setRecentSprayToast]);

  // Projector Canvas animation loop
  useEffect(() => {
    const canvas = broadcastCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();
    let animId;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      broadcastParticles.current = broadcastParticles.current.filter(p => {
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.rotation += p.rotSpeed * dt;

        if (p.age > p.lifetime - 0.5) {
          p.opacity = Math.max(0, (p.lifetime - p.age) / 0.5);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        ctx.restore();

        return p.age < p.lifetime;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleEndEventClick = () => {
    if (confirm("Are you sure you want to end this live broadcast? You'll be taken to the post-event analytics & settlement statement.")) {
      playVanitiSound('fanfare');
      endEvent(activeEvent.id);
    }
  };

  const triggerCustomAnnouncement = () => {
    playVanitiSound('fanfare');
    setAnnouncement("🍾 VIP CHAMPAGNE HOUR UNLOCKED! KEEP SPRAYING! 🍾");
    setTimeout(() => setAnnouncement(null), 5000);
  };

  const top3 = activeEvent?.topSprayers?.slice(0, 3) || [];
  const rank1 = top3[0];
  const rank2 = top3[1];
  const rank3 = top3[2];

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 10%, #1e1b18 0%, #0c0e12 60%, #06080a 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Background Particle Canvas */}
      <canvas
        ref={broadcastCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Top Projector Header Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(12, 14, 18, 0.7)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Left: Event Title & Live Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse-glow 1.5s infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#ef4444' }}>LIVE ON STAGE</span>
          </div>

          <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              {activeEvent.title}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Celebrant: <strong style={{ color: '#fff' }}>{activeEvent.hostName}</strong> • {activeEvent.venue}
            </p>
          </div>
        </div>

        {/* Right: Quick Stage Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Real-time Broadcast Status Indicator */}
          <div
            title={`Real-Time Stage Sync: ${syncStatus?.isConnected ? 'Active' : 'Connecting'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: syncStatus?.isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              border: syncStatus?.isConnected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: syncStatus?.isConnected ? '#34d399' : '#facc15',
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: syncStatus?.isConnected ? '#10b981' : '#eab308',
              boxShadow: syncStatus?.isConnected ? '0 0 8px #10b981' : 'none',
            }} />
            <span>{syncStatus?.isConnected ? `LIVE SYNC (${syncStatus.peers} PEERS)` : 'SEARCHING...'}</span>
          </div>

          {/* Simulate Spray Trigger for instant testing */}
          <button
            onClick={() => {
              sprayNote(5000, {
                name: 'Chief Obi Okoye',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ChiefObi'
              });
            }}
            title="Simulate incoming guest spray (₦5,000)"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Zap size={14} color="#fbbf24" />
            Simulate Spray
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <QrCode size={16} color="var(--neon-green)" />
            Guest QR
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={() => setRole(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Exit View
          </button>
        </div>
      </div>

      {/* Live Spray Ticker / Toast Banner (Instant feedback when sprayer flicks notes!) */}
      {recentSprayToast && (
        <div
          style={{
            position: 'absolute',
            top: '85px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
            color: '#000',
            borderRadius: '30px',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 30,
            boxShadow: '0 12px 40px rgba(245, 158, 11, 0.6), 0 0 20px rgba(255, 255, 255, 0.5)',
            animation: 'pop-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <img
            src={recentSprayToast.sprayerAvatar}
            alt="Sprayer"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #000' }}
          />
          <div style={{ fontSize: '15px', fontWeight: 800 }}>
            <span>{recentSprayToast.sprayerName}</span> just sprayed <span style={{ textDecoration: 'underline' }}>₦{recentSprayToast.amount.toLocaleString()}</span>! 💸🔥
          </div>
        </div>
      )}

      {/* Special Announcement Banner */}
      {announcement && (
        <div
          style={{
            position: 'absolute',
            top: '85px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #bd00ff 0%, #ff007f 100%)',
            color: '#fff',
            borderRadius: '30px',
            padding: '14px 32px',
            zIndex: 35,
            fontWeight: 800,
            fontSize: '16px',
            boxShadow: '0 12px 40px rgba(189, 0, 255, 0.6)',
            animation: 'pop-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {announcement}
        </div>
      )}

      {/* Main Broadcast Stage Layout (2 Columns: Live Stats & Big Podium Leaderboard) */}
      <div 
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '24px',
          padding: '24px',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {/* Left Column: Big Screen Metrics & Recent Sprays Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Grand Total Raised Banner (Luxury Fintech Glass Design) */}
          <div
            className="glass"
            style={{
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(18, 22, 30, 0.92) 100%)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient gold glow sweep */}
            <div 
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Total Sprayed on Celebrants
                </span>
              </div>
              {activeEvent.hideTotals && (
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                  Private Mode Active
                </span>
              )}
            </div>

            <h1 
              className="tabular-nums"
              style={{ 
                fontSize: '48px', 
                fontWeight: 900, 
                color: activeEvent.hideTotals ? 'var(--text-muted)' : '#fff', 
                letterSpacing: '-1.5px',
                textShadow: activeEvent.hideTotals ? 'none' : '0 0 25px rgba(245, 158, 11, 0.5)'
              }}
            >
              {activeEvent.hideTotals ? '₦ • • • • • •' : `₦${activeEvent.totalSprayed.toLocaleString()}`}
            </h1>

            {/* Sub Metrics Ticker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>TOTAL NOTES</span>
                <strong style={{ fontSize: '18px', color: '#10b981', fontWeight: 900 }} className="tabular-nums">{activeEvent.totalNotes.toLocaleString()}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>ACTIVE SPRAYERS</span>
                <strong style={{ fontSize: '18px', color: 'var(--neon-blue)', fontWeight: 900 }} className="tabular-nums">{activeEvent.activeSprayers} on floor</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SPRAY VELOCITY</span>
                <strong style={{ fontSize: '18px', color: '#fbbf24', fontWeight: 900 }} className="tabular-nums">⚡ 48 notes/m</strong>
              </div>
            </div>
          </div>

          {/* Live Recent Sprays Realtime Feed */}
          <div
            className="glass"
            style={{
              flex: 1,
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'linear-gradient(180deg, rgba(18, 22, 30, 0.85) 0%, rgba(10, 13, 18, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--neon-green)" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  Live Floor Feed
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }} />
                Real-Time Stream
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sprayHistory.length > 0 ? (
                sprayHistory.slice(0, 6).map((sp) => (
                  <div
                    key={sp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      animation: 'pop-up 0.2s ease-out'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={sp.sprayerAvatar} alt={sp.sprayerName} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.15)' }} />
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'block' }}>{sp.sprayerName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sp.timestamp} • <strong style={{ color: 'var(--text-secondary)' }}>{sp.denomLabel}</strong></span>
                      </div>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#10b981' }} className="tabular-nums">
                      +₦{sp.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', fontSize: '13px' }}>
                  Waiting for first sprays from the floor...
                  <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-secondary)' }}>Guests are scanning proximity beacons now 📡</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Architectural Glass Plinth Podium & Leaderboard */}
        <div
          className="glass"
          style={{
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'linear-gradient(180deg, rgba(22, 27, 36, 0.9) 0%, rgba(12, 15, 20, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                }}
              >
                <Trophy size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                  Stage Leaderboard
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  VIP Benefactor Podium
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>
              TOP VIP SPRAYERS
            </span>
          </div>

          {/* Architectural 3D Glass Pedestal Podium System */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              margin: '20px auto 10px auto',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '14px',
            }}
          >
            {/* Rank 2 (Left Plinth - Silver) */}
            {rank2 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
                {/* Avatar with Silver Ring */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <img 
                    src={rank2.avatar} 
                    alt={rank2.name} 
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      border: '3px solid #cbd5e1', 
                      boxShadow: '0 6px 20px rgba(203, 213, 225, 0.5)' 
                    }} 
                  />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-4px', 
                      right: '-2px', 
                      background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)', 
                      color: '#000', 
                      fontSize: '11px', 
                      fontWeight: 900, 
                      borderRadius: '50%', 
                      width: '20px', 
                      height: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                    }}
                  >
                    2
                  </span>
                </div>

                <span style={{ fontSize: '12px', fontWeight: 800, color: '#e2e8f0', display: 'block', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rank2.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', marginBottom: '8px' }} className="tabular-nums">
                  ₦{rank2.amount.toLocaleString()}
                </span>

                {/* 3D Frosted Glass Plinth 2 */}
                <div 
                  style={{
                    width: '100%',
                    height: '110px',
                    borderRadius: '16px 16px 8px 8px',
                    background: 'linear-gradient(180deg, rgba(203, 213, 225, 0.25) 0%, rgba(148, 163, 184, 0.12) 100%)',
                    border: '1px solid rgba(203, 213, 225, 0.35)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e2e8f0',
                    fontSize: '28px',
                    fontWeight: 900,
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  2
                </div>
              </div>
            )}

            {/* Rank 1 (Center Plinth - Gold Champion) */}
            {rank1 && (
              <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 6, transform: 'translateY(-14px)' }}>
                {/* Crown Icon */}
                <div style={{ fontSize: '24px', marginBottom: '2px', animation: 'float-gentle 2.5s infinite ease-in-out' }}>👑</div>

                {/* Avatar with Gold Halo Ring */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <img 
                    src={rank1.avatar} 
                    alt={rank1.name} 
                    style={{ 
                      width: '72px', 
                      height: '72px', 
                      borderRadius: '50%', 
                      border: '3.5px solid #fbbf24', 
                      boxShadow: '0 8px 30px rgba(251, 191, 36, 0.75)' 
                    }} 
                  />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-4px', 
                      right: '-2px', 
                      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', 
                      color: '#000', 
                      fontSize: '12px', 
                      fontWeight: 900, 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    1
                  </span>
                </div>

                <span style={{ fontSize: '14px', fontWeight: 900, color: '#fbbf24', display: 'block', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rank1.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: '8px' }} className="tabular-nums">
                  ₦{rank1.amount.toLocaleString()}
                </span>

                {/* 3D Frosted Glass Plinth 1 (Tallest) */}
                <div 
                  style={{
                    width: '100%',
                    height: '145px',
                    borderRadius: '18px 18px 8px 8px',
                    background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.35) 0%, rgba(217, 119, 6, 0.18) 100%)',
                    border: '1.5px solid rgba(251, 191, 36, 0.5)',
                    boxShadow: '0 16px 40px rgba(251, 191, 36, 0.3), 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fbbf24',
                    fontSize: '36px',
                    fontWeight: 900,
                    textShadow: '0 2px 12px rgba(251, 191, 36, 0.8)'
                  }}
                >
                  <span>1</span>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#000', background: '#fbbf24', padding: '2px 8px', borderRadius: '10px', marginTop: '4px' }}>
                    CHAMPION
                  </span>
                </div>
              </div>
            )}

            {/* Rank 3 (Right Plinth - Bronze) */}
            {rank3 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
                {/* Avatar with Bronze Ring */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <img 
                    src={rank3.avatar} 
                    alt={rank3.name} 
                    style={{ 
                      width: '52px', 
                      height: '52px', 
                      borderRadius: '50%', 
                      border: '3px solid #d97706', 
                      boxShadow: '0 6px 20px rgba(217, 119, 6, 0.5)' 
                    }} 
                  />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-4px', 
                      right: '-2px', 
                      background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', 
                      color: '#000', 
                      fontSize: '11px', 
                      fontWeight: 900, 
                      borderRadius: '50%', 
                      width: '20px', 
                      height: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                    }}
                  >
                    3
                  </span>
                </div>

                <span style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', display: 'block', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rank3.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', marginBottom: '8px' }} className="tabular-nums">
                  ₦{rank3.amount.toLocaleString()}
                </span>

                {/* 3D Frosted Glass Plinth 3 (Shortest) */}
                <div 
                  style={{
                    width: '100%',
                    height: '85px',
                    borderRadius: '16px 16px 8px 8px',
                    background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.12) 100%)',
                    border: '1px solid rgba(217, 119, 6, 0.35)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d97706',
                    fontSize: '28px',
                    fontWeight: 900,
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  3
                </div>
              </div>
            )}
          </div>

          {/* Ranks 4 to 6 Secondary Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
            {activeEvent?.topSprayers?.slice(3, 6).map((sp, idx) => {
              const isMe = sp.name === 'Kelvin Ekuhoho';
              return (
                <div
                  key={sp.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: isMe 
                      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.08) 100%)' 
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isMe ? '1px solid var(--neon-green)' : '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 900, color: 'var(--text-muted)', width: '20px' }}>#{sp.rank || idx + 4}</span>
                    <img src={sp.avatar} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                    <span style={{ color: isMe ? 'var(--neon-green)' : '#fff', fontWeight: isMe ? 800 : 600 }}>
                      {sp.name} {isMe && '(You)'}
                    </span>
                  </div>
                  <strong style={{ color: '#fbbf24', fontSize: '13px' }} className="tabular-nums">
                    ₦{sp.amount.toLocaleString()}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stage Control Bar (Host Controls: Pause, Hide Totals, Announcement, End) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '14px 24px',
          background: 'rgba(10, 12, 16, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Pause / Resume Sprays */}
          <button
            onClick={() => {
              playVanitiSound('flick');
              toggleEventPause(activeEvent.id);
            }}
            style={{
              background: activeEvent.isPaused ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {activeEvent.isPaused ? <Play size={16} /> : <Pause size={16} />}
            {activeEvent.isPaused ? 'Resume Sprays' : 'Pause Sprays (Speech Mode)'}
          </button>

          {/* Hide / Show Totals */}
          <button
            onClick={() => {
              playVanitiSound('flick');
              toggleHideTotals(activeEvent.id);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {activeEvent.hideTotals ? <Eye size={16} /> : <EyeOff size={16} />}
            {activeEvent.hideTotals ? 'Show Total Raised' : 'Hide Total (Private Mode)'}
          </button>

          {/* Broadcast Announcement */}
          <button
            onClick={triggerCustomAnnouncement}
            style={{
              background: 'linear-gradient(135deg, rgba(189, 0, 255, 0.2) 0%, rgba(255, 0, 127, 0.2) 100%)',
              border: '1px solid rgba(189, 0, 255, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={15} color="var(--neon-pink)" />
            Send Stage Toast
          </button>

          {/* Quick Simulation for testing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '0 6px' }}>Simulate Spray:</span>
            <button
              onClick={() => sprayNote(10000)}
              style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
            >
              +₦10k
            </button>
            <button
              onClick={() => sprayNote(50000)}
              style={{ background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
            >
              +₦50k
            </button>
          </div>
        </div>

        {/* End Event CTA */}
        <button
          onClick={handleEndEventClick}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <StopCircle size={16} />
          End Stage & View Analytics
        </button>
      </div>

      {/* Guest QR Modal for Projector */}
      {showQrModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="glass"
            style={{
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              width: '90%',
              maxWidth: '360px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              Scan to Spray Cash
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Point camera or open Zengly to join stage automatically
            </p>

            <div 
              style={{ 
                background: '#fff', 
                padding: '16px', 
                borderRadius: '20px', 
                display: 'inline-flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer corners */}
                <rect x="10" y="10" width="45" height="45" rx="8" stroke="#000" strokeWidth="6" />
                <rect x="22" y="22" width="21" height="21" rx="4" fill="#10b981" />
                <rect x="125" y="10" width="45" height="45" rx="8" stroke="#000" strokeWidth="6" />
                <rect x="137" y="22" width="21" height="21" rx="4" fill="#10b981" />
                <rect x="10" y="125" width="45" height="45" rx="8" stroke="#000" strokeWidth="6" />
                <rect x="22" y="137" width="21" height="21" rx="4" fill="#10b981" />
                
                {/* QR Data Pattern */}
                <rect x="68" y="15" width="12" height="12" rx="2" fill="#000" />
                <rect x="88" y="15" width="12" height="24" rx="2" fill="#000" />
                <rect x="68" y="38" width="15" height="12" rx="2" fill="#000" />
                <rect x="15" y="68" width="24" height="12" rx="2" fill="#000" />
                <rect x="48" y="68" width="12" height="24" rx="2" fill="#000" />
                <rect x="15" y="92" width="18" height="18" rx="2" fill="#000" />
                <rect x="125" y="68" width="18" height="12" rx="2" fill="#000" />
                <rect x="148" y="68" width="22" height="22" rx="2" fill="#000" />
                <rect x="135" y="100" width="15" height="15" rx="2" fill="#000" />
                <rect x="68" y="125" width="22" height="12" rx="2" fill="#000" />
                <rect x="100" y="125" width="12" height="25" rx="2" fill="#000" />
                <rect x="68" y="148" width="15" height="18" rx="2" fill="#000" />
                <rect x="125" y="148" width="20" height="20" rx="2" fill="#000" />
                <rect x="155" y="138" width="15" height="15" rx="2" fill="#000" />

                {/* Center Zengly Logo Badge */}
                <circle cx="90" cy="90" r="22" fill="#12161e" />
                <circle cx="90" cy="90" r="20" fill="#10b981" />
                <text x="90" y="96" textAnchor="middle" fill="#000" fontSize="16" fontWeight="900" fontFamily="sans-serif">Z</text>
              </svg>

              <span style={{ fontSize: '11px', color: '#000', fontWeight: 800, marginTop: '8px', letterSpacing: '0.5px' }}>
                STAGE CODE: #{activeEvent.id.split('-')[1]?.toUpperCase() || 'WEDDING'}
              </span>
            </div>

            {/* Direct Connect URLs for Connected Phone & Guests */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '12px 14px', marginBottom: '16px', textAlign: 'left', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📱 Connected Android Phone:</span>
                <span style={{ color: 'var(--neon-green)', fontWeight: 700, fontFamily: 'monospace' }}>http://localhost:5174</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📶 Wi-Fi Guest URL:</span>
                <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>http://192.168.1.197:5174</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  window.open('/?view=vaniti', '_blank', 'width=420,height=820');
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                Launch Guest Phone
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
