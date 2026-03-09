'use client';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationCapture } from '@/lib/storage';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';

interface MapViewProps {
    captures: LocationCapture[];
}

// Fix for default Leaflet icon not loading in Next.js
// We use a custom DivIcon or a simpler setup
const createCustomIcon = () => {
    return new L.DivIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
      background-color: var(--error-color);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
};

// Sub-component to prevent all markers re-rendering when one fetches address
function MarkerPopup({ capture }: { capture: LocationCapture }) {
    const address = useReverseGeocode(capture.lat, capture.lng);

    return (
        <Popup>
            <div style={{ color: '#333' }}>
                <strong style={{ fontSize: '14px', marginBottom: '4px', display: 'block' }}>Lokasi Terdeteksi</strong>

                <div style={{ padding: '8px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '8px', border: '1px solid #cce5ff' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0056b3' }}>📍 {address}</p>
                </div>

                <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                    <p><strong>Waktu:</strong> {new Date(capture.timestamp).toLocaleString('id-ID')}</p>
                    <p><strong>Akurasi:</strong> ~{Math.round(capture.accuracy)} meter</p>
                    <p><strong>IP:</strong> {capture.ip}</p>
                    <p style={{ marginTop: '4px', wordBreak: 'break-all', fontSize: '10px', color: '#666' }}>
                        User Agent:<br />{capture.userAgent}
                    </p>
                </div>

                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${capture.lat},${capture.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        backgroundColor: '#1E90FF',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginTop: '8px'
                    }}
                >
                    🗺️ Buka di Google Maps
                </a>
            </div>
        </Popup>
    );
}

export default function MapView({ captures }: MapViewProps) {
    // Center of Indonesia by default
    const defaultCenter: [number, number] = [-2.5489, 118.0149];
    const defaultZoom = captures.length > 0 ? 12 : 5;

    const center: [number, number] = captures.length > 0
        ? [captures[0].lat, captures[0].lng]
        : defaultCenter;

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <MapContainer
                center={center}
                zoom={defaultZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {captures.map((capture, index) => (
                    <Marker
                        key={`${capture.linkId}-${index}`}
                        position={[capture.lat, capture.lng]}
                        icon={createCustomIcon()}
                    >
                        <MarkerPopup capture={capture} />
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
