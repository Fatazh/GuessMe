export interface TechItem {
    id: number;
    name: string;
    image: string; // path ke gambar di /public/images/
    category: 'Hardware' | 'Software & Aplikasi' | 'Konsep & Internet';
    tabooWords: string[]; // kata yang TIDAK boleh diucapkan oleh pemberi clue
}

export const techItems: TechItem[] = [
    // ===== HARDWARE (20 items) =====
    { id: 1, name: 'Laptop', image: '/images/1.png', category: 'Hardware', tabooWords: ['komputer', 'layar', 'keyboard'] },
    { id: 2, name: 'Smartphone', image: '/images/2.png', category: 'Hardware', tabooWords: ['telepon', 'HP', 'layar sentuh'] },
    { id: 3, name: 'Monitor', image: '/images/3.png', category: 'Hardware', tabooWords: ['layar', 'TV', 'display'] },
    { id: 4, name: 'Keyboard', image: '/images/4.png', category: 'Hardware', tabooWords: ['ketik', 'tombol', 'huruf'] },
    { id: 5, name: 'Mouse', image: '/images/5.png', category: 'Hardware', tabooWords: ['klik', 'kursor', 'tikus'] },
    { id: 6, name: 'Printer', image: '/images/6.png', category: 'Hardware', tabooWords: ['cetak', 'kertas', 'tinta'] },
    { id: 7, name: 'Headphone', image: '/images/7.png', category: 'Hardware', tabooWords: ['dengar', 'musik', 'telinga'] },
    { id: 8, name: 'Speaker', image: '/images/8.png', category: 'Hardware', tabooWords: ['suara', 'musik', 'keras'] },
    { id: 9, name: 'Webcam', image: '/images/9.png', category: 'Hardware', tabooWords: ['kamera', 'video call', 'wajah'] },
    { id: 10, name: 'Flashdisk', image: '/images/10.png', category: 'Hardware', tabooWords: ['simpan', 'USB', 'data'] },
    { id: 11, name: 'Hard Disk', image: '/images/11.png', category: 'Hardware', tabooWords: ['simpan', 'data', 'memori'] },
    { id: 12, name: 'Charger', image: '/images/12.png', category: 'Hardware', tabooWords: ['cas', 'listrik', 'baterai'] },
    { id: 13, name: 'Power Bank', image: '/images/13.png', category: 'Hardware', tabooWords: ['cas', 'baterai', 'daya'] },
    { id: 14, name: 'Smartwatch', image: '/images/14.png', category: 'Hardware', tabooWords: ['jam', 'tangan', 'pintar'] },
    { id: 15, name: 'Tablet', image: '/images/15.png', category: 'Hardware', tabooWords: ['iPad', 'layar sentuh', 'besar'] },
    { id: 16, name: 'Router', image: '/images/16.png', category: 'Hardware', tabooWords: ['internet', 'WiFi', 'sinyal'] },
    { id: 17, name: 'Proyektor', image: '/images/17.png', category: 'Hardware', tabooWords: ['tampil', 'layar', 'presentasi'] },
    { id: 18, name: 'Kabel USB', image: '/images/18.png', category: 'Hardware', tabooWords: ['colok', 'sambung', 'cas'] },
    { id: 19, name: 'SSD', image: '/images/19.png', category: 'Hardware', tabooWords: ['simpan', 'cepat', 'hard disk'] },
    { id: 20, name: 'GPU', image: '/images/20.png', category: 'Hardware', tabooWords: ['grafis', 'game', 'kartu'] },

    // ===== SOFTWARE & APLIKASI (15 items) =====
    { id: 21, name: 'WhatsApp', image: '/images/21.png', category: 'Software & Aplikasi', tabooWords: ['chat', 'pesan', 'hijau'] },
    { id: 22, name: 'Instagram', image: '/images/22.png', category: 'Software & Aplikasi', tabooWords: ['foto', 'story', 'filter'] },
    { id: 23, name: 'YouTube', image: '/images/23.png', category: 'Software & Aplikasi', tabooWords: ['video', 'nonton', 'subscribe'] },
    { id: 24, name: 'Google', image: '/images/24.png', category: 'Software & Aplikasi', tabooWords: ['cari', 'search', 'browser'] },
    { id: 25, name: 'Microsoft Word', image: '/images/25.png', category: 'Software & Aplikasi', tabooWords: ['ketik', 'dokumen', 'tulis'] },
    { id: 26, name: 'Microsoft Excel', image: '/images/26.png', category: 'Software & Aplikasi', tabooWords: ['tabel', 'angka', 'hitung'] },
    { id: 27, name: 'PowerPoint', image: '/images/27.png', category: 'Software & Aplikasi', tabooWords: ['presentasi', 'slide', 'tampil'] },
    { id: 28, name: 'Zoom', image: '/images/28.png', category: 'Software & Aplikasi', tabooWords: ['meeting', 'video call', 'rapat'] },
    { id: 29, name: 'TikTok', image: '/images/29.png', category: 'Software & Aplikasi', tabooWords: ['video pendek', 'dance', 'FYP'] },
    { id: 30, name: 'Spotify', image: '/images/30.png', category: 'Software & Aplikasi', tabooWords: ['musik', 'lagu', 'streaming'] },
    { id: 31, name: 'Google Maps', image: '/images/31.png', category: 'Software & Aplikasi', tabooWords: ['peta', 'navigasi', 'arah'] },
    { id: 32, name: 'Netflix', image: '/images/32.png', category: 'Software & Aplikasi', tabooWords: ['film', 'nonton', 'streaming'] },
    { id: 33, name: 'Tokopedia', image: '/images/33.png', category: 'Software & Aplikasi', tabooWords: ['belanja', 'online', 'toko'] },
    { id: 34, name: 'Canva', image: '/images/34.png', category: 'Software & Aplikasi', tabooWords: ['desain', 'gambar', 'template'] },
    { id: 35, name: 'ChatGPT', image: '/images/35.png', category: 'Software & Aplikasi', tabooWords: ['AI', 'chat', 'robot'] },

    // ===== KONSEP & INTERNET (10 items) =====
    { id: 36, name: 'WiFi', image: '/images/36.png', category: 'Konsep & Internet', tabooWords: ['internet', 'sinyal', 'wireless'] },
    { id: 37, name: 'Bluetooth', image: '/images/37.png', category: 'Konsep & Internet', tabooWords: ['wireless', 'sambung', 'gigi biru'] },
    { id: 38, name: 'Cloud Computing', image: '/images/38.png', category: 'Konsep & Internet', tabooWords: ['awan', 'simpan online', 'server'] },
    { id: 39, name: 'Artificial Intelligence', image: '/images/39.png', category: 'Konsep & Internet', tabooWords: ['robot', 'pintar', 'mesin'] },
    { id: 40, name: 'Virtual Reality', image: '/images/40.png', category: 'Konsep & Internet', tabooWords: ['kacamata', 'dunia maya', '3D'] },
    { id: 41, name: 'QR Code', image: '/images/41.png', category: 'Konsep & Internet', tabooWords: ['scan', 'kode', 'barcode'] },
    { id: 42, name: 'Password', image: '/images/42.png', category: 'Konsep & Internet', tabooWords: ['sandi', 'rahasia', 'kunci'] },
    { id: 43, name: 'Virus Komputer', image: '/images/43.png', category: 'Konsep & Internet', tabooWords: ['sakit', 'bahaya', 'malware'] },
    { id: 44, name: 'Screenshot', image: '/images/44.png', category: 'Konsep & Internet', tabooWords: ['tangkap layar', 'foto', 'gambar'] },
    { id: 45, name: 'Download', image: '/images/45.png', category: 'Konsep & Internet', tabooWords: ['unduh', 'ambil', 'file'] },
];

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
