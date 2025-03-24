import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 192,
  height: 192,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Base Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'black',
          borderRadius: '24%',
        }} />
        
        {/* Accent Color Circle */}
        <div style={{ 
          position: 'absolute', 
          width: '70%', 
          height: '70%', 
          borderRadius: '50%', 
          background: '#ffdd00', 
          zIndex: 1,
          top: '15%', 
          left: '15%',
        }} />
        
        {/* Main Icon - Brain & Sync */}
        <svg
          width="65%"
          height="65%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            zIndex: 2, 
            position: 'relative',
          }}
        >
          {/* Brain Shape */}
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V5a2 2 0 0 1 2 2v1a2 2 0 0 1 2 2v1a2 2 0 0 1 2 2" />
          <path d="M12 4.5A2.5 2.5 0 0 1 14.5 2A2.5 2.5 0 0 1 17 4.5C17 5.89 17 7.33 17 8.5C17 11.5 20 11.5 20 12" />
          <path d="M12 4.5C12 7 12 10 12 12c0 1.38 2 1.5 2 3" />
          <path d="M4 12c0-.5 3-1 3-3.5C7 7.33 7 5.89 7 4.5A2.5 2.5 0 0 1 9.5 2" />
          <path d="M4 12c0 .5 3 1 3 3.5" />
          <path d="M20 12c0 .5-3 1-3 3.5" />
          <path d="M7 16c0 2.5 3 2.5 3 5" />
          <path d="M17 16c0 2.5-3 2.5-3 5" />
          <path d="M12 12c0 3 0 4 0 5" />
          <path d="M12 22c-1 0-2-.5-2-2" />
          <path d="M12 22c1 0 2-.5 2-2" />
        </svg>
        
        {/* Bottom Accent Bar */}
        <div style={{ 
          position: 'absolute', 
          bottom: '0%', 
          left: '0%', 
          width: '100%', 
          height: '15%', 
          background: 'white',
          clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0% 100%)',
          zIndex: 3,
        }} />
      </div>
    ),
    {
      ...size,
    }
  );
} 