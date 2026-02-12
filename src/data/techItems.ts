export interface TechItem {
    id: number;
    name: string;
    image: string;
    category: 'Hardware' | 'Dev Tools' | 'Software & Aplikasi' | 'Konsep & Internet' | 'Sistem Operasi' | 'Tools' | 'Programming Language' | 'Brand' | 'CIFOR';
}

export const techItems: TechItem[] = [
    // ===== HARDWARE (10 Items) =====
    { id: 1, name: 'Laptop', image: '/images/1.png', category: 'Hardware' },
    { id: 2, name: 'Monitor', image: '/images/2.png', category: 'Hardware' },
    { id: 3, name: 'Keyboard', image: '/images/3.png', category: 'Hardware' },
    { id: 4, name: 'Mouse', image: '/images/4.png', category: 'Hardware' },
    { id: 5, name: 'Webcam', image: '/images/5.png', category: 'Hardware' },
    { id: 6, name: 'Headset', image: '/images/6.png', category: 'Hardware' },
    { id: 7, name: 'Processor', image: '/images/7.png', category: 'Hardware' },
    { id: 8, name: 'RAM', image: '/images/8.png', category: 'Hardware' },
    { id: 9, name: 'SSD', image: '/images/9.png', category: 'Hardware' },
    { id: 10, name: 'Power Bank', image: '/images/10.png', category: 'Hardware' },

    // ===== BRAND, OS & PLATFORM (25 Items) =====
    { id: 11, name: 'Windows', image: '/images/11.png', category: 'Brand' },
    { id: 12, name: 'MacOS', image: '/images/12.png', category: 'Brand' },
    { id: 13, name: 'Android', image: '/images/13.png', category: 'Brand' },
    { id: 14, name: 'Linux', image: '/images/14.png', category: 'Brand' },
    { id: 15, name: 'Google', image: '/images/15.png', category: 'Brand' },
    { id: 16, name: 'YouTube', image: '/images/16.png', category: 'Brand' },
    { id: 17, name: 'Google Drive', image: '/images/17.png', category: 'Brand' },
    { id: 18, name: 'OneDrive', image: '/images/18.png', category: 'Brand' },
    { id: 19, name: 'Microsoft', image: '/images/19.png', category: 'Brand' },
    { id: 20, name: 'Apple', image: '/images/20.png', category: 'Brand' },
    { id: 21, name: 'Facebook', image: '/images/21.png', category: 'Brand' },
    { id: 22, name: 'Amazon', image: '/images/22.png', category: 'Brand' },
    { id: 23, name: 'Samsung', image: '/images/23.png', category: 'Brand' },
    { id: 24, name: 'Intel', image: '/images/24.png', category: 'Brand' },
    { id: 25, name: 'NVIDIA', image: '/images/25.png', category: 'Brand' },
    { id: 26, name: 'AMD', image: '/images/26.png', category: 'Brand' },
    { id: 27, name: 'Netflix', image: '/images/27.png', category: 'Brand' },
    { id: 28, name: 'Spotify', image: '/images/28.png', category: 'Brand' },
    { id: 29, name: 'Zoom', image: '/images/29.png', category: 'Brand' },
    { id: 30, name: 'WhatsApp', image: '/images/30.png', category: 'Brand' },
    { id: 31, name: 'Tokopedia', image: '/images/31.png', category: 'Brand' },
    { id: 32, name: 'Gojek', image: '/images/32.png', category: 'Brand' },
    { id: 33, name: 'Traveloka', image: '/images/33.png', category: 'Brand' },
    { id: 34, name: 'DANA', image: '/images/34.png', category: 'Brand' },
    { id: 35, name: 'Jenius', image: '/images/35.png', category: 'Brand' },

    // ===== TOOLS & PROGRAMMING (35 Items) =====
    { id: 36, name: 'Docker', image: '/images/36.png', category: 'Dev Tools' },
    { id: 37, name: 'Laravel', image: '/images/37.png', category: 'Dev Tools' },
    { id: 38, name: 'Nuxt.js', image: '/images/38.png', category: 'Dev Tools' },
    { id: 39, name: '.NET Core', image: '/images/39.png', category: 'Dev Tools' },
    { id: 40, name: 'PostgreSQL', image: '/images/40.png', category: 'Dev Tools' },
    { id: 41, name: 'VS Code', image: '/images/41.png', category: 'Dev Tools' },
    { id: 42, name: 'Git', image: '/images/42.png', category: 'Dev Tools' },
    { id: 43, name: 'Postman', image: '/images/43.png', category: 'Dev Tools' },
    { id: 44, name: 'DBeaver', image: '/images/44.png', category: 'Dev Tools' },
    { id: 45, name: 'Tailwind CSS', image: '/images/45.png', category: 'Dev Tools' },
    { id: 46, name: 'Flutter', image: '/images/46.png', category: 'Dev Tools' },
    { id: 47, name: 'Node.js', image: '/images/47.png', category: 'Dev Tools' },
    { id: 48, name: 'Figma', image: '/images/48.png', category: 'Dev Tools' },
    { id: 49, name: 'GitHub', image: '/images/49.png', category: 'Dev Tools' },
    { id: 50, name: 'Nginx', image: '/images/50.png', category: 'Dev Tools' },
    { id: 51, name: 'Redis', image: '/images/51.png', category: 'Dev Tools' },
    { id: 52, name: 'SQL Server', image: '/images/52.png', category: 'Dev Tools' },
    { id: 53, name: 'JSON', image: '/images/53.png', category: 'Dev Tools' },
    { id: 54, name: 'TypeScript', image: '/images/54.png', category: 'Dev Tools' },
    { id: 55, name: 'Entity Framework', image: '/images/55.png', category: 'Dev Tools' },
    { id: 56, name: 'NPM', image: '/images/56.png', category: 'Dev Tools' },
    { id: 57, name: 'Composer', image: '/images/57.png', category: 'Dev Tools' },
    { id: 58, name: 'Firebase', image: '/images/58.png', category: 'Dev Tools' },
    { id: 59, name: 'Terminal', image: '/images/59.png', category: 'Dev Tools' },
    { id: 60, name: 'API REST', image: '/images/60.png', category: 'Dev Tools' },
    { id: 61, name: 'PostgREST', image: '/images/61.png', category: 'Dev Tools' },
    { id: 62, name: 'DrawDB', image: '/images/62.png', category: 'Dev Tools' },
    { id: 63, name: 'ChatGPT', image: '/images/63.png', category: 'Dev Tools' },
    { id: 64, name: 'Cursor AI', image: '/images/64.png', category: 'Dev Tools' },
    { id: 65, name: 'Azure', image: '/images/65.png', category: 'Dev Tools' },
    { id: 66, name: 'Vercel', image: '/images/66.png', category: 'Dev Tools' },
    { id: 67, name: 'Markdown', image: '/images/67.png', category: 'Dev Tools' },
    { id: 68, name: 'PHP Artisan', image: '/images/68.png', category: 'Dev Tools' },
    { id: 69, name: 'Unit Testing', image: '/images/69.png', category: 'Dev Tools' },
    { id: 70, name: 'Kubernetes', image: '/images/70.png', category: 'Dev Tools' },

    // ===== CIFOR-ICRAF & FORESTRY IS =====
    { id: 71, name: 'CIFOR-ICRAF', image: '/images/71.png', category: 'CIFOR' },
];

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
