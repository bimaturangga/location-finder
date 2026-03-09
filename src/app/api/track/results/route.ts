import { NextResponse } from 'next/server';
import { getTrackingData } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = getTrackingData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
