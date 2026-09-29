import React, { useState, useEffect, useRef } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import EmojiFlyer from './components/EmojiFlyer';
import { Sparkles, Sun, Moon, ArrowRight, Smartphone, MapPin } from 'lucide-react';
import { VanitiProvider, useVaniti } from './components/vaniti/VanitiContext';
import VanitiLauncher from './components/vaniti/VanitiLauncher';
import VanitiModal from './components/vaniti/VanitiModal';
import VanitiBrandApp from './components/vaniti/VanitiBrandApp';

const INITIAL_FRIENDS = [
  {
    id: '1',
    name: 'Sarah Connor',
    lat: 51.5094,
    lng: -0.1178,
    battery: 88,
    isCharging: false,
    status: 'online',
    emoji: '☕',
    speed: 'Chilling',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
    history: [[51.5094, -0.1178], [51.5084, -0.1158]]
  },
  {
    id: '2',
    name: 'Alex Mercer',
    lat: 51.4984,
    lng: -0.1378,
    battery: 15,
    isCharging: true,
    status: 'online',
    emoji: '🏎️',
    speed: 'Driving • 48 km/h',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
    history: [[51.4984, -0.1378], [51.4994, -0.1398]]
  },
  {
    id: '3',
    name: 'Chloe Price',
    lat: 51.5204,
    lng: -0.1228,
    battery: 54,
    isCharging: false,
    status: 'sleeping',
    emoji: '😴',
    speed: 'Resting',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chloe',
    history: [[51.5204, -0.1228]]
  },
  {
    id: '4',
    name: 'Jack Ryan',
    lat: 51.5154,
    lng: -0.1428,
    battery: 79,
    isCharging: false,
    status: 'ghost',
    emoji: '🎒',
    speed: 'Walking • 5 km/h',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jack',
    history: [[51.5154, -0.1428]]
  }
];

