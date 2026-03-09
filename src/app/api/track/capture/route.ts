import { NextRequest, NextResponse } from 'next/server';
import { addLocationCapture, LocationCapture } from '@/lib/storage';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { linkId, lat, lng, accuracy } = body;

        if (!linkId || lat === undefined || lng === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get basic user info from headers
        const userAgent = req.headers.get('user-agent') || 'Unknown User Agent';
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';

        const capture: LocationCapture = {
            linkId,
            lat,
            lng,
            accuracy: accuracy || 0,
            timestamp: new Date().toISOString(),
            userAgent,
            ip,
        };

        addLocationCapture(capture);

        return NextResponse.json({ success: true, capture });
    } catch (error) {
        console.error('Error capturing location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
