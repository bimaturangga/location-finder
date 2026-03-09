'use client';

import { useState } from 'react';
import PhoneLookup from '@/components/PhoneLookup';
import TrackingManager from '@/components/TrackingManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'tracking'>('lookup');

  return (
    <main className="container animate-fade-in" style={{ position: 'relative' }}>
      {/* Decorative ambient background glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 60%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(40px)'
      }} />

      <header style={{ marginBottom: '60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px', background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '20px', color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <span style={{ flexShrink: 0, marginRight: '8px', width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--accent-cyan)' }}></span>
            System Online
          </div>
        </div>
        <h1 className="heading" style={{ fontSize: '4rem', marginBottom: '16px', textShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          Location Finder
        </h1>
        <p className="subheading" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: '#a3adc2' }}>
          Platform intelijen untuk menganalisis identitas nomor telepon dan melacak kordinat lokasi secara presisi melalui tautan terkontrol.
        </p>
      </header>

      <div className="tabs stagger-1">
        <button
          className={`tab-btn ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => setActiveTab('lookup')}
        >
          <span style={{ marginRight: '8px' }}>⚡</span> Phone Lookup
        </button>
        <button
          className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <span style={{ marginRight: '8px' }}>📡</span> Tracking System
        </button>
      </div>

      <div style={{ minHeight: '500px', position: 'relative', zIndex: 2 }} className="stagger-2">
        {activeTab === 'lookup' ? (
          <div className="animate-fade-in"><PhoneLookup /></div>
        ) : (
          <div className="animate-fade-in"><TrackingManager /></div>
        )}
      </div>
    </main>
  );
}
