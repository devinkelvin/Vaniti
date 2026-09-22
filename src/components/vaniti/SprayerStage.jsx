import React, { useState, useEffect, useRef } from 'react';
import { useVaniti, DENOMINATIONS } from './VanitiContext';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Flame, 
  ChevronUp, 
  Sparkles, 
  RotateCcw,
  Zap,
  Layers,
  PauseCircle,
  Play,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Radio,
  Crown,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import naira100Img from '../../assets/vaniti/naira_100.png';
import naira200Img from '../../assets/vaniti/naira_200.png';
import naira500Img from '../../assets/vaniti/naira_500.png';
import naira1000Img from '../../assets/vaniti/naira_1000.png';
import usd100Img from '../../assets/vaniti/usd_100.png';
import bundleImg from '../../assets/vaniti/bundle_stack_200.png';

const NOTE_TEXTURES = {
  '100': naira100Img,
  '200': naira200Img,
  '500': naira500Img,
  '1000': naira1000Img,
  'usd100': usd100Img,
  'bundle': bundleImg,
};

export default function SprayerStage() {
  const { 
    activeEvent, 
    selectedDenomId, 
    setSelectedDenomId, 
    sprayPotTarget, 
    sprayedAmount, 
    sprayNote, 
    setSprayerStep,
    soundEnabled, 
    setSoundEnabled,
    playVanitiSound,
    walletBalance,
    topUpWallet,
    isHostOffline,
    setIsHostOffline,
    isPendingTransaction,
    setIsPendingTransaction,
    hasSeenStageCoachmark,
    setHasSeenStageCoachmark
  } = useVaniti();

  const canvasRef = useRef(null);
  const notesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Gesture drag tracking
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Reaction emojis
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isContinuousSpraying, setIsContinuousSpraying] = useState(false);
  const sprayIntervalRef = useRef(null);

  // Edge Case States
  const [showLowBalanceSheet, setShowLowBalanceSheet] = useState(false);
  const [showDiagnosticsMenu, setShowDiagnosticsMenu] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  // Denomination selected
  const activeDenom = DENOMINATIONS.find(d => d.id === selectedDenomId) || DENOMINATIONS[0];

  // User rank in event
  const myRankObj = activeEvent?.topSprayers?.find(s => s.name === 'Kelvin Ekuhoho');
  const currentRank = myRankObj ? myRankObj.rank : 4;
  const sortedSprayers = activeEvent?.topSprayers || [];
  const nextRankSprayer = sortedSprayers.find(s => s.rank === currentRank - 1);
  const gapToNextRank = nextRankSprayer ? Math.max(0, nextRankSprayer.amount - sprayedAmount) : 0;

  const progressPercent = Math.min(100, Math.round((sprayedAmount / (sprayPotTarget || 20000)) * 100));

  // Check if spray pot reached 100%
  useEffect(() => {
    if (sprayedAmount >= sprayPotTarget && sprayPotTarget > 0) {
      const timer = setTimeout(() => {
        playVanitiSound('fanfare');
        setSprayerStep('receipt');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [sprayedAmount, sprayPotTarget, setSprayerStep, playVanitiSound]);

  // Canvas Flying Cash Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateDimensions = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Bill texture cache for all denominations
    const imageCache = {};
    Object.entries(NOTE_TEXTURES).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      imageCache[key] = img;
    });

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw flying notes
      notesRef.current = notesRef.current.filter(note => {
        note.age += dt;
        note.x += note.vx * dt;
        note.y += note.vy * dt;
        note.vy += note.gravity * dt; // gravity
        note.vx *= 0.98; // air drag
        note.rotationX += note.rotSpeedX * dt;
        note.rotationZ += note.rotSpeedZ * dt;

        // Fade out as it flies away
        if (note.age > note.lifetime - 0.4) {
          note.opacity = Math.max(0, (note.lifetime - note.age) / 0.4);
        }

        ctx.save();
        ctx.translate(note.x, note.y);
        ctx.scale(note.scale * Math.cos(note.rotationX), note.scale);
        ctx.rotate(note.rotationZ);
        ctx.globalAlpha = note.opacity;

        const currentBillImg = imageCache[note.denomId];

        // Draw authentic banknote graphic if loaded
        if (currentBillImg && currentBillImg.complete) {
          ctx.shadowColor = note.color;
          ctx.shadowBlur = 8;
          ctx.drawImage(currentBillImg, -note.w / 2, -note.h / 2, note.w, note.h);
        } else {
          // Dynamic colored note with styling fallback
          ctx.fillStyle = note.color;
          ctx.shadowColor = note.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(-note.w / 2, -note.h / 2, note.w, note.h, 6);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note.label, 0, 0);
        }

        ctx.restore();

        return note.age < note.lifetime;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeDenom]);

  // Spawn note in physics canvas
  const spawnFlyingNote = (vx = 0, vy = -450) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = canvas.width / 2 + (Math.random() * 40 - 20);
    const startY = canvas.height - 180;

    const note = {
      x: startX,
      y: startY,
      vx: vx + (Math.random() * 120 - 60),
      vy: vy - Math.random() * 150,
      gravity: 180,
      rotationX: Math.random() * Math.PI,
      rotationZ: (Math.random() - 0.5) * 0.4,
      rotSpeedX: (Math.random() - 0.5) * 6,
      rotSpeedZ: (Math.random() - 0.5) * 2,
      w: activeDenom.isBundle ? 95 : 76,
      h: activeDenom.isBundle ? 165 : 148,
      scale: 1,
      color: activeDenom.color,
      label: activeDenom.label,
      denomId: activeDenom.id,
      opacity: 1,
      age: 0,
      lifetime: 2.2 + Math.random() * 0.6
    };

    notesRef.current.push(note);
  };

  // Launch a note (gesture or tap)
  const handleLaunch = (intensity = 1, customVx = 0, customVy = -500) => {
    if (activeEvent?.isPaused || isHostOffline) return;

    setLastActionTime(Date.now());

    const res = sprayNote();
    if (res === 'insufficient_balance') {
      setShowLowBalanceSheet(true);
      return;
    }

    // Show instant settlement confirmation
    setSyncStatus(`Settling ${activeDenom.label} with stage... Confirmed ✓`);
    setTimeout(() => setSyncStatus(null), 1600);

    spawnFlyingNote(customVx, customVy * intensity);
  };

  // Pointer / Touch Gestures for flicking upwards
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0,
      time: performance.now()
    };
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Only allow upward dragging
    if (deltaY < 0) {
      setDragOffset({ x: deltaX * 0.5, y: deltaY });
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || dragStartRef.current.y;
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    const deltaX = clientX - dragStartRef.current.x;
    const timeDiff = Math.max(1, performance.now() - dragStartRef.current.time);
    const velocityY = deltaY / timeDiff; // pixels per ms

    setDragOffset({ x: 0, y: 0 });

    // Upward flick or simple tap
    if (deltaY < -25 || velocityY < -0.4) {
      // Powerful upward flick
      const flickSpeed = Math.min(1.8, Math.max(0.9, Math.abs(velocityY) * 1.5));
      handleLaunch(flickSpeed, deltaX * 2, -550 * flickSpeed);
    } else if (Math.abs(deltaY) < 15 && Math.abs(deltaX) < 15) {
      // Tap to spray
      handleLaunch(1, 0, -480);
    }
  };

  // Spray Gun continuous hold
  const startSprayGun = () => {
    setIsContinuousSpraying(true);
    handleLaunch(1.1);
    sprayIntervalRef.current = setInterval(() => {
      handleLaunch(1.1 + Math.random() * 0.3);
    }, 180);
  };

  const stopSprayGun = () => {
    setIsContinuousSpraying(false);
    if (sprayIntervalRef.current) {
      clearInterval(sprayIntervalRef.current);
      sprayIntervalRef.current = null;
    }
  };

  // Add floating reaction
  const sendReaction = (emoji) => {
    playVanitiSound('flick');
    const id = Date.now() + Math.random();
    setFloatingReactions(prev => [...prev, { id, emoji, x: 20 + Math.random() * 60 }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#0a0d12',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Background Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Floating Emojis Layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}>
        {floatingReactions.map(r => (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              bottom: '220px',
              left: `${r.x}%`,
              fontSize: '32px',
              animation: 'float-up 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Top Header Bar (matches user image 1) */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '16px 20px 8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setSprayerStep('config')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Spraying on Host Capsule (Modern Luxury Design) */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-glass)',
            borderRadius: '30px',
            padding: '5px 16px 5px 6px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={activeEvent?.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Host"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--neon-green)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
              }}
            />
            <span 
              style={{ 
                position: 'absolute', 
                bottom: '0', 
                right: '0', 
                width: '9px', 
                height: '9px', 
                borderRadius: '50%', 
                background: '#10b981', 
                border: '1.5px solid #000' 
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.2px' }}>
              Spraying on <span style={{ color: 'var(--neon-green)' }}>{activeEvent?.hostName?.split(' ')[0] || 'Celebrant'}</span>
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {activeEvent?.title?.split('•')[0] || 'Live Reception'}
            </span>
          </div>
        </div>

        {/* Right Action Icons: Edge Case Simulator & Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Edge Case Diagnostics Simulator Button */}
          <button
            onClick={() => setShowDiagnosticsMenu(!showDiagnosticsMenu)}
            title="Test Edge Cases: Host Offline, Insufficient Balance, Network Lag"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: showDiagnosticsMenu ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: showDiagnosticsMenu ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showDiagnosticsMenu ? '#f59e0b' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <SlidersHorizontal size={17} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: soundEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: soundEnabled ? '1px solid var(--neon-green)' : '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: soundEnabled ? 'var(--neon-green)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </div>

      {/* Sync Status / Settlement Pill */}
      {syncStatus && (
        <div style={{ textAlign: 'center', zIndex: 12, marginTop: '4px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '20px',
              padding: '3px 12px',
              fontSize: '11px',
              color: '#34d399',
              fontWeight: 700,
              animation: 'pop-up 0.2s ease-out'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
            {syncStatus}
          </div>
        </div>
      )}

      {/* Dynamic Stage Rank & Milestone HUD (Modern Glassmorphic Design) */}
      <div style={{ marginTop: '12px', zIndex: 10, padding: '0 16px', width: '100%', maxWidth: '420px', margin: '12px auto 0 auto' }}>
        <div 
          className="glass"
          style={{
            borderRadius: '20px',
            padding: '12px 18px',
            background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.82) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Top Row: Rank Chip & Milestone Gap Tracker */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  background: currentRank <= 3 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' 
                    : 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.45)'
                }}
              >
                {currentRank === 1 ? <Crown size={13} /> : <Trophy size={13} />}
                <span>RANK #{currentRank}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {currentRank <= 3 ? 'Top Podium VIP' : 'VIP Sprayer'}
              </span>
            </div>

            {/* Gap to next rank or Champion crown */}
            {nextRankSprayer ? (
              <div 
                onClick={() => setShowLeaderboard(true)}
                title="Tap to open Stage Leaderboard"
                className="glass-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                }}
              >
                <Flame size={12} color="#f59e0b" />
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }} className="tabular-nums">
                  ₦{gapToNextRank.toLocaleString()} to #{currentRank - 1}
                </span>
                <ChevronRight size={12} color="#fbbf24" />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '11px', fontWeight: 800 }}>
                <Crown size={13} />
                <span>#1 CHAMPION</span>
              </div>
            )}
          </div>

          {/* Amount Counters & Glowing Shimmer Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Sprayed: <strong style={{ color: 'var(--text-primary)', fontSize: '15px' }} className="tabular-nums">₦{sprayedAmount.toLocaleString()}</strong>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="tabular-nums">
                Target: ₦{sprayPotTarget.toLocaleString()} ({progressPercent}%)
              </span>
            </div>

            {/* High-Precision Shimmering Progress Bar */}
            <div 
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              <div 
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 70%, #6ee7b7 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 0 14px rgba(16, 185, 129, 0.8)',
                  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Host Paused Edge Case Notification */}
      {activeEvent?.isPaused && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #f59e0b',
            borderRadius: '20px',
            padding: '20px 24px',
            textAlign: 'center',
            zIndex: 30,
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            width: '85%',
            maxWidth: '320px'
          }}
        >
          <PauseCircle size={36} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
          <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>Host Paused Sprays</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Speeches / ceremonies in progress. Spraying will unfreeze automatically when resumed!
          </p>
        </div>
      )}

      {/* Interactive 3D Note Stack (Reference Screenshot Match) */}
      <div 
        style={{
          marginTop: 'auto',
          marginBottom: '85px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 15,
        }}
      >
        {/* Glowing Stage Ambient Pedestal under the Stack */}
        <div 
          style={{
            position: 'absolute',
            bottom: '25px',
            width: '260px',
            height: '60px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${activeDenom.color}45 0%, ${activeDenom.color}15 45%, transparent 75%)`,
            filter: 'blur(12px)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'pedestal-ambient 3s ease-in-out infinite'
          }}
        />

        {/* Swipe instruction tooltip */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.75)',
            marginBottom: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-glass)',
            padding: '4px 14px',
            borderRadius: '20px',
            animation: 'bounce-up 1.8s infinite ease-in-out',
            zIndex: 2,
          }}
        >
          <ChevronUp size={16} color="var(--neon-green)" />
          <span style={{ fontWeight: 600 }}>Flick or swipe up to throw notes</span>
        </div>

        {/* 3D Banknote Stack Target */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'relative',
            width: '185px',
            height: '255px',
            cursor: 'grab',
            touchAction: 'none',
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 3,
          }}
        >
          {/* Note Stack Graphic */}
          <img
            src={NOTE_TEXTURES[activeDenom.id] || naira200Img}
            alt="Banknote Stack"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: `drop-shadow(0 20px 30px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px ${activeDenom.color}45)`,
            }}
          />

          {/* Touch feedback ripple */}
          {isDragging && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.18)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>

        {/* Fast Action Spray Gun Button */}
        <button
          onMouseDown={startSprayGun}
          onMouseUp={stopSprayGun}
          onTouchStart={startSprayGun}
          onTouchEnd={stopSprayGun}
          style={{
            marginTop: '14px',
            background: isContinuousSpraying 
              ? 'linear-gradient(135deg, #ff007f 0%, #bd00ff 100%)' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            border: isContinuousSpraying 
              ? '1px solid #ff007f' 
              : '1px solid var(--border-glass)',
            color: '#fff',
            borderRadius: '24px',
            padding: '7px 18px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isContinuousSpraying ? '0 0 25px rgba(255, 0, 127, 0.7)' : '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.15s ease',
            zIndex: 4,
          }}
        >
          <Zap size={15} color={isContinuousSpraying ? '#fff' : '#f59e0b'} />
          <span>{isContinuousSpraying ? 'Spraying Rapid Fire! 💸' : 'Hold for Spray Gun'}</span>
        </button>
      </div>

      {/* Bottom Lightweight Controls Bar */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '12px 16px 22px 16px',
          background: 'linear-gradient(180deg, rgba(10, 13, 18, 0) 0%, rgba(10, 13, 18, 0.95) 30%, #0a0d12 100%)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Denomination quick-switcher pill */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '4px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '4px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-glass)',
            overflowX: 'auto' 
          }}
        >
          {DENOMINATIONS.map(d => {
            const isSelected = selectedDenomId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  playVanitiSound('flick');
                  setSelectedDenomId(d.id);
                }}
                style={{
                  background: isSelected ? d.color : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '5px 9px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isSelected ? `0 2px 10px ${d.color}60` : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? '#fff' : d.color }} />
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Reaction Buttons */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {['🍾', '🔥', '👑', '💸'].map(emoji => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="glass-hover"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-glass)',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Leaderboard drawer button with rank chip */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          title="Open Stage Leaderboard"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '16px',
            background: showLeaderboard 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
              : 'rgba(255, 255, 255, 0.08)',
            color: showLeaderboard ? '#000' : '#fff',
            border: showLeaderboard ? '1px solid #fbbf24' : '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: showLeaderboard ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <Trophy size={16} color={showLeaderboard ? '#000' : '#fbbf24'} />
          <span style={{ fontSize: '11px', fontWeight: 800 }}>#{currentRank}</span>
        </button>
      </div>

      {/* Modern Stage Leaderboard Slide-over Modal */}
      {showLeaderboard && (
        <div 
          className="glass"
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '12px',
            right: '12px',
            maxHeight: '460px',
            borderRadius: '24px',
            padding: '18px',
            zIndex: 35,
            border: '1px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(180deg, rgba(22, 27, 36, 0.96) 0%, rgba(12, 15, 20, 0.98) 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'pop-up 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                }}
              >
                <Trophy size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                  Stage Leaderboard
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Chioma & David's Wedding • Live Sync
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowLeaderboard(false)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.08)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Top 3 VIP Showcase Row */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr 1fr',
              gap: '8px',
              marginBottom: '14px',
              padding: '12px 8px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Rank 2 (Silver) */}
            {sortedSprayers[1] && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img src={sortedSprayers[1].avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-2px', background: '#cbd5e1', color: '#000', fontSize: '9px', fontWeight: 900, borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                </div>
                <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, marginTop: '4px', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sortedSprayers[1].name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }} className="tabular-nums">
                  ₦{(sortedSprayers[1].amount / 1000).toFixed(1)}k
                </span>
              </div>
            )}

            {/* Rank 1 (Gold Champion) */}
            {sortedSprayers[0] && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-6px)' }}>
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>👑</div>
                <div style={{ position: 'relative' }}>
                  <img src={sortedSprayers[0].avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2.5px solid #fbbf24', boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)' }} />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-2px', background: '#fbbf24', color: '#000', fontSize: '10px', fontWeight: 900, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                </div>
                <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 800, marginTop: '4px', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sortedSprayers[0].name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff' }} className="tabular-nums">
                  ₦{(sortedSprayers[0].amount / 1000).toFixed(1)}k
                </span>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {sortedSprayers[2] && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img src={sortedSprayers[2].avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #d97706' }} />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-2px', background: '#d97706', color: '#000', fontSize: '9px', fontWeight: 900, borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                </div>
                <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, marginTop: '4px', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sortedSprayers[2].name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }} className="tabular-nums">
                  ₦{(sortedSprayers[2].amount / 1000).toFixed(1)}k
                </span>
              </div>
            )}
          </div>

          {/* Full Sprayers Ranks Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {sortedSprayers.map((sp, idx) => {
              const isMe = sp.name === 'Kelvin Ekuhoho';
              const rankNum = sp.rank || idx + 1;
              return (
                <div 
                  key={sp.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: isMe 
                      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.08) 100%)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isMe ? '1px solid var(--neon-green)' : '1px solid rgba(255, 255, 255, 0.04)',
                    boxShadow: isMe ? '0 0 15px rgba(16, 185, 129, 0.25)' : 'none',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span 
                      style={{ 
                        fontWeight: 900, 
                        width: '24px',
                        color: rankNum === 1 ? '#fbbf24' : rankNum === 2 ? '#cbd5e1' : rankNum === 3 ? '#d97706' : 'var(--text-muted)' 
                      }}
                    >
                      #{rankNum}
                    </span>
                    <img src={sp.avatar} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: isMe ? 'var(--neon-green)' : '#fff', fontWeight: isMe ? 800 : 600 }}>
                        {sp.name} {isMe && '(You)'}
                      </span>
                      {isMe && gapToNextRank > 0 && (
                        <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 700 }}>
                          🔥 Only ₦{gapToNextRank.toLocaleString()} to overtake Rank #{currentRank - 1}!
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }} className="tabular-nums">
                    ₦{sp.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Host Offline Recovery Modal */}
      {isHostOffline && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(9, 11, 14, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '28px' }}>
            📡
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Host Stage Disconnected
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: '1.5', marginBottom: '20px' }}>
            The celebrant's broadcast beacon was closed or disconnected. All <strong>₦{sprayedAmount.toLocaleString()}</strong> sprayed so far has been safely confirmed and settled!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
            <button
              onClick={() => {
                setIsHostOffline(false);
                setSprayerStep('receipt');
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 800,
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View Final Spray Receipt
            </button>
            <button
              onClick={() => {
                setIsHostOffline(false);
                setSprayerStep('discovery');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontWeight: 600,
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Find Another Live Event
            </button>
          </div>
        </div>
      )}

      {/* Inline Low Balance Recovery Sheet */}
      {showLowBalanceSheet && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(18, 22, 30, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(239, 68, 68, 0.4)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px 20px',
            zIndex: 50,
            boxShadow: '0 -10px 40px rgba(0,0,0,0.7)',
            animation: 'pop-up 0.25s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={16} color="#f87171" />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Low Vault Balance</h4>
            </div>
            <button onClick={() => setShowLowBalanceSheet(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Your remaining vault balance is <strong>₦{walletBalance.toLocaleString()}</strong>. Top up instantly to continue throwing notes without leaving the stage:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            {[20000, 50000, 100000].map(amt => (
              <button
                key={amt}
                onClick={() => {
                  topUpWallet(amt);
                  setShowLowBalanceSheet(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
                  border: '1px solid var(--neon-green)',
                  color: 'var(--neon-green)',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                +₦{(amt / 1000)}k
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowLowBalanceSheet(false)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* First-Time Stage Coachmark */}
      {!hasSeenStageCoachmark && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 55,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px',
            textAlign: 'center',
            animation: 'fade-in 0.3s ease-out'
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '12px', animation: 'bounce-up 1.5s infinite' }}>
            👆
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
            How to Spray Notes
          </h3>
          <div style={{ textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '22px' }}>
            <p>• <strong>Flick Upward:</strong> Swipe or flick up on the note stack to throw cash onto the live stage.</p>
            <p>• <strong>Spray Gun:</strong> Press & hold the stack for rapid-fire continuous spraying.</p>
            <p>• <strong>Switch Notes:</strong> Tap ₦100, ₦200, ₦500, ₦1k or $100 anytime below.</p>
          </div>
          <button
            onClick={() => {
              playVanitiSound('flick');
              setHasSeenStageCoachmark(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '16px',
              padding: '14px 28px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
            }}
          >
            Ready! Let's Spray 💸
          </button>
        </div>
      )}

      {/* Edge Case Simulator Diagnostics Menu */}
      {showDiagnosticsMenu && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: '70px',
            right: '20px',
            width: '260px',
            borderRadius: '18px',
            padding: '16px',
            zIndex: 45,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
            animation: 'pop-up 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
              Edge Case Diagnostics
            </span>
            <button onClick={() => setShowDiagnosticsMenu(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => {
                setIsHostOffline(true);
                setShowDiagnosticsMenu(false);
              }}
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '8px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
            >
              ⚠️ Test: Host Disconnects
            </button>
            <button
              onClick={() => {
                setShowLowBalanceSheet(true);
                setShowDiagnosticsMenu(false);
              }}
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '8px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
            >
              💳 Test: Insufficient Balance
            </button>
            <button
              onClick={() => {
                setSyncStatus('High network latency... Retrying settlement with stage...');
                setTimeout(() => setSyncStatus('Settled with host projector ✓'), 2000);
                setTimeout(() => setSyncStatus(null), 3800);
                setShowDiagnosticsMenu(false);
              }}
              style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '8px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
            >
              📶 Test: Pending Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
