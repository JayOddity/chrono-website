import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chronotector — Chrono Odyssey News, Database, Map';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background:
            'linear-gradient(135deg, #1a1a22 0%, #22222c 50%, #2a2a38 100%)',
          color: '#ffffff',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c8a84e 0%, #8b7333 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
              fontWeight: 700,
              color: '#1a1a22',
            }}
          >
            CT
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#c8a84e',
              letterSpacing: '0.02em',
            }}
          >
            Chronotector
          </div>
        </div>
        <div
          style={{
            fontSize: '40px',
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: '16px',
            maxWidth: '900px',
          }}
        >
          Chrono Odyssey News, Database, and Interactive Map
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#e8e8e8',
            opacity: 0.85,
            marginTop: '24px',
          }}
        >
          chronotector.com
        </div>
      </div>
    ),
    { ...size },
  );
}
