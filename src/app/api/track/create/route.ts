import { NextRequest, NextResponse } from 'next/server';
import { addTrackingLink, TrackingLink } from '@/lib/storage';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { label, template } = body;

        if (!label || !template) {
            return NextResponse.json({ error: 'Label and template are required' }, { status: 400 });
        }

        const newLink: TrackingLink = {
            id: nanoid(10), // 10 chars is enough for unique short url
            label,
            template,
            createdAt: new Date().toISOString(),
        };

        addTrackingLink(newLink);

        // Return the absolute link URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.get('host')}`;
        const linkUrl = `${baseUrl}/t/${newLink.id}`;

        return NextResponse.json({ success: true, link: newLink, url: linkUrl });
    } catch (error) {
        console.error('Error creating track link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
