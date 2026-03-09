'use client';

import { useState, useEffect } from 'react';

// OpenStreetMap Nominatim API endpoint
// We use a custom hook to fetch the reverse geocode info efficiently
export function useReverseGeocode(lat: number, lng: number) {
    const [address, setAddress] = useState<string>('Memuat lokasi detail...');

    useEffect(() => {
        let isMounted = true;

        async function fetchAddress() {
            try {
                // We use fetch with generic caching, but note Nominatim rate limits (max 1 req/sec)
                // Format=jsonv2 gives good detail
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
                    headers: {
                        'Accept-Language': 'id' // Request Indonesian language if possible
                    }
                });

                if (!res.ok) throw new Error('Geocoding failed');

                const data = await res.json();

                if (isMounted && data && data.address) {
                    // Extract specific admin levels (Kecamatan & Kota/Kabupaten)
                    const kecamatan = data.address.village || data.address.suburb || data.address.neighbourhood || data.address.town || data.address.municipality || '';
                    const kota = data.address.city || data.address.county || data.address.state_district || '';
                    const provinsi = data.address.state || '';

                    let readable = '';
                    if (kecamatan) readable += `${kecamatan}, `;
                    if (kota) readable += `${kota}, `;
                    if (provinsi) readable += provinsi;

                    if (!readable) readable = data.display_name || 'Alamat tidak diketahui';

                    setAddress(readable);
                }
            } catch (err) {
                if (isMounted) setAddress('Gagal memuat detail lokasi');
            }
        }

        fetchAddress();

        return () => {
            isMounted = false;
        };
    }, [lat, lng]);

    return address;
}
