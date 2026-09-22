import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon asset issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { useVaniti } from './vaniti/VanitiContext';

export default function Map({ friends, user, selectedEntity, onSelectFriend }) {
  const { theme } = useVaniti();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const pathLinesRef = useRef({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Centered in London by default
    const map = L.map(mapContainerRef.current, {
      center: [51.5074, -0.1278],
      zoom: 13,
      zoomControl: false, // Custom position handled later or just standard
      attributionControl: false
    });

    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // Tile layer initialized based on current theme
    const tileLayer = L.tileLayer(theme === 'light' ? lightTileUrl : darkTileUrl, {
      maxZoom: 19
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Dynamically update tile layer when theme toggles
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(theme === 'light' ? lightTileUrl : darkTileUrl);
  }, [theme]);

  // Update/Render User Marker
  useEffect(() => {
    if (!mapRef.current || !user) return;

    const map = mapRef.current;
    const userId = 'user-self';

    // Battery class determination
    let batColorClass = 'high';
    if (user.battery < 20) batColorClass = 'low';
    else if (user.battery < 50) batColorClass = 'medium';

    // Status ring color
    let ringClass = 'active';
    if (user.ghostMode !== 'none') ringClass = 'ghost';

    const userHtml = `
      <div class="custom-pin">
        <div class="pin-pulse ${ringClass}"></div>
        <div class="pin-avatar-wrapper ${ringClass}">
          <img class="pin-avatar" src="${user.avatar}" alt="Me" />
          <div class="pin-badge">👑</div>
          <div class="pin-battery ${batColorClass}">${user.battery}%</div>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: userHtml,
      className: 'user-pin-icon',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    if (markersRef.current[userId]) {
      markersRef.current[userId].setLatLng([user.lat, user.lng]);
      markersRef.current[userId].setIcon(customIcon);
    } else {
      const marker = L.marker([user.lat, user.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onSelectFriend({ id: 'user', ...user });
        });
      markersRef.current[userId] = marker;
    }
  }, [user]);

  // Update/Render Friends
  useEffect(() => {
    if (!mapRef.current || !friends) return;

    const map = mapRef.current;
    const currentFriendIds = new Set(friends.map(f => f.id));

    // Clear old markers that are no longer in friends list
    Object.keys(markersRef.current).forEach(id => {
      if (id !== 'user-self' && !currentFriendIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    friends.forEach(friend => {
      // Battery style
      let batColorClass = 'high';
      if (friend.battery < 20) batColorClass = 'low';
      else if (friend.battery < 50) batColorClass = 'medium';

      // Status style
      let ringClass = 'active';
      if (friend.status === 'ghost') ringClass = 'ghost';
      else if (friend.status === 'sleeping') ringClass = 'sleeping';

      // Status badge
      let badgeEmoji = friend.emoji || '📍';

      const friendHtml = `
        <div class="custom-pin">
          <div class="pin-pulse ${ringClass}"></div>
          <div class="pin-avatar-wrapper ${ringClass}">
            <img class="pin-avatar" src="${friend.avatar}" alt="${friend.name}" />
            <div class="pin-badge">${badgeEmoji}</div>
            <div class="pin-battery ${batColorClass}">${friend.battery}%</div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: friendHtml,
        className: 'friend-pin-icon',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      });

      if (markersRef.current[friend.id]) {
        // Smooth transition helper can be done here, or let Leaflet handle instant coords update
        markersRef.current[friend.id].setLatLng([friend.lat, friend.lng]);
        markersRef.current[friend.id].setIcon(customIcon);
      } else {
        const marker = L.marker([friend.lat, friend.lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            onSelectFriend(friend);
          });
        markersRef.current[friend.id] = marker;
      }

      // Draw footprint trails if they have coordinates history
      if (friend.history && friend.history.length > 0) {
        const pathCoords = [[friend.lat, friend.lng], ...friend.history];
        if (pathLinesRef.current[friend.id]) {
          pathLinesRef.current[friend.id].setLatLngs(pathCoords);
        } else {
          const polyline = L.polyline(pathCoords, {
            color: friend.status === 'ghost' ? '#bd00ff' : '#39ff14',
            weight: 3,
            opacity: 0.4,
            dashArray: '5, 10'
          }).addTo(map);
          pathLinesRef.current[friend.id] = polyline;
        }
      }
    });
  }, [friends, onSelectFriend]);

  // Map panning control based on selectedEntity
  useEffect(() => {
    if (!mapRef.current || !selectedEntity) return;

    const map = mapRef.current;
    const { lat, lng } = selectedEntity;

    map.flyTo([lat, lng], 15, {
      animate: true,
      duration: 1.2
    });
  }, [selectedEntity]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {/* Visual Overlay elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 500,
        pointerEvents: 'none'
      }}>
        <div className="glass" style={{
          padding: '10px 18px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          color: '#39ff14',
          textShadow: '0 0 10px rgba(57,255,20,0.5)',
          fontSize: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          🗺️ zengly
        </div>
      </div>
    </div>
  );
}
