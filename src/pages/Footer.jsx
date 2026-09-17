// eslint-disable-next-line no-unused-vars
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: '11rem', padding: '1rem', backgroundColor: '#F2FAFA', textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', color: '#252525' }}>
        <a 
          href="https://www.google.com/maps/place/Saudi+Arabia" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#252525', textDecoration: 'none' }}
          onMouseEnter={(e) => e.target.style.color = '#354EAB'}
          onMouseLeave={(e) => e.target.style.color = '#252525'}
        >
          Saudi Arabia
        </a>
      </p>
      <p style={{ fontSize: '0.9rem', color: '#252525' }}>
        <a 
          href="https://x.com/DAMO_SA1" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#252525', textDecoration: 'none' }}
          onMouseEnter={(e) => e.target.style.color = '#354EAB'}
          onMouseLeave={(e) => e.target.style.color = '#252525'}
        >
          DAMO_SA1
        </a>
      </p>

      <p style={{ fontSize: '0.9rem', color: '#252525' }}>
        <a 
          href="tel:+966581066973" 
          style={{ color: '#252525', textDecoration: 'none' }}
          onMouseEnter={(e) => e.target.style.color = '#354EAB'}
          onMouseLeave={(e) => e.target.style.color = '#252525'}
        >
          +966581066973
        </a>
      </p>

      <p style={{ fontSize: '0.9rem', color: '#252525' }}>
        <a 
          href="mailto:projectdamo1@gmail.com" 
          style={{ color: '#252525', textDecoration: 'none' }}
          onMouseEnter={(e) => e.target.style.color = '#354EAB'}
          onMouseLeave={(e) => e.target.style.color = '#252525'}
        >
          projectdamo1@gmail.com
        </a>
      </p>

      <p style={{ fontSize: '0.9rem', color: '#9D9D9D', marginTop: '1rem' }}>
        All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
