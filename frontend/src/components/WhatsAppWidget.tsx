import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const PHONE   = '15551234567';          // ← replace with your WhatsApp number (no + or spaces)
const MESSAGE = 'Hello! I have a question about a product.';

const WhatsAppWidget = () => {
  const [hovered, setHovered] = useState(false);

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#25D366',
        color: '#fff',
        borderRadius: 9999,
        padding: hovered ? '12px 20px 12px 16px' : '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 14,
        transition: 'padding 0.25s ease, box-shadow 0.25s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <FaWhatsapp size={26} style={{ flexShrink: 0 }} />
      <span style={{
        maxWidth: hovered ? 140 : 0,
        opacity: hovered ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-width 0.25s ease, opacity 0.2s ease',
      }}>
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppWidget;