const MOCK_NAMES = ['Miles Morales', 'Peter Parker', 'Gwen Stacy', 'Tony Stark', 'Bruce Banner', 'Natasha Romanoff', 'Steve Rogers', 'Wanda Maximoff'];
const MOCK_EMOJIS = ['🍔', '🎬', '📚', '🍕', '🚲', '🍿', '🎧', '🎮', '🛹', '👾'];
function MainApp() {
  const [user, setUser] = useState({
    name: 'Me',
    lat: 51.5074,
    lng: -0.1278,
    battery: 95,
    isCharging: false,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity',
    ghostMode: 'none' // none, blurred, frozen
  });

  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const { theme, toggleTheme } = useVaniti();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [flyingEmojis, setFlyingEmojis] = useState([]);
  const [isSpeedToggled, setIsSpeedToggled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Shake / Bump states
  const [isShaking, setIsShaking] = useState(false);
  const [bumpState, setBumpState] = useState({ active: false, friend: null });

  // Vaniti Brand Mobile View Mode (default 'vaniti' for brand mobile experience)
  const [activeAppMode, setActiveAppMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'map') return 'map';
    return 'vaniti';
  });

  // Web Audio Context for Synth Sounds
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playSynthSound = (type) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === 'ping') {
        // High pitch pop/synth chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'bump') {
        // Lower power bump synth sliding down and up
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
        
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'click') {
        // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      console.warn('Synth sound error:', e);
    }
  };

  // Simulated live movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Move Friends
      setFriends(prevFriends => 
        prevFriends.map(friend => {
          // Sleeping friends don't move
          if (friend.status === 'sleeping') return friend;

          // Delta size based on speed toggling
          const delta = isSpeedToggled ? 0.0018 : 0.0002;
          const latJitter = (Math.random() - 0.5) * delta;
          const lngJitter = (Math.random() - 0.5) * delta;

          // Battery discharge simulation
          let nextBat = friend.battery;
          let nextCharging = friend.isCharging;
          if (Math.random() > 0.95) {
            if (friend.isCharging) {
              nextBat = Math.min(100, friend.battery + 1);
              if (nextBat === 100) nextCharging = false;
            } else {
              nextBat = Math.max(5, friend.battery - 1);
              if (nextBat < 15 && Math.random() > 0.7) nextCharging = true;
            }
          }

          // Calculate current mock speed
          let speedStr = friend.speed;
          if (isSpeedToggled) {
            speedStr = `Driving • ${Math.floor(60 + Math.random() * 40)} km/h`;
          } else if (friend.status === 'online') {
            speedStr = `Walking • ${Math.floor(3 + Math.random() * 4)} km/h`;
          }

          const newLat = friend.lat + latJitter;
          const newLng = friend.lng + lngJitter;

          // Keep trails history limited to 15 nodes
          const newHistory = [[friend.lat, friend.lng], ...friend.history].slice(0, 15);

          return {
            ...friend,
            lat: newLat,
            lng: newLng,
            battery: nextBat,
            isCharging: nextCharging,
            speed: speedStr,
            history: newHistory
          };
        })
      );

      // 2. Move User Location slightly unless frozen
      setUser(prevUser => {
        if (prevUser.ghostMode === 'frozen') return prevUser;

        const delta = 0.00015;
        const latJitter = (Math.random() - 0.5) * delta;
        const lngJitter = (Math.random() - 0.5) * delta;

        // Jitter size is amplified if blurred
        const mult = prevUser.ghostMode === 'blurred' ? 4 : 1;

        return {
          ...prevUser,
          lat: prevUser.lat + (latJitter * mult),
          lng: prevUser.lng + (lngJitter * mult)
        };
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [isSpeedToggled]);

  // Actions
  const handleEmojiPing = (friend, emojiChar) => {
    playSynthSound('ping');

    // Pan map to friend on reaction
    setSelectedEntity(friend);

    // Spawn 10 flying emojis on screen
    const newEmojis = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      char: emojiChar,
      x: 10 + Math.random() * 80, // Random width span
      size: 20 + Math.random() * 30, // Random sizes
      duration: 1.5 + Math.random() * 1.5 // Speed
    }));

    setFlyingEmojis(prev => [...prev, ...newEmojis]);
  };

  const handleCleanEmoji = (id) => {
    setFlyingEmojis(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateGhostMode = (mode) => {
    playSynthSound('click');
    setUser(prev => ({ ...prev, ghostMode: mode }));
  };

  const handleAddFriend = () => {
    playSynthSound('click');
    const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
    const randomEmoji = MOCK_EMOJIS[Math.floor(Math.random() * MOCK_EMOJIS.length)];
    const randomSeed = randomName.split(' ')[0];
    const newId = `${Date.now()}`;
    
    // Spread coordinates slightly offset from user
    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;

    const newFriend = {
      id: newId,
      name: randomName,
      lat: user.lat + offsetLat,
      lng: user.lng + offsetLng,
      battery: Math.floor(25 + Math.random() * 75),
      isCharging: Math.random() > 0.85,
      status: Math.random() > 0.8 ? 'sleeping' : 'online',
      emoji: randomEmoji,
      speed: 'Chilling',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`,
      history: []
    };

    setFriends(prev => [...prev, newFriend]);
    setSelectedEntity(newFriend);
  };

  const handleSimulateBump = () => {
    if (friends.length === 0) return;

    // Play bump audio synth sequence
    playSynthSound('bump');

    // Find the closest friend to the user
    let closestFriend = friends[0];
    let minDist = Infinity;

    friends.forEach(f => {
      const dist = Math.sqrt(Math.pow(f.lat - user.lat, 2) + Math.pow(f.lng - user.lng, 2));
      if (dist < minDist) {
        minDist = dist;
        closestFriend = f;
      }
    });

    // Animate user and closest friend meeting in center
    const midLat = (user.lat + closestFriend.lat) / 2;
    const midLng = (user.lng + closestFriend.lng) / 2;

    // Pan camera to the bump point
    setSelectedEntity({ lat: midLat, lng: midLng });

    // Instantly teleport close together
    setUser(prev => ({ ...prev, lat: midLat - 0.0001, lng: midLng - 0.0001 }));
    setFriends(prev => prev.map(f => {
      if (f.id === closestFriend.id) {
        return { ...f, lat: midLat + 0.0001, lng: midLng + 0.0001, status: 'online' };
      }
      return f;
    }));

    // Trigger overlay, shake effect
    setTimeout(() => {
      setIsShaking(true);
      setBumpState({ active: true, friend: closestFriend });
      
      // Cleanup bump effect after 2.5s
      setTimeout(() => {
        setIsShaking(false);
        setBumpState({ active: false, friend: null });
      }, 2500);

    }, 600); // Small delay to let the map fly there
  };

  if (activeAppMode === 'vaniti') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#161616',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Desktop-only quick toggle to Map */}
        <div 
          className="desktop-only-switch"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => {
              playSynthSound('click');
              setActiveAppMode('map');
            }}
            title="Switch to Zengly Radar Map"
            style={{
              background: 'rgba(35, 35, 37, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '8px 16px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              transition: 'all 0.2s',
            }}
          >
            <MapPin size={15} color="#c27803" />
            <span>Switch to Map</span>
          </button>
        </div>

        <VanitiBrandApp onBackToMap={() => setActiveAppMode('map')} />
      </div>
    );
  }

  return (
    <div 
      className={`app-container ${isShaking ? 'shake-screen' : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: 'var(--bg-dark)',
        overflow: 'hidden'
      }}
    >
      {/* Floating Switch to Vaniti Mobile Experience */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}>
        <button
          onClick={() => {
            playSynthSound('click');
            setActiveAppMode('vaniti');
          }}
          style={{
            background: '#c27803',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 18px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(194, 120, 3, 0.5)',
            transition: 'all 0.2s',
          }}
        >
          <Smartphone size={16} />
          <span>Open Vaniti Mobile</span>
        </button>
      </div>
      {/* Floating Brand & Quick Theme Bar (Top Left) */}
      <div 
        className="glass"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 900,
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
            }}
          >
            V
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', fontFamily: 'var(--font-display)' }}>
            Vaniti
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', background: 'var(--border-glass)' }} />

        <button
          id="map-quick-theme-toggle"
          onClick={() => {
            playSynthSound('click');
            toggleTheme();
          }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            background: theme === 'light' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '5px 10px',
            color: theme === 'light' ? '#d97706' : 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      {/* Interactive Map */}
      <Map 
        friends={friends} 
        user={user} 
        selectedEntity={selectedEntity} 
        onSelectFriend={(entity) => {
          playSynthSound('click');
          setSelectedEntity(entity);
        }}
      />

      {/* Control Panel Menu */}
      <ControlPanel 
        user={user}
        onUpdateGhostMode={handleUpdateGhostMode}
        onSimulateBump={handleSimulateBump}
        onAddFriend={handleAddFriend}
        onToggleSpeed={() => {
          playSynthSound('click');
          setIsSpeedToggled(!isSpeedToggled);
        }}
        isSpeedToggled={isSpeedToggled}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Slide-out Sidebar Panel */}
      <Sidebar 
        friends={friends}
        userLocation={[user.lat, user.lng]}
        onSelectFriend={(friend) => {
          playSynthSound('click');
          setSelectedEntity(friend);
        }}
        onEmojiPing={handleEmojiPing}
      />

      {/* Floating Emoji Particle Layer */}
      <EmojiFlyer emojis={flyingEmojis} onAnimationEnd={handleCleanEmoji} />

      {/* Bump Screen Overlay */}
      <div className={`bump-overlay ${bumpState.active ? 'active' : ''}`}>
        {bumpState.friend && (
          <div className="bump-content">
            <div className="bump-avatar-pair">
              <img src={user.avatar} className="bump-avatar-left" alt="Me" />
              <div className="bump-spark">⚡</div>
              <img src={bumpState.friend.avatar} className="bump-avatar-right" alt={bumpState.friend.name} />
            </div>
            <h1 style={{ fontSize: '36px', color: '#fff', textShadow: '0 0 10px rgba(57,255,20,0.5)', fontFamily: 'var(--font-display)' }}>
              BUMPED!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginTop: '8px' }}>
              You and {bumpState.friend.name} bumped phones!
            </p>
          </div>
        )}
      </div>

      {/* Vaniti Floating Launcher on Map */}
      <VanitiLauncher />

      {/* Vaniti Full End-to-End Experience Modal */}
      <VanitiModal />
    </div>
  );
}

export default function App() {
  return (
    <VanitiProvider>
      <MainApp />
    </VanitiProvider>
  );
}
