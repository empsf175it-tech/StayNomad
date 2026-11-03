/* ==========================================================================
   StayNomad — Central Data Store (12 Stays, Categories, Mosaic & Availability)
   ========================================================================== */

(function (window) {
  'use strict';

  const CATEGORIES = [
    {
      slug: 'cabins',
      name: 'Cabins',
      countLabel: '4 Hideaways',
      image: 'assets/images/cat-cabins.webp',
      fallback: 'assets/images/cat-cabins.jpg',
      alt: 'Handcrafted pitched-roof cedar cabin glowing warmly in a golden-hour pine clearing',
      subtitle: 'Timber hearths & alpine hush'
    },
    {
      slug: 'treehouses',
      name: 'Treehouses',
      countLabel: 'Canopy Suites',
      image: 'assets/images/cat-treehouses.webp',
      fallback: 'assets/images/cat-treehouses.jpg',
      alt: 'Elevated cedar treehouse wrapped around an old-growth forest trunk with warm string lights at sunset',
      subtitle: 'Suspended in emerald crowns'
    },
    {
      slug: 'domes',
      name: 'Domes',
      countLabel: 'Stargazer Pods',
      image: 'assets/images/cat-domes.webp',
      fallback: 'assets/images/cat-domes.jpg',
      alt: 'Geodesic glass stargazing dome perched on a ridge glowing amber at dusk',
      subtitle: '360° skies & desert silence'
    },
    {
      slug: 'tiny-homes',
      name: 'Tiny Homes',
      countLabel: 'Micro Architecture',
      image: 'assets/images/cat-tiny-homes.webp',
      fallback: 'assets/images/cat-tiny-homes.jpg',
      alt: 'Architectural charred-cedar tiny home with panoramic skylight in a golden mountain meadow',
      subtitle: 'Off-grid craft, zero excess'
    },
    {
      slug: 'floating',
      name: 'Floating Stays',
      countLabel: 'Water Sanctuaries',
      image: 'assets/images/cat-floating.webp',
      fallback: 'assets/images/cat-floating.jpg',
      alt: 'Boutique floating timber villa moored on calm emerald water at golden sunrise',
      subtitle: 'Drift to sleep on mirror lakes'
    },
    {
      slug: 'desert',
      name: 'Desert Hideaways',
      countLabel: 'Dune Pavilions',
      image: 'assets/images/cat-desert.webp',
      fallback: 'assets/images/cat-desert.jpg',
      alt: 'Luxury sandstone and canvas pavilion tucked among sculpted golden sand dunes at sunset',
      subtitle: 'Lantern-lit horizons & dunes'
    }
  ];

  const DESTINATIONS = [
    {
      id: 'dest-01',
      region: 'Himalayan Foothills',
      waypoint: '31.63° N · 77.34° E',
      staysCount: '3 Stays',
      subtitle: 'Deodar ridges, snow-fed streams & woodsmoke',
      image: 'assets/images/destination-01.webp',
      fallback: 'assets/images/destination-01.jpg',
      alt: 'Layered Himalayan cedar foothills and sunlit snow peaks bathed in warm golden-hour mist'
    },
    {
      id: 'dest-02',
      region: 'Western Ghats & Kerala',
      waypoint: '11.68° N · 76.13° E',
      staysCount: '4 Stays',
      subtitle: 'Cloud forests, tea slopes & tranquil lagoons',
      image: 'assets/images/destination-02.webp',
      fallback: 'assets/images/destination-02.jpg',
      alt: 'Emerald rainforest canopy and misty Western Ghats hills illuminated by golden sunrise'
    },
    {
      id: 'dest-03',
      region: 'Rajasthan & Thar Dunes',
      waypoint: '26.91° N · 70.90° E',
      staysCount: '2 Stays',
      subtitle: 'Sculpted amber sands & Bortle-2 starfields',
      image: 'assets/images/destination-03.webp',
      fallback: 'assets/images/destination-03.jpg',
      alt: 'Sweeping wind-carved Thar desert dunes casting warm golden shadows at sunset'
    },
    {
      id: 'dest-04',
      region: 'Konkan & Goa Coast',
      waypoint: '15.04° N · 73.98° E',
      staysCount: '2 Stays',
      subtitle: 'Laterite headlands, vineyards & quiet coves',
      image: 'assets/images/destination-04.webp',
      fallback: 'assets/images/destination-04.jpg',
      alt: 'Secluded golden cove and red laterite headland along the Konkan coast reflecting amber dusk skies'
    },
    {
      id: 'dest-05',
      region: 'Spiti High Valleys',
      waypoint: '32.24° N · 78.03° E',
      staysCount: '1 Stay',
      subtitle: 'Trans-Himalayan silence at 3,800 metres',
      image: 'assets/images/destination-05.webp',
      fallback: 'assets/images/destination-05.jpg',
      alt: 'High-altitude snow-crowned Spiti Valley mountains glowing in golden alpenglow twilight'
    }
  ];

  const GUEST_STORIES = [
    {
      id: 'story-01',
      quote: 'Waking up to cedar mist curling past a two-storey glass gable with zero notifications—we forgot what day of the week it was by noon.',
      guest: 'Aarav & Meera K.',
      stayTitle: 'Pine Hollow A-Frame',
      date: 'October Retreat',
      image: 'assets/images/review-guest-01.webp',
      fallback: 'assets/images/review-guest-01.jpg',
      alt: 'Speckled stoneware mug of steaming coffee resting on a weathered cedar cabin rail overlooking misty morning pines'
    },
    {
      id: 'story-02',
      quote: 'Every detail felt considered by someone who truly loves the forest—from the split birch by the hearth to the handwritten trail map.',
      guest: 'Rohan Deshmukh',
      stayTitle: 'Moss & Stone Cottage',
      date: 'Monsoon Postscript',
      image: 'assets/images/review-guest-02.webp',
      fallback: 'assets/images/review-guest-02.jpg',
      alt: 'Worn leather hiking boots and herringbone wool blanket beside an open timber cabin doorway facing sunlit moss'
    },
    {
      id: 'story-03',
      quote: 'Watching the Milky Way arch directly over our bed in the Thar silence was more restorative than any five-star resort we have ever visited.',
      guest: 'Nandini S.',
      stayTitle: 'Stargazer Glass Dome',
      date: 'New Moon Weekend',
      image: 'assets/images/review-guest-03.webp',
      fallback: 'assets/images/review-guest-03.jpg',
      alt: 'Open leather travel journal, brass fountain pen and vintage compass on warm linen cabin bedding in golden light'
    },
    {
      id: 'story-04',
      quote: 'Only gentle ripples beneath the teak deck, kingfishers at dawn, and lantern glow on still water. Pure, unhurried magic.',
      guest: 'Vikram & Tara Rao',
      stayTitle: 'Lotus Float House',
      date: 'Anniversary Escape',
      image: 'assets/images/review-guest-04.webp',
      fallback: 'assets/images/review-guest-04.jpg',
      alt: 'Woven cotton hammock strung between tall pines on a wooden deck overlooking a golden-lit lake at sunset'
    }
  ];

  const STAYS = [
    {
      id: 'stay-01',
      slug: 'pine-hollow-a-frame',
      title: 'Pine Hollow A-Frame',
      tagline: 'Soaring cedar geometry suspended above deodar valleys and snow-fed streams.',
      location: 'Jibhi Valley, Himalayan Foothills',
      region: 'Himalayan Foothills',
      coordinates: { lat: 31.634, lng: 77.349 },
      category: 'cabins',
      categoryLabel: 'A-Frame Cabin',
      pricePerNight: 245,
      cleaningFee: 45,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.98,
      reviewCount: 94,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 1.5,
      instantBook: true,
      featured: true,
      createdAt: '2026-09-18',
      scarcitySeed: 2, // 2 nights left this month
      weather: { temp: '11°C', label: 'Crisp Cedar Mist' },
      bestSeason: 'Oct – May',
      elevation: '2,180 m',
      amenities: ['Hot tub', 'Fireplace', 'Wi-Fi', 'Pet-friendly', 'Off-grid'],
      cover: 'assets/images/stay-01-cover.webp',
      coverFallback: 'assets/images/stay-01-cover.jpg',
      coverAlt: 'Glass-and-cedar Pine Hollow A-Frame cabin perched on a terraced Himalayan hillside at golden hour',
      gallery: [
        {
          src: 'assets/images/stay-01-g1.webp',
          fallback: 'assets/images/stay-01-g1.jpg',
          alt: 'Pine Hollow A-Frame living area with wood-burning stove, leather chair and mountain-facing glass gable',
          caption: 'Double-height timber living space warmed by a Norwegian cast-iron stove'
        },
        {
          src: 'assets/images/stay-01-g2.webp',
          fallback: 'assets/images/stay-01-g2.jpg',
          alt: 'Cosy loft bedroom under pitched pine rafters overlooking misty Himalayan cedars',
          caption: 'Stargazing loft suite dressed in heavyweight organic flax linen'
        },
        {
          src: 'assets/images/stay-01-g3.webp',
          fallback: 'assets/images/stay-01-g3.jpg',
          alt: 'Steaming outdoor cedar soaking tub on private wooden deck overlooking mountain valleys at sunset',
          caption: 'Wood-fired red-cedar soaking tub on the cantilevered west deck'
        },
        {
          src: 'assets/images/stay-01-g4.webp',
          fallback: 'assets/images/stay-01-g4.jpg',
          alt: 'Golden-hour Himalayan ridge panorama seen from the wooden cabin balcony rail',
          caption: 'Uninterrupted dusk views across three tiers of Himalayan foothills'
        }
      ],
      description: [
        'Tucked along a private apple-and-deodar spur twenty minutes above Jibhi village, Pine Hollow A-Frame frames the Tirthan watershed through a seven-metre triangular glass wall. Built by local Kath-Kuni joiners using reclaimed Himalayan cedar, the cabin smells faintly of resin, beeswax, and woodsmoke.',
        'Spend slow mornings watching valley fog lift from the wood-fired outdoor tub, hike directly onto unmarked shepherd trails behind the orchard, and return at dusk to light the cast-iron stove as amber alpenglow settles over the Jalori ridge.'
      ],
      goodToKnow: [
        'Final 350 metres is a scenic stone forest footpath; our caretaker assists with luggage on arrival.',
        '100% solar micro-grid with battery backup and 95 Mbps Starlink Wi-Fi for remote work.',
        'Wood-fired hot tub is pre-heated to 39°C before your check-in.',
        'Complimentary locally roasted Kullu pour-over coffee and wildflower honeystocked in the pantry.'
      ],
      houseRules: {
        checkIn: '14:30 – 20:00',
        checkOut: '11:00',
        items: [
          'Quiet outdoor hours after 22:00 to respect nocturnal forest wildlife',
          'Up to 2 well-behaved dogs welcome (trail towels & bowls provided)',
          'No smoking indoors; designated stone firepit deck outdoors',
          'No commercial film shoots without prior written host permit'
        ]
      },
      host: {
        name: 'Kabir Thakur',
        since: '2021',
        badge: 'Kath-Kuni Preservationist',
        responseRate: '99%',
        responseTime: 'within 1 hour',
        bio: 'Former mountain cartographer restoring traditional timber craft across Tirthan and Sainj valleys.'
      },
      reviews: [
        { guest: 'Ananya Verma', date: 'Oct 2026', rating: 5, trip: 'Couple Escape', comment: 'The cedar hot tub at 5:45 PM as the valley turns copper-gold is worth the journey alone. Impeccably clean and soulful.' },
        { guest: 'Devraj Menon', date: 'Sep 2026', rating: 5, trip: 'Solo Writing Retreat', comment: 'Finished two chapters in four days. Fast Wi-Fi when needed, profound forest silence the rest of the time.' },
        { guest: 'Sana & Nikhil', date: 'Aug 2026', rating: 5, trip: 'With Our Dog', comment: 'Our golden retriever loved the private orchard trail. Kabir left fresh sourdough and plum jam on the counter.' }
      ]
    },
    {
      id: 'stay-02',
      slug: 'cedar-crown-treehouse',
      title: 'Cedar Crown Treehouse',
      tagline: 'Forty feet up in old-growth Wayanad rainforest, reached by a swaying timber skybridge.',
      location: 'Vythiri Canopy, Kerala Forest',
      region: 'Western Ghats & Kerala',
      coordinates: { lat: 11.552, lng: 76.041 },
      category: 'treehouses',
      categoryLabel: 'Canopy Treehouse',
      pricePerNight: 280,
      cleaningFee: 50,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.96,
      reviewCount: 78,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: true,
      featured: true,
      createdAt: '2026-08-24',
      scarcitySeed: 4, // 4 nights left this month
      weather: { temp: '22°C', label: 'Warm Rainforest Mist' },
      bestSeason: 'Sep – Mar',
      elevation: '1,120 m',
      amenities: ['Wi-Fi', 'Off-grid', 'Lake view'],
      cover: 'assets/images/stay-02-cover.webp',
      coverFallback: 'assets/images/stay-02-cover.jpg',
      coverAlt: 'Elevated hardwood Cedar Crown Treehouse nestled high among misty emerald trees in Kerala at golden light',
      gallery: [
        {
          src: 'assets/images/stay-02-g1.webp',
          fallback: 'assets/images/stay-02-g1.jpg',
          alt: 'Open-air rattan and teak living lounge inside Kerala treehouse surrounded by green canopy',
          caption: 'Wrap-around canopy lounge crafted from sustainably felled Malabar teak and cane'
        },
        {
          src: 'assets/images/stay-02-g2.webp',
          fallback: 'assets/images/stay-02-g2.jpg',
          alt: 'Four-poster teak canopy bed draped in sheer organic cotton looking into dense rainforest',
          caption: 'Wake at eye-level with Malabar whistling thrushes and drifting morning mist'
        },
        {
          src: 'assets/images/stay-02-g3.webp',
          fallback: 'assets/images/stay-02-g3.jpg',
          alt: 'River-stone and brushed copper rain shower bathroom inside treehouse opening to tropical ferns',
          caption: 'Hand-carved river-boulder basin and copper rain shower open to tree ferns'
        },
        {
          src: 'assets/images/stay-02-g4.webp',
          fallback: 'assets/images/stay-02-g4.jpg',
          alt: 'Sunrise view from treetop wooden balcony over Western Ghats rainforest canopy in Kerala',
          caption: 'First golden light breaking across thirty-five acres of private biodiversity reserve'
        }
      ],
      description: [
        'Engineered using non-invasive compression collars around two century-old rosewood giants, Cedar Crown Treehouse floats twelve metres above a fern-carpeted forest stream in Wayanad. Zero nails pierce the living host trees.',
        'Cross a private 22-metre suspension bridge to reach your sanctuary, draw back the hand-loomed cotton louvers, and let warm spice-scented breezes carry the chorus of cicadas and distant stream cascades through the room.'
      ],
      goodToKnow: [
        'Adults-only sanctuary (18+) due to elevated suspension bridge and wrap-around canopy deck.',
        'Includes complimentary estate spice-trail walk and basket breakfast pulleyed up each morning at 08:30.',
        'Natural cross-ventilation keeps the suite cool year-round without noisy air-conditioning.',
        'Binoculars and illustrated Western Ghats birding field guide provided in the lounge.'
      ],
      houseRules: {
        checkIn: '14:00 – 18:30',
        checkOut: '11:00',
        items: [
          'Check-in before dusk recommended to enjoy the skybridge walk in daylight',
          'No pets permitted to protect resident Nilgiri martens and hornbills',
          'Strictly biodegradable toiletries only (organic bath botanicals provided)',
          'No open candles or incense on the timber deck'
        ]
      },
      host: {
        name: 'Lakshmi Nair',
        since: '2020',
        badge: 'Botanical Architect',
        responseRate: '100%',
        responseTime: 'within 1 hour',
        bio: 'Tropical architect designing zero-footprint canopy dwellings across rewilded cardamom estates.'
      },
      reviews: [
        { guest: 'Siddharth Iyer', date: 'Oct 2026', rating: 5, trip: 'Honeymoon', comment: 'Pulling up our warm appam and estate coffee basket on the rope pulley while hornbills flew past—unforgettable.' },
        { guest: 'claire & Marc', date: 'Sep 2026', rating: 5, trip: 'Architecture Lovers', comment: 'The joinery is museum-grade. You feel gentle sway in the wind like being cradled by the forest itself.' },
        { guest: 'Prerna Kulkarni', date: 'Jul 2026', rating: 4.9, trip: 'Solo Reset', comment: 'Pure sanctuary. That copper rain shower looking out into giant tree ferns is heaven.' }
      ]
    },
    {
      id: 'stay-03',
      slug: 'stargazer-glass-dome',
      title: 'Stargazer Glass Dome',
      tagline: 'Low-iron geodesic glass beneath Bortle-2 desert constellations and sandstone horizons.',
      location: 'Khimsar Outskirts, Rajasthan Desert',
      region: 'Rajasthan & Thar Dunes',
      coordinates: { lat: 26.988, lng: 73.405 },
      category: 'domes',
      categoryLabel: 'Geodesic Dome',
      pricePerNight: 310,
      cleaningFee: 55,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.97,
      reviewCount: 66,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: true,
      featured: true,
      createdAt: '2026-10-02',
      scarcitySeed: 3, // 3 nights left this month
      weather: { temp: '24°C', label: 'Clear Starlit Skies' },
      bestSeason: 'Oct – Mar',
      elevation: '310 m',
      amenities: ['Hot tub', 'Wi-Fi', 'Off-grid', 'EV charger'],
      cover: 'assets/images/stay-03-cover.webp',
      coverFallback: 'assets/images/stay-03-cover.jpg',
      coverAlt: 'Luxury geodesic Stargazer Glass Dome glowing warm amber on a Rajasthan sandstone terrace at sunset',
      gallery: [
        {
          src: 'assets/images/stay-03-g1.webp',
          fallback: 'assets/images/stay-03-g1.jpg',
          alt: 'Curved panoramic glass lounge inside desert dome with camel leather chairs and brass lanterns',
          caption: 'Hand-knotted Barmer dhurries and saddle-leather lounge facing endless desert scrub'
        },
        {
          src: 'assets/images/stay-03-g2.webp',
          fallback: 'assets/images/stay-03-g2.jpg',
          alt: 'King bed beneath transparent geodesic skylight panels with twilight desert sky above',
          caption: 'Motorised blackout-optional zenith skylight engineered for naked-eye stargazing'
        },
        {
          src: 'assets/images/stay-03-g3.webp',
          fallback: 'assets/images/stay-03-g3.jpg',
          alt: 'Private sunken Jodhpur sandstone plunge tub on a lantern-lit desert deck at dusk',
          caption: 'Heated Jodhpur pink-sandstone plunge pool carved into the private terrace'
        },
        {
          src: 'assets/images/stay-03-g4.webp',
          fallback: 'assets/images/stay-03-g4.jpg',
          alt: 'Golden crimson sunset horizon across quiet Rajasthan desert plains from dome terrace',
          caption: 'Sixty-kilometre unobstructed western horizon—zero neighbouring structures in sight'
        }
      ],
      description: [
        'Anchored on a hand-dressed Jodhpur sandstone plinth surrounded by wild khejri groves, Stargazer Glass Dome blends aerospace-grade solar glazing with tactile Rajasthani craft. Silent geothermal-assisted climate control keeps noon crisp and midnight cosy.',
        'At twilight, sink into the heated sandstone plunge pool as peacocks call in the dry ravine below, then align the brass Dobsonian telescope on the deck to trace Saturn’s rings and the galactic core.'
      ],
      goodToKnow: [
        'Equipped with a 6-inch Dobsonian telescope and red-light astronomy lamps to preserve night vision.',
        'Paved private gravel drive suitable for all sedans & EVs; 11 kW solar EV charger on-site.',
        'Automated insulated linen shade closes with one bedside switch before sunrise.',
        'Optional private twilight dune dinner curated by local Marwari chefs.'
      ],
      houseRules: {
        checkIn: '15:00 – 21:00',
        checkOut: '11:00',
        items: [
          'Exterior bright flashlights discouraged after 21:30 to protect dark-sky sanctuary',
          'No pets due to free-roaming chinkara gazelles on the reserve',
          'No drone photography without prior guest-privacy clearance',
          'Conserve desert water; plunge pool uses closed-loop UV filtration'
        ]
      },
      host: {
        name: 'Harshvardhan Rathore',
        since: '2022',
        badge: 'Dark-Sky Advocate',
        responseRate: '98%',
        responseTime: 'within 1 hour',
        bio: 'Amateur astrophotographer & desert rewilding steward restoring native Marwar grasslands.'
      },
      reviews: [
        { guest: 'Zoya Merchant', date: 'Oct 2026', rating: 5, trip: 'Birthday Stargazing', comment: 'Saw eleven shooting stars without leaving the pillows. Harshvardhan’s astronomy briefing was magical.' },
        { guest: 'Karan & Rhea', date: 'Feb 2026', rating: 5, trip: 'Road Trip (EV)', comment: 'Charged our EV off desert sunshine while soaking in the sandstone tub at sunset. Next-level hospitality.' },
        { guest: 'Arjun Bhatia', date: 'Jan 2026', rating: 4.9, trip: 'Photography Escape', comment: 'Zero light pollution, total silence, and deeply thoughtful interiors.' }
      ]
    },
    {
      id: 'stay-04',
      slug: 'mistline-tiny-house',
      title: 'Mistline Tiny House',
      tagline: 'Charred-cedar micro-architecture poised above rolling emerald tea terraces.',
      location: 'Suryanelli Ridge, Munnar Tea Hills',
      region: 'Western Ghats & Kerala',
      coordinates: { lat: 10.058, lng: 77.184 },
      category: 'tiny-homes',
      categoryLabel: 'Architectural Tiny Home',
      pricePerNight: 185,
      cleaningFee: 35,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.94,
      reviewCount: 112,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: true,
      featured: true,
      createdAt: '2026-07-14',
      scarcitySeed: 6,
      weather: { temp: '16°C', label: 'Drifting Tea Cloud' },
      bestSeason: 'Sep – May',
      elevation: '1,940 m',
      amenities: ['Fireplace', 'Wi-Fi', 'Pet-friendly', 'Off-grid'],
      cover: 'assets/images/stay-04-cover.webp',
      coverFallback: 'assets/images/stay-04-cover.jpg',
      coverAlt: 'Minimalist charred-wood Mistline Tiny House perched above misty emerald tea plantations in Munnar',
      gallery: [
        {
          src: 'assets/images/stay-04-g1.webp',
          fallback: 'assets/images/stay-04-g1.jpg',
          alt: 'Built-in birchwood daybed beside picture window framing Munnar green tea slopes',
          caption: 'Custom birchwood reading alcove framing undulating high-grown tea gardens'
        },
        {
          src: 'assets/images/stay-04-g2.webp',
          fallback: 'assets/images/stay-04-g2.jpg',
          alt: 'Elevated sleeping loft nook with skylight and panoramic window over misty hills',
          caption: 'Sky-lit mezzanine bed where silver clouds drift straight past your pillow'
        },
        {
          src: 'assets/images/stay-04-g3.webp',
          fallback: 'assets/images/stay-04-g3.jpg',
          alt: 'Compact solid-teak tiny home kitchenette with matte black kettle and stoneware mugs',
          caption: 'Precision joinery pantry stocked with single-estate white and orthodox loose-leaf teas'
        },
        {
          src: 'assets/images/stay-04-g4.webp',
          fallback: 'assets/images/stay-04-g4.jpg',
          alt: 'Small cedar deck with two timber chairs overlooking golden mist over Munnar tea hills',
          caption: 'Private east-facing cedar deck engineered for unforgettable cloud-sea sunrises'
        }
      ],
      description: [
        'Occupying just twenty-four square metres yet feeling boundlessly expansive, Mistline Tiny House applies Japanese Shou Sugi Ban charred timber craft to the high ridges of Munnar. Every drawer, ladder rung, and brass latch clicks shut like yacht cabinetry.',
        'Brew single-origin high-elevation white tea at first light, watch ribbons of cloud pour across the Kolukkumalai saddle, and curl up on the birchwood window seat as evening drizzle taps softly on the skylight.'
      ],
      goodToKnow: [
        'Compact timber ship’s ladder leads to the loft bed; best suited for agile guests.',
        'Direct private access to 9 km of scenic high-ridge tea estate walking tracks.',
        'Bio-ethanol smokeless hearth warms the cabin in under ten minutes.',
        'Accessible by regular hatchback right up to the mossy stone parking bay.'
      ],
      houseRules: {
        checkIn: '14:00 – 19:30',
        checkOut: '11:00',
        items: [
          'Soft-soled indoor slippers provided to protect oiled birch floors',
          '1 small/medium pet welcome upon prior notice',
          'Stay on marked estate footpaths during tea-plucking mornings',
          'No loud external speakers'
        ]
      },
      host: {
        name: 'Mathew Kurian',
        since: '2021',
        badge: 'Micro-Living Builder',
        responseRate: '100%',
        responseTime: 'within 30 mins',
        bio: 'Industrial designer crafting off-grid tiny cabins on regenerative family tea plots.'
      },
      reviews: [
        { guest: 'ira Banerjee', date: 'Oct 2026', rating: 5, trip: 'Solo Slow Travel', comment: 'Proof that thoughtful space beats square footage every single time. That window daybed changed my brain chemistry.' },
        { guest: 'Gautam & Priya', date: 'Sep 2026', rating: 4.9, trip: 'Weekend Retreat', comment: 'Woke up above an actual ocean of golden clouds at 6:10 AM. Unreal.' },
        { guest: 'Nikhil Thomas', date: 'Aug 2026', rating: 5, trip: 'Design Pilgrimage', comment: 'Every corner is an architectural masterclass. Spotless and deeply cozy.' }
      ]
    },
    {
      id: 'stay-05',
      slug: 'lotus-float-house',
      title: 'Lotus Float House',
      tagline: 'Solar-powered floating teak pavilion anchored in a quiet lotus cove.',
      location: 'Vembanad Sanctuary, Backwater Lake',
      region: 'Western Ghats & Kerala',
      coordinates: { lat: 9.617, lng: 76.430 },
      category: 'floating',
      categoryLabel: 'Floating Villa',
      pricePerNight: 295,
      cleaningFee: 45,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.95,
      reviewCount: 61,
      maxGuests: 3,
      bedrooms: 1,
      beds: 2,
      baths: 1,
      instantBook: false,
      featured: true,
      createdAt: '2026-09-05',
      scarcitySeed: 5,
      weather: { temp: '27°C', label: 'Glassy Lagoon Breeze' },
      bestSeason: 'Oct – Mar',
      elevation: 'Sea Level',
      amenities: ['Wi-Fi', 'Lake view', 'Off-grid'],
      cover: 'assets/images/stay-05-cover.webp',
      coverFallback: 'assets/images/stay-05-cover.jpg',
      coverAlt: 'Sustainable floating timber Lotus Float House anchored on a golden backwater lake ringed by palms',
      gallery: [
        {
          src: 'assets/images/stay-05-g1.webp',
          fallback: 'assets/images/stay-05-g1.jpg',
          alt: 'Water-level living room inside floating villa with wide sliding doors open to calm lake ripples',
          caption: 'Slide back three-panel teak doors to let gentle lagoon breezes cross the lounge'
        },
        {
          src: 'assets/images/stay-05-g2.webp',
          fallback: 'assets/images/stay-05-g2.jpg',
          alt: 'Floating bedroom suite facing floor-to-ceiling glass right at golden backwater level',
          caption: 'Waterline king bed—watch pink waterlilies unfurl inches from the glass at dawn'
        },
        {
          src: 'assets/images/stay-05-g3.webp',
          fallback: 'assets/images/stay-05-g3.jpg',
          alt: 'Carved stone soaking tub beside wooden louvered shutters overlooking lotus lake at twilight',
          caption: 'Hand-chiselled granite soaking tub looking onto a protected kingfisher reedbed'
        },
        {
          src: 'assets/images/stay-05-g4.webp',
          fallback: 'assets/images/stay-05-g4.jpg',
          alt: 'Bow deck view of mirror-still backwaters and silhouetted palms under warm amber sunset sky',
          caption: 'Private bow deck with two cedar kayaks moored for silent dawn paddles'
        }
      ],
      description: [
        'Unlike diesel houseboats that churn busy canals, Lotus Float House rests silently in a private, motor-free lotus inlet on the eastern edge of Vembanad Lake. Buoyed on silent marine pontoons and powered entirely by rooftop solar shingles, the villa moves almost imperceptibly with the tide.',
        'Slip directly from your teak bow deck into a handcrafted cedar kayak at sunrise, read in the breeze-cooled lounge at noon, and watch lantern light shimmer across ebony water after dusk.'
      ],
      goodToKnow: [
        'Reached via a scenic 6-minute electric shikara transfer from our private jetty (included).',
        'Two wooden kayaks and life vests moored directly to your private deck.',
        'Zero-discharge closed marine bio-filtration protects the surrounding lotus ecosystem.',
        'Home-cooked toddy-shop-style seafood or vegetarian dinner delivered warm by canoe on request.'
      ],
      houseRules: {
        checkIn: '13:30 – 18:00',
        checkOut: '10:30',
        items: [
          'Children under 8 not recommended due to open water-level decks',
          'Life jackets required when taking kayaks onto the main lake channel',
          'No single-use plastics brought aboard',
          'Quiet voices after dusk—sound travels far over calm water'
        ]
      },
      host: {
        name: 'Joseph Tharakan',
        since: '2019',
        badge: 'Lagoon Conservationist',
        responseRate: '99%',
        responseTime: 'within 1 hour',
        bio: 'Naval engineer building silent solar water-dwellings to replace fossil-fuel backwater craft.'
      },
      reviews: [
        { guest: 'Meenakshi & Neel', date: 'Oct 2026', rating: 5, trip: 'Anniversary', comment: 'Zero engine noise, zero boat traffic—just lotus blossoms, herons, and golden water on three sides.' },
        { guest: 'Samir Qureshi', date: 'Feb 2026', rating: 4.9, trip: 'Slow Retreat', comment: 'Kayaking out from our bedroom deck into morning mist was pure cinema.' },
        { guest: 'Elena Rossi', date: 'Jan 2026', rating: 5, trip: 'Architectural Tour', comment: 'Refined, serene, and genuinely eco-conscious.' }
      ]
    },
    {
      id: 'stay-06',
      slug: 'dune-whisper-camp',
      title: 'Dune Whisper Camp',
      tagline: 'Bespoke expedition canvas & carved sandstone poised on untouched Thar crests.',
      location: 'Kanoi Private Reserve, Thar Dunes',
      region: 'Rajasthan & Thar Dunes',
      coordinates: { lat: 26.874, lng: 70.618 },
      category: 'desert',
      categoryLabel: 'Desert Pavilion',
      pricePerNight: 340,
      cleaningFee: 60,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.99,
      reviewCount: 53,
      maxGuests: 3,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: false,
      featured: true,
      createdAt: '2026-10-12',
      scarcitySeed: 2, // Only 2 nights left this month!
      weather: { temp: '25°C', label: 'Golden Dune Breeze' },
      bestSeason: 'Nov – Feb',
      elevation: '225 m',
      amenities: ['Fireplace', 'Pet-friendly', 'Off-grid'],
      cover: 'assets/images/stay-06-cover.webp',
      coverFallback: 'assets/images/stay-06-cover.jpg',
      coverAlt: 'Luxury canvas safari pavilion Dune Whisper Camp on a raised teak platform among golden Thar dunes at sunset',
      gallery: [
        {
          src: 'assets/images/stay-06-g1.webp',
          fallback: 'assets/images/stay-06-g1.jpg',
          alt: 'Tented lounge interior with natural draped canvas, teak campaign chairs and desert kilim rugs',
          caption: 'Double-layered breathable expedition canvas furnished with heirloom Marwar kilims'
        },
        {
          src: 'assets/images/stay-06-g2.webp',
          fallback: 'assets/images/stay-06-g2.jpg',
          alt: 'King bed inside Thar desert tent pavilion illuminated by warm wrought-iron lanterns',
          caption: 'Hand-spun organic cotton sheets and camel-wool winter throws'
        },
        {
          src: 'assets/images/stay-06-g3.webp',
          fallback: 'assets/images/stay-06-g3.jpg',
          alt: 'Luxury en-suite desert bathroom with hammered copper sink, sandstone vanity and open-sky shower',
          caption: 'Open-sky sandstone shower court heated by desert solar thermal tubes'
        },
        {
          src: 'assets/images/stay-06-g4.webp',
          fallback: 'assets/images/stay-06-g4.jpg',
          alt: 'Wind-sculpted golden Thar sand dunes seen from private timber verandah with glowing hurricane lamps',
          caption: 'Watch wind erase yesterday’s footprints across your private dune amphitheatre'
        }
      ],
      description: [
        'Set four kilometres away from any camp cluster on a leased conservation dune corridor, Dune Whisper Camp is a single standalone pavilion—you share the horizon with nobody. Raised on Burmese teak stilts above shifting golden sand, its billowing double-skin canvas stays naturally cool under desert sun.',
        'As dusk turns the crests burnt sienna, your private brass brazier is lit on the deck, Manganiyar folk melodies drift from across the ridge on select evenings, and desert foxes leave delicate tracks below your steps by dawn.'
      ],
      goodToKnow: [
        'Complimentary 4x4 vintage soft-top transfer from Kanoi meeting point (12 mins over sand track).',
        'Intentional digital-detox stay: no Wi-Fi router on-site, though 4G signal reaches the ridge.',
        'Includes sunrise desert-flora walk and evening sunken firepit service.',
        'Closed May–August during peak summer desert winds.'
      ],
      houseRules: {
        checkIn: '15:30 – 18:30',
        checkOut: '10:30',
        items: [
          'Arrive before sunset for the scenic dune transfer',
          'No off-road self-driving on surrounding vegetated dunes',
          '1 pet welcome; keep leashed at dusk around desert wildlife',
          'Lanterns extinguished outdoors by midnight'
        ]
      },
      host: {
        name: 'Bhawani Singh Bhati',
        since: '2020',
        badge: 'Desert Heritage Host',
        responseRate: '97%',
        responseTime: 'within 2 hours',
        bio: 'Third-generation Jaisalmer conservationist protecting sacred Oran desert groves.'
      },
      reviews: [
        { guest: 'Malvika Kapoor', date: 'Oct 2026', rating: 5, trip: 'Digital Detox', comment: 'Having an entire Thar dune bowl completely to ourselves felt surreal. Not another tent anywhere on the horizon.' },
        { guest: 'julien & Camille', date: 'Feb 2026', rating: 5, trip: 'Once-in-a-Lifetime', comment: 'That open-sky copper shower under desert stars! Unmatched taste and warmth.' },
        { guest: 'Raghavendra S.', date: 'Jan 2026', rating: 5, trip: 'Couple Escape', comment: 'Pure poetry in canvas and sandstone. Worth every rupee and mile.' }
      ]
    },
    {
      id: 'stay-07',
      slug: 'ember-ridge-log-cabin',
      title: 'Ember Ridge Log Cabin',
      tagline: 'Heavy-timber alpine refuge with panoramic barrel sauna and crackling stone hearth.',
      location: 'Prini High Spur, Snowy Himachal',
      region: 'Himalayan Foothills',
      coordinates: { lat: 32.226, lng: 77.204 },
      category: 'cabins',
      categoryLabel: 'Alpine Log Cabin',
      pricePerNight: 365,
      cleaningFee: 60,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.97,
      reviewCount: 89,
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      baths: 2,
      instantBook: true,
      featured: false,
      createdAt: '2026-09-29',
      scarcitySeed: 3, // 3 nights left this month
      weather: { temp: '4°C', label: 'Powder Snow & Sun' },
      bestSeason: 'Nov – Apr',
      elevation: '2,640 m',
      amenities: ['Fireplace', 'Sauna', 'Wi-Fi', 'EV charger', 'Pet-friendly'],
      cover: 'assets/images/stay-07-cover.webp',
      coverFallback: 'assets/images/stay-07-cover.jpg',
      coverAlt: 'Snow-dusted handcrafted cedar Ember Ridge Log Cabin among spruce trees in Himachal at golden dusk',
      gallery: [
        {
          src: 'assets/images/stay-07-g1.webp',
          fallback: 'assets/images/stay-07-g1.jpg',
          alt: 'Log cabin living room with river-stone fireplace, shearling throws and snowy pine view',
          caption: 'Hand-built Beas river-stone hearth stocked with seasoned oak and applewood'
        },
        {
          src: 'assets/images/stay-07-g2.webp',
          fallback: 'assets/images/stay-07-g2.jpg',
          alt: 'Master log bedroom with chunky wool knit blanket and frosted window facing snowy Himalayan peaks',
          caption: 'Heated walnut floors and goose-down duvets facing the Pir Panjal massif'
        },
        {
          src: 'assets/images/stay-07-g3.webp',
          fallback: 'assets/images/stay-07-g3.jpg',
          alt: 'Private cedar sauna with round panoramic glass window overlooking snow-laden pines at twilight',
          caption: 'Finnish-stove cedar barrel sauna with panoramic snow-forest window'
        },
        {
          src: 'assets/images/stay-07-g4.webp',
          fallback: 'assets/images/stay-07-g4.jpg',
          alt: 'Golden alpenglow across snow-covered Himachal ridges seen from timber log cabin porch',
          caption: 'Evening alpenglow painting 5,000-metre peaks straight from your covered porch'
        }
      ],
      description: [
        'Notched by hand from seasoned Himalayan deodar and spruce logs, Ember Ridge sits high above the Kullu floor where spruce boughs bow under fresh winter powder. Inside, radiant underfloor heating, Kinnauri handloom throws, and a roaring river-stone fireplace wrap six guests in deep alpine warmth.',
        'Alternate between snowshoe walks through silent cedar glades and ninety-degree sessions in the private panoramic barrel sauna as dusk turns the snowfields rose-gold.'
      ],
      goodToKnow: [
        'Heated private driveway + 7.4 kW EV wallbox; AWD vehicle provided on shuttle call during heavy January snow.',
        'Three full bedrooms make this ideal for families or small creative retreats.',
        'Snowshoes and trekking poles in 4 sizes complimentary in the mudroom.',
        'Dedicated mudroom boot-dryer and ski/board rack.'
      ],
      houseRules: {
        checkIn: '15:00 – 20:00',
        checkOut: '11:00',
        items: [
          'Use fireplace spark screen whenever leaving the lounge unattended',
          'Sauna maximum session guidelines posted inside',
          'Pets welcome; please wipe snowy paws in heated mudroom',
          'No fireworks or loud outdoor gatherings'
        ]
      },
      host: {
        name: 'Tenzin & Maya Negi',
        since: '2020',
        badge: 'High-Altitude Hosts',
        responseRate: '100%',
        responseTime: 'within 45 mins',
        bio: 'Mountaineering instructors & slow-hospitality hosts based between Manali and Kinnaur.'
      },
      reviews: [
        { guest: 'Ritwik Sen', date: 'Mar 2026', rating: 5, trip: 'Family Snow Week', comment: 'Stepping out of a steaming cedar sauna to watch fresh snow fall on pines—nothing in India compares.' },
        { guest: 'Natasha & Friends', date: 'Feb 2026', rating: 5, trip: 'Friends Escape', comment: 'Six of us cooked, played board games by the hearth, and slept deeper than we have in years.' },
        { guest: 'Varun Oberoi', date: 'Jan 2026', rating: 4.9, trip: 'Workation', comment: 'Warm floors, blazing fast internet, and million-dollar Pir Panjal views.' }
      ]
    },
    {
      id: 'stay-08',
      slug: 'moss-and-stone-cottage',
      title: 'Moss & Stone Cottage',
      tagline: '1920s granite planter’s cottage reborn amid pepper vines and Arabica shade trees.',
      location: 'Pollibetta Estate, Coorg Coffee Hills',
      region: 'Western Ghats & Kerala',
      coordinates: { lat: 12.228, lng: 75.951 },
      category: 'cabins',
      categoryLabel: 'Heritage Forest Cottage',
      pricePerNight: 215,
      cleaningFee: 40,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.95,
      reviewCount: 104,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2,
      instantBook: true,
      featured: false,
      createdAt: '2026-06-20',
      scarcitySeed: 8,
      weather: { temp: '20°C', label: 'Coffee Blossom Air' },
      bestSeason: 'Oct – Apr',
      elevation: '1,040 m',
      amenities: ['Fireplace', 'Wi-Fi', 'Pet-friendly', 'EV charger'],
      cover: 'assets/images/stay-08-cover.webp',
      coverFallback: 'assets/images/stay-08-cover.jpg',
      coverAlt: 'Heritage granite and red-tile Moss & Stone Cottage surrounded by misty Coorg coffee plants at golden hour',
      gallery: [
        {
          src: 'assets/images/stay-08-g1.webp',
          fallback: 'assets/images/stay-08-g1.jpg',
          alt: 'Exposed stone cottage living room with terracotta tiles, vintage teak chairs and hearth',
          caption: 'Hand-laid Athangudi & terracotta floors paired with restored Kodava rosewood heirlooms'
        },
        {
          src: 'assets/images/stay-08-g2.webp',
          fallback: 'assets/images/stay-08-g2.jpg',
          alt: 'Cottage bedroom with dark teak beams, moss-green linen bed and tall windows to coffee estate',
          caption: 'Pitched Mangalore-tile ceilings and tall casement windows opening onto silver-oak shade'
        },
        {
          src: 'assets/images/stay-08-g3.webp',
          fallback: 'assets/images/stay-08-g3.jpg',
          alt: 'Walled courtyard bathroom with deep hammered copper soaking tub and lush tropical ferns',
          caption: 'Private mossy stone courtyard bath with deep hand-beaten copper soaking tub'
        },
        {
          src: 'assets/images/stay-08-g4.webp',
          fallback: 'assets/images/stay-08-g4.jpg',
          alt: 'Deep timber verandah with glowing brass lamp overlooking misty Coorg coffee hills at dusk',
          caption: 'Read through dusk under the deep verandah eaves while estate mist rolls in'
        }
      ],
      description: [
        'Hidden down a winding red-earth lane lined with wild cardamom and black-pepper vines, Moss & Stone Cottage is a lovingly restored 1928 granite granary on an organic shade-grown coffee estate. Thick lichen-dappled stone walls keep afternoons cool and evenings intimate.',
        'Roast your own estate-picked Peaberry beans with the resident roaster, soak in the open-sky fern courtyard copper tub, and dine by lantern light on traditional Kodava pandi or wild bamboo-shoot curries.'
      ],
      goodToKnow: [
        'Step-free ground-floor layout makes this stay comfortable for multi-generational guests.',
        'Includes 500g bag of single-block estate coffee roasted the week of your arrival.',
        'Fenced half-acre botanical garden ideal for dogs.',
        'Type-2 EV charging socket in covered carport.'
      ],
      houseRules: {
        checkIn: '14:00 – 20:00',
        checkOut: '11:30',
        items: [
          'Respect working estate zones during morning harvest',
          'Up to 2 pets warmly welcomed',
          'Copper tub uses botanical bath salts only (provided)',
          'Close garden gate at night'
        ]
      },
      host: {
        name: 'Bopanna & Kaveri Cariappa',
        since: '2018',
        badge: 'Shade-Coffee Custodians',
        responseRate: '100%',
        responseTime: 'within 1 hour',
        bio: 'Fourth-generation regenerative coffee growers preserving elephant corridors in South Coorg.'
      },
      reviews: [
        { guest: 'Shreya Gokhale', date: 'Oct 2026', rating: 5, trip: 'With Parents', comment: 'Effortlessly accessible, warm, and fragrant with coffee blossom and woodsmoke. Kaveri’s breakfast was unforgettable.' },
        { guest: 'Aditya Rao', date: 'Aug 2026', rating: 5, trip: 'Monsoon Retreat', comment: 'Listening to rain on Mangalore tiles from a steaming copper tub in a fern courtyard—11/10.' },
        { guest: 'Tanvi & Kabir', date: 'May 2026', rating: 4.9, trip: 'Road Trip', comment: 'Old-world soul without a single dusty corner. Pure class.' }
      ]
    },
    {
      id: 'stay-09',
      slug: 'skyloft-cliff-pod',
      title: 'Skyloft Cliff Pod',
      tagline: 'Cantilevered cedar-and-glass micro-pod projecting over a 600-metre Ghat gorge.',
      location: 'Tapola Escarpment, Western Ghats Cliff',
      region: 'Konkan & Goa Coast',
      coordinates: { lat: 17.772, lng: 73.736 },
      category: 'tiny-homes',
      categoryLabel: 'Cantilevered Cliff Pod',
      pricePerNight: 330,
      cleaningFee: 50,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.98,
      reviewCount: 49,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: false,
      featured: false,
      createdAt: '2026-10-19',
      scarcitySeed: 2, // Only 2 nights left this month!
      weather: { temp: '19°C', label: 'Dramatic Ridge Wind' },
      bestSeason: 'Oct – Mar',
      elevation: '1,310 m',
      amenities: ['Hot tub', 'Wi-Fi', 'Lake view', 'Off-grid'],
      cover: 'assets/images/stay-09-cover.webp',
      coverFallback: 'assets/images/stay-09-cover.jpg',
      coverAlt: 'Cantilevered modern cedar and glass Skyloft Cliff Pod perched on a rocky Western Ghats cliff edge at sunset',
      gallery: [
        {
          src: 'assets/images/stay-09-g1.webp',
          fallback: 'assets/images/stay-09-g1.jpg',
          alt: 'Curved warm timber cliff pod lounge with 180-degree wrap-around glass floating above green gorge',
          caption: 'Structural steel-core cantilever wrapped in acoustic Western red cedar'
        },
        {
          src: 'assets/images/stay-09-g2.webp',
          fallback: 'assets/images/stay-09-g2.jpg',
          alt: 'Platform bed inside cantilevered pod facing dramatic misty escarpments and golden sunset clouds',
          caption: 'Horizon-aligned king platform bed suspended above swirling canyon clouds'
        },
        {
          src: 'assets/images/stay-09-g3.webp',
          fallback: 'assets/images/stay-09-g3.jpg',
          alt: 'Dark slate spa bath and cantilevered outdoor soaking tub overlooking deep misty valley at twilight',
          caption: 'Recessed basalt deck soaking tub looking down onto winding Koyna backwaters'
        },
        {
          src: 'assets/images/stay-09-g4.webp',
          fallback: 'assets/images/stay-09-g4.jpg',
          alt: 'Panoramic view from glass-and-teak cliff deck across Western Ghats cliffs and distant waterfall at sunset',
          caption: 'Watch kestrels ride thermals below eye-level from your private cantilevered deck'
        }
      ],
      description: [
        'Anchored four metres deep into solid Deccan basalt, Skyloft Cliff Pod extends boldly beyond a sheer Sahyadri rim overlooking the emerald fingers of Koyna Lake far below. Inside, curved acoustic timber ribs create yacht-like serenity even when dramatic ridge winds sweep across the plateau.',
        'At sunset, the entire gorge fills with molten amber light, seasonal ribbon waterfalls catch the glow across the canyon, and your sunken basalt deck tub feels perched on the edge of the earth.'
      ],
      goodToKnow: [
        'Strictly adults-only (2 guests max) due to dramatic cliffside elevation.',
        'Engineered to 200 km/h wind-load standards with triple-laminated structural safety glass.',
        'Gourmet grazing platter & wood-fired sourdough focaccia stocked prior to arrival.',
        '3.5-hour scenic drive south of Pune / 5 hours from Mumbai.'
      ],
      houseRules: {
        checkIn: '15:00 – 18:30',
        checkOut: '11:00',
        items: [
          'Never climb or sit on exterior glass balustrades',
          'No pets or infants permitted',
          'Outdoor deck umbrellas stowed during high ridge gusts',
          'Strictly registered overnight guests only'
        ]
      },
      host: {
        name: 'Omkar & Vedika Joshi',
        since: '2023',
        badge: 'Structural Architects',
        responseRate: '100%',
        responseTime: 'within 30 mins',
        bio: 'Husband-and-wife structural studio crafting low-impact cliff & ridge micro-architecture.'
      },
      reviews: [
        { guest: 'Rehan Malhotra', date: 'Oct 2026', rating: 5, trip: 'Proposal Trip', comment: 'She said yes on the deck as clouds poured over the escarpment in pure gold light. Architectural perfection.' },
        { guest: 'Divya Krishnan', date: 'Sep 2026', rating: 5, trip: 'Weekend Escape', comment: 'Having eagles glide BELOW your coffee cup is a perspective shift I will never forget.' },
        { guest: 'Sahil Mehta', date: 'Apr 2026', rating: 4.9, trip: 'Design Lover', comment: 'World-class engineering right here in the Sahyadris.' }
      ]
    },
    {
      id: 'stay-10',
      slug: 'amber-orchard-barn-stay',
      title: 'Amber Orchard Barn Stay',
      tagline: 'Reclaimed oak trusses, gourmet farmhouse kitchen, and sunlit Chenin Blanc rows.',
      location: 'Dindori Hills, Rural Vineyard',
      region: 'Konkan & Goa Coast',
      coordinates: { lat: 20.198, lng: 73.839 },
      category: 'cabins',
      categoryLabel: 'Converted Timber Barn',
      pricePerNight: 260,
      cleaningFee: 45,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.93,
      reviewCount: 72,
      maxGuests: 5,
      bedrooms: 2,
      beds: 3,
      baths: 2,
      instantBook: true,
      featured: false,
      createdAt: '2026-08-03',
      scarcitySeed: 7,
      weather: { temp: '23°C', label: 'Warm Harvest Sun' },
      bestSeason: 'Oct – Mar',
      elevation: '640 m',
      amenities: ['Fireplace', 'Wi-Fi', 'Pet-friendly', 'EV charger'],
      cover: 'assets/images/stay-10-cover.webp',
      coverFallback: 'assets/images/stay-10-cover.jpg',
      coverAlt: 'Converted weathered-timber Amber Orchard Barn Stay surrounded by sunlit grapevines at golden hour',
      gallery: [
        {
          src: 'assets/images/stay-10-g1.webp',
          fallback: 'assets/images/stay-10-g1.jpg',
          alt: 'Double-height barn living room with reclaimed oak trusses, steel-grid windows and linen sofa',
          caption: 'Six-metre reclaimed teak-and-oak trusses flooded with late-afternoon vineyard gold'
        },
        {
          src: 'assets/images/stay-10-g2.webp',
          fallback: 'assets/images/stay-10-g2.jpg',
          alt: 'Mezzanine barn bedroom with terracotta and flax linen bed overlooking sunlit vineyard rows',
          caption: 'Lofted primary bedroom dressed in hand-dyed madder-terracotta linen'
        },
        {
          src: 'assets/images/stay-10-g3.webp',
          fallback: 'assets/images/stay-10-g3.jpg',
          alt: 'Farmhouse gourmet kitchen with butcher-block island, copper pans and handmade ceramics',
          caption: 'Chef’s farmhouse kitchen with Mauviel copperware and organic kitchen-garden herbs'
        },
        {
          src: 'assets/images/stay-10-g4.webp',
          fallback: 'assets/images/stay-10-g4.jpg',
          alt: 'Vine-draped pergola dining terrace beside converted barn overlooking golden vineyards at sunset',
          caption: 'Long timber harvest table beneath a bougainvillea and grapevine pergola'
        }
      ],
      description: [
        'Converted from an agricultural drying barn on a boutique biodynamic vineyard and fig orchard north of Nashik, Amber Orchard celebrates slow culinary living. Tall Crittall-style steel windows frame neat rows of Chenin Blanc and Shiraz backed by the jagged silhouette of the Ramshej hills.',
        'Pick heirloom tomatoes and basil from the kitchen garden at noon, borrow two vintage Dutch bicycles to pedal quiet orchard lanes, and gather at dusk around the outdoor clay pizza oven.'
      ],
      goodToKnow: [
        'Complimentary cellar tasting & two chilled estate bottles waiting on arrival.',
        'Fully equipped chef’s kitchen + outdoor wood-fired Neapolitan pizza oven.',
        'Two vintage cruiser bicycles included.',
        'Fast 11 kW EV charger beside the barn courtyard.'
      ],
      houseRules: {
        checkIn: '14:00 – 20:00',
        checkOut: '11:30',
        items: [
          'Dogs welcome; keep leashed near working tractor lanes during harvest',
          'Wood-fired oven instructions provided on kitchen card',
          'Outdoor music kept mellow after 22:30',
          'No smoking inside the timber barn'
        ]
      },
      host: {
        name: 'Farhan & Shireen Irani',
        since: '2021',
        badge: 'Biodynamic Vintners',
        responseRate: '98%',
        responseTime: 'within 1 hour',
        bio: 'Small-batch natural winemakers & culinary hosts cultivating chemical-free orchards.'
      },
      reviews: [
        { guest: 'Neha & Mihir', date: 'Oct 2026', rating: 5, trip: 'Foodie Weekend', comment: 'Dream kitchen! Making wood-fired fig & goat-cheese flatbreads at sunset overlooking the vines was heaven.' },
        { guest: 'Cyrus Daruwalla', date: 'Feb 2026', rating: 4.9, trip: 'Family Harvest Stay', comment: 'So warm, sunlit, and unpretentious. Best three-hour drive from Mumbai.' },
        { guest: 'Pooja N.', date: 'Jan 2026', rating: 5, trip: 'Girls Trip', comment: 'Every corner looks straight out of an editorial magazine yet feels genuinely lived-in and cosy.' }
      ]
    },
    {
      id: 'stay-11',
      slug: 'tideglass-beach-hut',
      title: 'Tideglass Beach Hut',
      tagline: 'Elevated driftwood & lime-plaster sanctuary above an untouched golden cove.',
      location: 'Cola North Headland, Goa-Style Coast',
      region: 'Konkan & Goa Coast',
      coordinates: { lat: 15.064, lng: 73.968 },
      category: 'floating',
      categoryLabel: 'Coastal Dune Hut',
      pricePerNight: 230,
      cleaningFee: 40,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.94,
      reviewCount: 83,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: true,
      featured: false,
      createdAt: '2026-09-11',
      scarcitySeed: 5,
      weather: { temp: '28°C', label: 'Warm Salt Breeze' },
      bestSeason: 'Oct – Apr',
      elevation: '14 m',
      amenities: ['Wi-Fi', 'Pet-friendly', 'Lake view'],
      cover: 'assets/images/stay-11-cover.webp',
      coverFallback: 'assets/images/stay-11-cover.jpg',
      coverAlt: 'Elevated driftwood and palm-thatch Tideglass Beach Hut tucked in casuarina dunes above a golden Goa cove at sunset',
      gallery: [
        {
          src: 'assets/images/stay-11-g1.webp',
          fallback: 'assets/images/stay-11-g1.jpg',
          alt: 'Lime-plaster coastal hut lounge with reclaimed teak doors wide open to golden ocean horizon',
          caption: 'Breathable hand-trowelled shell-lime walls and reclaimed boat-teak shutters'
        },
        {
          src: 'assets/images/stay-11-g2.webp',
          fallback: 'assets/images/stay-11-g2.jpg',
          alt: 'Coastal cabin bedroom with billowing sheer linen canopy bed and open wooden shutters facing surf',
          caption: 'Fall asleep to the low rhythmic hush of Arabian Sea swells below the dune'
        },
        {
          src: 'assets/images/stay-11-g3.webp',
          fallback: 'assets/images/stay-11-g3.jpg',
          alt: 'Open-air coastal garden shower and warm terrazzo soaking tub framed by palms and laterite stone',
          caption: 'Private walled palm-court bath with warm terrazzo soaking basin and brass rain shower'
        },
        {
          src: 'assets/images/stay-11-g4.webp',
          fallback: 'assets/images/stay-11-g4.jpg',
          alt: 'Private dune deck view down onto untouched crescent beach and golden-hour ocean surf at sunset',
          caption: 'Private laterite steps wind straight down to a quiet freshwater lagoon & sea cove'
        }
      ],
      description: [
        'Far removed from beach-club neon, Tideglass sits tucked among whispering casuarina pines where a freshwater creek meets a hidden South Goa crescent cove. Crafted from salvaged fishing-trawler teak, woven coconut thatch, and breathable oyster-shell lime plaster, it honours old Konkan coastal wisdom.',
        'Swim at dawn when dolphins arc past the headland, rinse salt off under the warm palm-court brass shower, and watch amber sun sink straight into the Arabian Sea from your dune-top daybed.'
      ],
      goodToKnow: [
        'Private 45-step stone path leads directly down to a quiet, lifeguard-patrolled cove.',
        'Quiet inverter AC in bedroom + strong natural ocean cross-breeze.',
        'Two handcrafted wooden bodyboards & reef-safe sunscreen provided.',
        'Seasonal turtle-nesting beach 15 minutes south—red-filtered path lights protect hatchlings.'
      ],
      houseRules: {
        checkIn: '14:00 – 20:00',
        checkOut: '11:00',
        items: [
          'Keep exterior deck lights dimmed during Nov–Mar olive ridley turtle season',
          '1 beach-loving dog welcome',
          'Rinse sand at outdoor foot-tap before entering lime-plaster lounge',
          'No party speakers—surf sound only'
        ]
      },
      host: {
        name: 'Savio Fernandes',
        since: '2019',
        badge: 'Coastal Restorationist',
        responseRate: '99%',
        responseTime: 'within 1 hour',
        bio: 'Marine biologist & heritage carpenter reviving breathable lime-and-thatch coastal architecture.'
      },
      reviews: [
        { guest: 'Aisha Siddiqui', date: 'Oct 2026', rating: 5, trip: 'Slow Coast Week', comment: 'This is the Goa people dream still exists. Dolphins at 7 AM right from our coffee chairs!' },
        { guest: 'Rohan & Tia', date: 'Mar 2026', rating: 4.9, trip: 'Babymoon', comment: 'That terrazzo outdoor bath under swaying palms at dusk was pure bliss.' },
        { guest: 'Liam O’Connor', date: 'Jan 2026', rating: 5, trip: 'Remote Work', comment: 'Worked from the sea-facing teak desk with fiber Wi-Fi and surf breaks in between.' }
      ]
    },
    {
      id: 'stay-12',
      slug: 'snowpeak-igloo-lodge',
      title: 'Snowpeak Igloo Lodge',
      tagline: 'High-altitude thermal stone-and-glass dome at 3,820 metres in trans-Himalayan Spiti.',
      location: 'Chicham Rim, Spiti Valley',
      region: 'Spiti High Valleys',
      coordinates: { lat: 32.288, lng: 78.005 },
      category: 'domes',
      categoryLabel: 'High-Altitude Igloo Pod',
      pricePerNight: 390,
      cleaningFee: 65,
      serviceFeeRate: 0.12,
      taxRate: 0.08,
      rating: 4.99,
      reviewCount: 42,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      instantBook: false,
      featured: false,
      createdAt: '2026-10-22',
      scarcitySeed: 3, // Only 3 nights left this month
      weather: { temp: '-2°C', label: 'Crisp Indigo Alpenglow' },
      bestSeason: 'May – Nov',
      elevation: '3,820 m',
      amenities: ['Fireplace', 'Sauna', 'Off-grid'],
      cover: 'assets/images/stay-12-cover.webp',
      coverFallback: 'assets/images/stay-12-cover.jpg',
      coverAlt: 'Insulated dome-shaped natural stone and glass Snowpeak Igloo Lodge against snowy Spiti peaks at twilight',
      gallery: [
        {
          src: 'assets/images/stay-12-g1.webp',
          fallback: 'assets/images/stay-12-g1.jpg',
          alt: 'Curved warm interior of high-altitude igloo lodge with Tibetan rugs, glowing pellet stove and snow view',
          caption: 'Passive-solar thermal stone shell staying 23°C indoors even when outside drops below freezing'
        },
        {
          src: 'assets/images/stay-12-g2.webp',
          fallback: 'assets/images/stay-12-g2.jpg',
          alt: 'Insulated dome bedroom with yak-wool throw and arched window framing starlit snowy Spiti peaks',
          caption: 'Hand-loomed Spitian yak-wool throws and triple-glazed arched peak window'
        },
        {
          src: 'assets/images/stay-12-g3.webp',
          fallback: 'assets/images/stay-12-g3.jpg',
          alt: 'Heated dark slate bathroom with deep cedar soaking tub and steaming copper faucet inside mountain lodge',
          caption: 'Freeze-proof solar-glycol heated slate bath and deep cedar soaking tub'
        },
        {
          src: 'assets/images/stay-12-g4.webp',
          fallback: 'assets/images/stay-12-g4.jpg',
          alt: 'High-altitude panorama of Spiti Valley sculpted snow ridges bathed in golden alpenglow under indigo sky',
          caption: '6,000-metre Kanamo & Chau Chau Kang Nilda peaks glowing right outside your threshold'
        }
      ],
      description: [
        'Inspired by ancient Himalayan stone corbel shelters and modern passive-solar earthships, Snowpeak Igloo Lodge sits at 3,820 metres overlooking the dramatic Samba Lamba gorge near Chicham. Half-cradled into a south-facing limestone berm, its thick rammed-earth and slate thermal mass stores high-altitude sunshine all day and radiates silent warmth all night.',
        'Sip sea-buckthorn tisane beside the clean-burning pellet hearth, spot blue sheep (bharal) grazing snowy scree slopes through the lodge spotting scope, and step out under the clearest night sky on the subcontinent.'
      ],
      goodToKnow: [
        'Guests should acclimatise 1–2 nights in Kaza or Kalpa (below 3,200 m) prior to arrival.',
        'Supplemental medical-grade oxygen concentrator & pulse oximeter discreetly available on-site.',
        'Includes traditional Spitian barley-and-buckwheat breakfast and evening sea-buckthorn tea ritual.',
        'Spotting scope provided during winter snow-leopard tracking months.'
      ],
      houseRules: {
        checkIn: '13:00 – 17:00',
        checkOut: '10:30',
        items: [
          'Daylight arrival required due to high-mountain roads',
          'Walk slowly on your first afternoon and hydrate generously',
          'Zero-waste high-altitude protocol—all non-organics packed out cleanly',
          'Never approach or disturb high-altitude wildlife'
        ]
      },
      host: {
        name: 'Sonam Dorje',
        since: '2022',
        badge: 'Passive-Solar Pioneer',
        responseRate: '98%',
        responseTime: 'within 2 hours',
        bio: 'Spitian solar engineer & snow-leopard conservation tracker building fossil-free winter lodges.'
      },
      reviews: [
        { guest: 'Vikramaditya Joshi', date: 'Oct 2026', rating: 5, trip: 'Expedition Finale', comment: 'Minus 6°C outside, toastily barefoot on heated slate inside while watching alpenglow hit 6,000m peaks. A marvel.' },
        { guest: 'Hannah & Lukas', date: 'Sep 2026', rating: 5, trip: 'Himalayan Traverse', comment: 'Spotted a herd of 14 bharal from bed at sunrise! Sonam’s hospitality is deeply moving.' },
        { guest: 'Rhea Sengupta', date: 'Jun 2026', rating: 5, trip: 'Bucket List Stay', comment: 'Feels like inhabiting another planet—yet warm, safe, and exquisitely crafted.' }
      ]
    }
  ];

  // Helper: Format YYYY-MM-DD in local time
  function formatDateISO(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Helper: Read active non-cancelled user bookings from localStorage for a given stay
  function getUserBookedRanges(stayId) {
    try {
      const raw = localStorage.getItem('staynomad_bookings');
      if (!raw) return [];
      const list = JSON.parse(raw);
      return list.filter(b => b.stayId === stayId && b.status !== 'Cancelled');
    } catch (e) {
      return [];
    }
  }

  // Deterministic availability generator per stay & date so current month scarcity matches calendar!
  function isDateBooked(stay, dateStr) {
    if (!stay || !dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    if (target < today) return true; // Past dates unavailable

    // Check user's own saved bookings in localStorage
    const userRanges = getUserBookedRanges(stay.id);
    for (const r of userRanges) {
      if (dateStr >= r.checkIn && dateStr < r.checkOut) {
        return true;
      }
    }

    const sameMonth =
      target.getFullYear() === today.getFullYear() &&
      target.getMonth() === today.getMonth();

    const dayOfMonth = target.getDate();
    const stayNum = parseInt(stay.id.replace('stay-', ''), 10) || 1;

    if (sameMonth) {
      // Leave exact scarcitySeed open nights in the remaining days of the current month
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const remainingDays = [];
      for (let d = today.getDate(); d <= daysInMonth; d++) {
        remainingDays.push(d);
      }
      const openTarget = Math.min(stay.scarcitySeed || 5, remainingDays.length);
      // Pick contiguous/realistic open slots near mid/end of remaining month so user can easily book 2-3 nights!
      const startIdx = Math.min(2 + (stayNum % 3), Math.max(0, remainingDays.length - openTarget));
      const openSet = new Set(remainingDays.slice(startIdx, startIdx + openTarget));
      return !openSet.has(dayOfMonth);
    }

    // For future months: block realistic ~28% scattered weekend/midweek clusters
    const hash = (dayOfMonth * 13 + (target.getMonth() + 1) * 7 + stayNum * 19) % 17;
    return hash === 0 || hash === 1 || hash === 8 || hash === 9;
  }

  // Nightly dynamic rate (Fri/Sat golden weekend +12%)
  function getNightlyRate(stay, dateStr) {
    if (!stay) return 0;
    const d = new Date(dateStr + 'T00:00:00');
    const dow = d.getDay();
    if (dow === 5 || dow === 6) {
      return Math.round(stay.pricePerNight * 1.12);
    }
    return stay.pricePerNight;
  }

  // Live Scarcity Counter ("Only X nights left this month") computed straight from calendar!
  function getRemainingNightsThisMonth(stay) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let openCount = 0;
    for (let d = today.getDate(); d <= daysInMonth; d++) {
      const ds = formatDateISO(new Date(year, month, d));
      if (!isDateBooked(stay, ds)) {
        openCount++;
      }
    }
    return openCount;
  }

  // Find next open check-in + check-out pair (default 2 nights) for a stay
  function getNextAvailableRange(stay, nightsWanted) {
    const nights = nightsWanted || 2;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let offset = 1; offset <= 90; offset++) {
      const candidate = new Date(start);
      candidate.setDate(start.getDate() + offset);
      let ok = true;
      for (let n = 0; n < nights; n++) {
        const d = new Date(candidate);
        d.setDate(candidate.getDate() + n);
        if (isDateBooked(stay, formatDateISO(d))) {
          ok = false;
          break;
        }
      }
      if (ok) {
        const checkOut = new Date(candidate);
        checkOut.setDate(candidate.getDate() + nights);
        return {
          checkIn: formatDateISO(candidate),
          checkOut: formatDateISO(checkOut)
        };
      }
    }
    const fallbackIn = new Date(start);
    fallbackIn.setDate(start.getDate() + 14);
    const fallbackOut = new Date(start);
    fallbackOut.setDate(start.getDate() + 16);
    return {
      checkIn: formatDateISO(fallbackIn),
      checkOut: formatDateISO(fallbackOut)
    };
  }

  window.StayNomadData = {
    STAYS,
    CATEGORIES,
    DESTINATIONS,
    GUEST_STORIES,
    formatDateISO,
    isDateBooked,
    getNightlyRate,
    getRemainingNightsThisMonth,
    getNextAvailableRange
  };
})(window);

