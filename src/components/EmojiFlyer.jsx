import React from 'react';

export default function EmojiFlyer({ emojis, onAnimationEnd }) {
  return (
    <div className="emoji-flyer-layer">
      {emojis.map((item) => (
        <div
          key={item.id}
          className="flying-emoji"
          style={{
            left: `${item.x}%`,
            bottom: '0px',
            animationDuration: `${item.duration}s`,
            fontSize: `${item.size}px`,
          }}
          onAnimationEnd={() => onAnimationEnd(item.id)}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
}
