export default function manifest() {
    return {
        name: 'Astro Booking - Vinnay Raj',
        short_name: 'Astro Booking',
        description: 'Book expert astrology consultations with Vinnay Raj. Kundali matching, vastu shastra, and personalized horoscope readings.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#d4af37',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
    }
}
