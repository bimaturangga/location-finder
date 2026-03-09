'use client';

import dynamic from 'next/dynamic';
import { LocationCapture } from '@/lib/storage';

const MapView = dynamic<{ captures: LocationCapture[] }>(() => import('./MapView'), {
    ssr: false,
    loading: () => (
        <div style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px solid var(--card-border)'
        }}>
            <p style={{ color: 'var(--text-secondary)' }}>Memuat Peta...</p>
        </div>
    ),
});

export default MapView;
