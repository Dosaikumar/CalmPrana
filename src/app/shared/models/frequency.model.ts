export interface FrequencyModel {
    id: string;
    name: string;
    category: 'Brainwave' | 'Relaxation';
    baseFrequency: number;
    offsetHz?: number; // Used for binaural beats (Theta, Alpha, etc.)
    description: string;
}

export const FREQUENCY_DATA: FrequencyModel[] = [
    // Brainwave Support Tones (Binaural Beats)
    // Left ear = baseFrequency, Right ear = baseFrequency + offsetHz
    { id: 'delta', name: 'Delta Wave', category: 'Brainwave', baseFrequency: 200, offsetHz: 2.5, description: '1–4 Hz: Deep sleep support' },
    { id: 'theta', name: 'Theta Wave', category: 'Brainwave', baseFrequency: 200, offsetHz: 6, description: '4–8 Hz: Meditation support' },
    { id: 'alpha', name: 'Alpha Wave', category: 'Brainwave', baseFrequency: 200, offsetHz: 10, description: '8–12 Hz: Relaxed focus' },
    { id: 'beta', name: 'Beta Wave', category: 'Brainwave', baseFrequency: 200, offsetHz: 16, description: '14–20 Hz: Alert focus' },

    // Relaxation Tones (Isochronic/Pure tones)
    { id: '432', name: '432 Hz', category: 'Relaxation', baseFrequency: 432, description: 'Relaxation music base' },
    { id: '528', name: '528 Hz', category: 'Relaxation', baseFrequency: 528, description: 'Calming tone' },
    { id: '136', name: '136.1 Hz', category: 'Relaxation', baseFrequency: 136.1, description: 'Om frequency tone' },
    { id: '40', name: '40 Hz', category: 'Relaxation', baseFrequency: 40, description: 'Focus support tone' }
];
