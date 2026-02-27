/**
 * Sri Lanka focused dummy data for TraveLand frontend.
 * Used automatically when the backend is unavailable.
 * To force dummy data always: set VITE_USE_DUMMY_DATA=true in .env
 */

// ── Destinations ──────────────────────────────────────────────────────────────

import ellatour from   '../assets/ella-tour.png';
import sigiriyatour from   '../assets/sigiriya-tour.png';
import waligamatour from   '../assets/waligama-tour.png';
import yalatour from   '../assets/yala-tour.png';

export const dummyDestinations = [
    {
        id: 1,
        name: 'Sigiriya Rock Fortress',
        country: 'Sri Lanka',
        category: 'Heritage',
        description: 'An ancient rock fortress and palace ruin rising 200 meters above the surrounding plains. Built by King Kashyapa in the 5th century, it features stunning frescoes, a mirror wall, and colossal lion paws guarding the final ascent. A UNESCO World Heritage Site often called the "Eighth Wonder of the World".',
        image_url: 'https://plus.unsplash.com/premium_photo-1666254114402-cd16bc302aea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWElMjByb2NrfGVufDB8fDB8fHww',
        avg_rating: 4.9,
        total_reviews: 1240,
        tags: ['UNESCO', 'History', 'Adventure', 'Photography'],
        is_featured: true,
        images: [
            { image_url: 'https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D?w=800&q=80', caption: 'Aerial view of Sigiriya Rock' },
            { image_url: 'https://images.unsplash.com/photo-1580794749460-76f97b7180d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D?w=800&q=80', caption: 'Lush greenery and ancient gardens' },
            { image_url: 'https://images.unsplash.com/photo-1594391045445-64ea3c6ff16b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNpZ2lyaXlhfGVufDB8fDB8fHww?w=800&q=80', caption: 'Lion entrance view' }
        ]
    },
    {
        id: 2,
        name: 'Galle Fort',
        country: 'Sri Lanka',
        category: 'Heritage',
        description: 'A fortified old city founded by Portuguese colonists in the 16th century, later expanded by the Dutch. This UNESCO World Heritage site is the best-preserved colonial sea fortress in Asia, featuring a unique blend of European architecture and South Asian traditions.',
        image_url: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsbGUlMjBmb3J0fGVufDB8fDB8fHww?w=800&q=80',
        avg_rating: 4.7,
        total_reviews: 980,
        tags: ['Colonial', 'Beach', 'Culture', 'Architecture'],
        is_featured: true,
        images: [
            { image_url: 'https://images.unsplash.com/photo-1509982724584-2ce0d4366d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FsbGV8ZW58MHx8MHx8fDA%3D?w=800&q=80', caption: 'Galle Lighthouse' },
            { image_url: 'https://images.unsplash.com/photo-1579989197111-928f586796a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsbGV8ZW58MHx8MHx8fDA%3D?w=800&q=80', caption: 'Colonial buildings in Galle' },
            { image_url: 'https://images.unsplash.com/flagged/photo-1567498975675-a3adf1574cb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FsbGV8ZW58MHx8MHx8fDA%3D', caption: 'Ocean sunset from the ramparts' }
        ]
    },
    {
        id: 3,
        name: 'Ella Village',
        country: 'Sri Lanka',
        category: 'Nature',
        description: 'A high-altitude village surrounded by misty mountains, tea plantations, and cloud forests. Ella is a paradise for hikers and nature lovers, offering some of the most spectacular train journeys and mountain views in the world.',
        image_url: 'https://images.unsplash.com/photo-1550679193-d8ec2f2c3a25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVsbGElMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80',
        avg_rating: 4.8,
        total_reviews: 854,
        tags: ['Tea', 'Hiking', 'Scenic', 'Train Ride'],
        is_featured: true,
        images: [
            { image_url: 'https://images.unsplash.com/photo-1598955890270-d77cdb06d2bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWxsYSUyMHNyaSUyMGxhbmthfGVufDB8fDB8fHww', caption: 'Lush tea plantations' },
            { image_url: 'https://images.unsplash.com/photo-1586008481877-7dd7c8236d00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxsYSUyMHNyaSUyMGxhbmthfGVufDB8fDB8fHww', caption: 'Nine Arches Bridge' },
            { image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPqQfefdlRexyj3L62TvJ-2BJEF7Vqigmkrw&s', caption: 'Little Adam\'s Peak View' }
        ]
    },
    {
        id: 4,
        name: 'Mirissa Beach',
        country: 'Sri Lanka',
        category: 'Beach',
        description: 'A crescent-shaped coastal paradise famous for its golden sands, surf breaks, and ocean wildlife. It is the premier destination in the country for whale watching tours and tropical relaxation.',
        image_url: 'https://images.unsplash.com/photo-1580910527739-556eb89f9d65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWlyaXNzYXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80',
        avg_rating: 4.6,
        total_reviews: 1120,
        tags: ['Beach', 'Surfing', 'Whales', 'Relaxation'],
        is_featured: true,
        images: [
            { image_url: 'https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWlyaXNzYSUyMGJlYWNofGVufDB8fDB8fHww?w=800&q=80', caption: 'Golden Hour at Mirissa' },
            { image_url: 'https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWlyaXNzYSUyMGJlYWNofGVufDB8fDB8fHww?w=800&q=80', caption: 'Surfing in the crystal waters' },
            { image_url: 'https://images.unsplash.com/photo-1533931652033-659afec4885b?w=800&q=80', caption: 'Whale watching adventure' }
        ]
    },
    {
        id: 5,
        name: 'Temple of the Tooth – Kandy',
        country: 'Sri Lanka',
        category: 'Religious',
        description: 'Dalada Maligawa is the ultimate sacred Buddhist site in Sri Lanka, housing the sacred tooth relic of Lord Buddha. Located in the heart of the hill capital Kandy, it represents the spiritual heart of the nation.',
        image_url: 'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FuZHklMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80',
        avg_rating: 4.8,
        total_reviews: 1430,
        tags: ['Buddhist', 'Culture', 'Sacred', 'Kandy'],
        is_featured: true,
        images: [
            { image_url: 'https://images.unsplash.com/photo-1567189305263-127e41c4cdda?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2FuZHklMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80', caption: 'Temple architecture' },
            { image_url: 'https://images.unsplash.com/photo-1665849050430-5e8c16bacf7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGthbmR5JTIwc3JpJTIwbGFua2F8ZW58MHx8MHx8fDA%3D?w=800&q=80', caption: 'Kandy Lake at night' },
            { image_url: 'https://images.unsplash.com/photo-1626091022888-485eb96c494a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2FuZHklMjBzcmklMjBsYW5rYXxlbnwwfHwwfHx8MA%3D%3D?w=800&q=80', caption: 'Evening rituals' }
        ]
    },
    {
        id: 6,
        name: 'Yala National Park',
        country: 'Sri Lanka',
        category: 'Wildlife',
        description: 'The most visited national park in the country, boasting one of the highest leopard densities in the world. It provides a raw wildlife experience with herds of elephants, sloth bears, crocodiles, and vibrant birdlife.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkJGmPqDjGIPfXsyr-v933D2QruMoNXZzSQg&s?w=800&q=80',
        avg_rating: 4.7,
        total_reviews: 765,
        tags: ['Safari', 'Wildlife', 'Leopard', 'Nature'],
        is_featured: true,
        images: [
            { image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMfJ-CwtqAIM9ogyGgh20oFhX2WrO4wAwjGw&s?w=800&q=80', caption: 'Elephant in Yala' },
            { image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAxnFN-DsriCQ45Lc8UPUza7mSHnBo4-sOg&s?w=800&q=80', caption: 'Sri Lankan Leopard' },
            { image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9HbUn81YJUMgugd23Ec6TTrCgDYvBZUhiw&s?w=800&q=80', caption: 'Jeep Safari adventure' }
        ]
    }
];

// ── Packages ──────────────────────────────────────────────────────────────────
export const dummyPackages = [
    {
        id: 1,
        title: 'Sri Lanka Grand Heritage Tour',
        destination_id: 1,
        destination_name: 'Sigiriya Rock Fortress',
        country: 'Sri Lanka',
        description: 'Immerse yourself in the rich history and culture of Sri Lanka. From the ancient rock fortress of Sigiriya to the spiritual Temple of the Tooth in Kandy, this package offers a deep dive into the islands majestic past.',
        image_url: sigiriyatour,
        price_per_person: 1299,
        duration_days: 12,
        max_guests: 15,
        avg_rating: 4.9,
        package_types: ['Cultural', 'Historical', 'High-End'],
        destinations: [
            { destination_name: 'Sigiriya', days_spent: 3 },
            { destination_name: 'Kandy', days_spent: 3 },
            { destination_name: 'Anuradhapura', days_spent: 2 },
            { destination_name: 'Galle', days_spent: 4 }
        ],
        hotels: [
            { hotel_name: 'Heritance Kandalama', city: 'Dambulla', stars: 5 },
            { hotel_name: 'The Kandy House', city: 'Kandy', stars: 5 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80', caption: 'Sigiriya view' },
            { image_url: 'https://images.unsplash.com/photo-1586613579218-04c90bfc3d18?w=800&q=80', caption: 'Kandy Temple' }
        ],
        itinerary: JSON.stringify([
            { title: 'Arrival & Sigiriya', description: 'Arrive in Colombo and transfer to the cultural triangle. Explore the Dambulla Cave Temple.' },
            { title: 'The Lion Rock', description: 'Morning climb to the Sigiriya Rock Fortress. Afternoon relaxing at the resort.' },
            { title: 'Polonnaruwa Exploration', description: 'Bicycle tour through the ancient ruins of Polonnaruwa.' },
            { title: 'Kandy Journey', description: 'Travel to Kandy via the Matale Spice Gardens. Evening Kandyan Dance performance.' },
            { title: 'Sacred City', description: 'Visit the Temple of the Tooth and Peradeniya Botanical Gardens.' }
        ])
    },
    {
        id: 2,
        title: 'Ella Mountain Escape & Tea Trails',
        destination_id: 3,
        destination_name: 'Ella Village',
        country: 'Sri Lanka',
        description: 'Escape to the misty mountains of Ella. Trek through tea plantations, cross the iconic Nine Arches Bridge, and enjoy the worlds most scenic train ride.',
        image_url: ellatour,
        price_per_person: 699,
        duration_days: 5,
        max_guests: 10,
        avg_rating: 4.8,
        package_types: ['Nature', 'Active', 'Budget-Friendly'],
        destinations: [
            { destination_name: 'Ella Village', days_spent: 3 },
            { destination_name: 'Nuwara Eliya', days_spent: 2 }
        ],
        hotels: [
            { hotel_name: '98 Acres Resort', city: 'Ella', stars: 5 },
            { hotel_name: 'Grand Hotel', city: 'Nuwara Eliya', stars: 4 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80', caption: 'Tea trails' },
            { image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', caption: 'The bridge' }
        ],
        itinerary: JSON.stringify([
            { title: 'Scenic Train Arrival', description: 'Arrive in Ella via the iconic blue train. Welcome dinner local style.' },
            { title: 'Peak Trekking', description: 'Climb Little Adams Peak and visit the Nine Arches Bridge.' },
            { title: 'Liptons Seat', description: 'Day trip to Liptons seat for panoramic tea estate views.' }
        ])
    },
    {
        id: 3,
        title: 'Southern Coast & Whale Watching Adventure',
        destination_id: 4,
        destination_name: 'Mirissa Beach',
        country: 'Sri Lanka',
        description: 'Relax on the golden beaches of Mirissa and set sail to witness the majestic migration of Blue Whales in the Indian Ocean.',
        image_url: waligamatour,
        price_per_person: 549,
        duration_days: 4,
        max_guests: 12,
        avg_rating: 4.7,
        package_types: ['Beach', 'Wildlife', 'Adventure'],
        destinations: [
            { destination_name: 'Mirissa', days_spent: 2 },
            { destination_name: 'Weligama', days_spent: 2 }
        ],
        hotels: [
            { hotel_name: 'Pandanus Beach Resort', city: 'Mirissa', stars: 4 },
            { hotel_name: 'Marriott Resort', city: 'Weligama', stars: 5 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', caption: 'Sunset beach' }
        ],
        itinerary: JSON.stringify([
            { title: 'Beachside Welcome', description: 'Check-in and relax at Mirissa beach with a cocktail.' },
            { title: 'Giant Spotting', description: 'Early morning whale watching boat tour.' },
            { title: 'Surfing & Sun', description: 'Optional surfing lessons at Weligama bay.' }
        ])
    },
    {
        id: 4,
        title: 'Wild Leopard & Safari Expedition',
        destination_id: 6,
        destination_name: 'Yala National Park',
        country: 'Sri Lanka',
        description: 'Venture deep into Yala National Park for a once-in-a-lifetime wildlife experience. Spot leopards, elephants and more on multiple custom game drives.',
        image_url: yalatour,
        price_per_person: 899,
        duration_days: 4,
        max_guests: 6,
        avg_rating: 4.9,
        package_types: ['Wildlife', 'Safari', 'Exclusive'],
        destinations: [
            { destination_name: 'Yala', days_spent: 3 },
            { destination_name: 'Bundala', days_spent: 1 }
        ],
        hotels: [
            { hotel_name: 'Jetwing Yala', city: 'Yala', stars: 5 },
            { hotel_name: 'Chenara Camp', city: 'Yala', stars: 4 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1585508890641-ef1dc7f5cb4c?w=800&q=80', caption: 'Jeep Safari' }
        ],
        itinerary: JSON.stringify([
            { title: 'Into the Wild', description: 'Afternoon game drive entering Yala Block 1.' },
            { title: 'Full Day Safari', description: ' sunrise to sunset safari for tracking leopards.' },
            { title: 'Wetland Birding', description: 'Bird watching at Bundala National Park.' }
        ])
    }
];

// ── Hotels ────────────────────────────────────────────────────────────────────
export const dummyHotels = [
    {
        id: 1,
        name: 'Heritance Kandalama',
        city: 'Dambulla',
        country: 'Sri Lanka',
        address: 'Kandalama, Dambulla, Sri Lanka',
        description: 'An architectural marvel by Geoffrey Bawa, seamlessly blending with the surrounding rock and forest.',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        rating: 5.0,
        price_per_night: 320,
        amenities: 'Pool, Spa, Restaurant, Free WiFi, Bar, Gym',
        is_active: true,
    },
    {
        id: 2,
        name: '98 Acres Resort – Ella',
        city: 'Ella',
        country: 'Sri Lanka',
        address: 'Passara Road, Ella, Sri Lanka',
        description: 'Luxury hilltop resort with panoramic views of Ella Gap and lush tea plantations.',
        image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        rating: 4.9,
        price_per_night: 220,
        amenities: 'Pool, Spa, Restaurant, Free WiFi, Yoga, Tea Tours',
        is_active: true,
    }
];

// ── Reviews ───────────────────────────────────────────────────────────────────
export const dummyReviews = [
    { id: 1, user_name: 'Emma Wilson', rating: 5, body: 'Absolutely breathtaking! The views from Sigiriya are unlike anything I\'ve ever seen.', created_at: '2024-11-15', title: 'Life changing experience' },
    { id: 2, user_name: 'James Chen', rating: 5, body: 'Sri Lanka exceeded every expectation. The people, the food, the scenery - all incredible.', created_at: '2024-12-01', title: 'Hidden Gem of Asia' },
    { id: 3, user_name: 'Sophie Martin', rating: 4, body: 'Ella is truly magical. The nine arches bridge at sunrise is something I\'ll never forget.', created_at: '2025-01-10', title: 'Mist and Mountains' },
    { id: 4, user_name: 'Raj Patel', rating: 5, body: 'Yala safari was the highlight of our trip. We spotted 3 leopards in one morning!', created_at: '2025-02-05', title: 'Leopard Spotting Success' },
];
