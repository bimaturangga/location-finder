'use client';

import { useState } from 'react';
import { parsePhoneNumber } from 'libphonenumber-js/max';

interface LookupResult {
    country: string | undefined;
    nationalNumber: string;
    internationalNumber: string;
    isValid: boolean;
    type: string | undefined;
    originalInput: string;
}

export default function PhoneLookup() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [result, setResult] = useState<LookupResult | null>(null);
    const [error, setError] = useState('');

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!phoneNumber) {
            setError('Masukkan nomor HP terlebih dahulu.');
            return;
        }

        try {
            // Automatically assume it's Indonesian if no country code provided but starts with 0
            let inputToParse = phoneNumber;
            if (inputToParse.startsWith('0')) {
                inputToParse = '+62' + inputToParse.substring(1);
            } else if (!inputToParse.startsWith('+')) {
                inputToParse = '+' + inputToParse;
            }

            const phoneNumberObj = parsePhoneNumber(inputToParse);

            setResult({
                country: phoneNumberObj.country,
                nationalNumber: phoneNumberObj.formatNational(),
                internationalNumber: phoneNumberObj.formatInternational(),
                isValid: phoneNumberObj.isValid(),
                type: phoneNumberObj.getType(),
                originalInput: phoneNumber
            });
        } catch {
            setError('Nomor tidak valid atau format salah. Coba gunakan awalan +62 atau 08...');
        }
    };

    return (
        <div className="glass-card animate-fade-in">
            <h2 className="heading" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pencarian Identitas</h2>
            <p className="subheading" style={{ marginBottom: '32px' }}>Ketahui detail informasi wilayah dan operator dari nomor HP target.</p>

            <form onSubmit={handleLookup} style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }}>📞</span>
                        <input
                            type="text"
                            className="input-field"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Contoh: 081234567890 atau +628..."
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ flexShrink: 0, minWidth: '160px' }}>
                        Analisis Data
                    </button>
                </div>
                {error && (
                    <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-fade-in">
                        <span style={{ color: 'var(--error-color)' }}>⚠️</span>
                        <p style={{ color: 'var(--error-color)', fontSize: '14px', margin: 0 }}>{error}</p>
                    </div>
                )}
            </form>

            {result && (
                <div style={{
                    background: 'rgba(13, 17, 23, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                }} className="animate-fade-in">
                    <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>📊</span> Hasil Analisis Intelijen
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div className="list-item">
                            <div>
                                <span className="label">Status Koneksi</span>
                                {result.isValid ? (
                                    <span className="badge badge-success">Terverifikasi</span>
                                ) : (
                                    <span className="badge badge-error">Invalid / Tidak Dikenali</span>
                                )}
                            </div>
                        </div>

                        <div className="list-item">
                            <div>
                                <span className="label">Input Mentah</span>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#e6edf3' }}>{result.originalInput}</p>
                            </div>
                        </div>

                        <div className="list-item" style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}>
                            <div>
                                <span className="label" style={{ color: 'var(--accent-cyan)' }}>Format Global (E.164)</span>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent-cyan)', textShadow: '0 0 10px rgba(0,240,255,0.3)' }}>
                                    {result.internationalNumber}
                                </p>
                            </div>
                        </div>

                        <div className="list-item">
                            <div>
                                <span className="label">Format Lokal</span>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#e6edf3' }}>{result.nationalNumber}</p>
                            </div>
                        </div>

                        <div className="list-item">
                            <div>
                                <span className="label">Kode Region / Negara</span>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#e6edf3' }}>{result.country || 'Unknown'}</p>
                            </div>
                        </div>

                        <div className="list-item">
                            <div>
                                <span className="label">Tipe Jaringan</span>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#e6edf3' }}>
                                    {result.type === 'MOBILE' ? '📱 Seluler (Mobile)' :
                                        result.type === 'FIXED_LINE' ? '☎️ Telepon Rumah (Fixed Line)' :
                                            result.type || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '32px',
                        padding: '16px 20px',
                        background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent)',
                        borderLeft: '4px solid var(--accent-cyan)',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--accent-cyan)' }}>Catatan OSINT:</strong> Modul analisis ini mengurai struktur jaringan komunikasi untuk mengidentifikasi region dan jenis line provider target. Modul ini <strong>tidak</strong> melacak koordinat satelit GPS secara realtime. Untuk ekstraksi lokasi presisi tinggi, rujuk ke modul <strong>Tracking System</strong>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
