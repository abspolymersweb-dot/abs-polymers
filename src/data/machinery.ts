import { MachineryProduct } from '@/types';

export const MACHINERY_CATEGORIES = [
  { id: 'washing-plants', name: 'Plastic Washing Plants', description: 'Continuous high-efficiency washing, friction cleaning, and dewatering lines with closed-loop water recycling.' },
  { id: 'crushers-granulators', name: 'Plastic Crushers & Granulators', description: 'Heavy-duty size reduction machines with EN41 steel blades for plastic waste, regrind, and scrap.' },
  { id: 'conveyors', name: 'Screw Conveyors', description: 'Sturdy CR series continuous screw conveyors for clean flakes, scrap transport, and extruder feeding.' },
  { id: 'blowers', name: 'Material Transport Blowers', description: 'High-static-pressure MTB blowers for pneumatic conveying of flakes, granules, and regrind materials.' },
  { id: 'shredders', name: 'Industrial Shredders', description: 'Single and twin-shaft shredders for pre-cutting thick-walled plastics, purgings, and bulk containers.' },
  { id: 'pelletizing', name: 'Pelletizing & Extrusion Lines', description: 'Complete compounding and pelletizing extruders to produce premium-grade plastic granules.' },
];

export const MACHINERY_PRODUCTS: MachineryProduct[] = [
  {
    id: 'absw-washing-plant',
    slug: 'absw-plastic-washing-plant',
    name: 'ABSW Series Compact Plastic Washing Plant',
    series: 'ABSW Series (W250 – W5000)',
    category: 'washing-plants',
    shortDescription: 'High-efficiency 10 FT compact design plastic washing machine with closed-loop water recycling, hot washing, and rapid cleaning cycle.',
    overview: 'The ABSW Series Plastic Washing Plant is an advanced, high-performance industrial washing system engineered by ABS Polymers. Featuring an innovative 10 FT compact design compared to standard 30 FT conventional lines, it delivers unmatched space efficiency, reduced power consumption, and hot friction washing that removes oil, grease, germs, labels, and chemical contaminants. Equipped with Havells 3-phase motors and a multi-stage water recycling design, the plant significantly cuts operational costs and soap oil/caustic soda requirements while maintaining spotless output flakes ready for extrusion.',
    featured: true,
    highlightBadge: '10 FT Compact Design',
    heroImage: '/images/products/washing-plant-line.png',
    galleryImages: [
      '/images/products/washing-plant-line.png',
      '/images/hero-reference.jpg'
    ],
    brochureUrl: '/docs/abs-polymers-machinery-specifications.pdf',
    compatibleMaterials: ['PP', 'HDPE', 'LDPE', 'ABS*', 'HIPS*', 'GPPS*'],
    keyBenefits: [
      '10 FT Compact Footprint (Saves ~65% floor space compared to 30 FT conventional lines)',
      'Closed-Loop Water Recycling (Multiple reuses of water, drastically cutting freshwater needs)',
      'Reduces soap oil usage and minimizes caustic soda requirements',
      'Normal cleaning turnaround in ~10 minutes; color/material changeover in ~30 minutes',
      'Dual-temperature zone: 60°C–80°C hot washing removes stubborn contaminants; 120°C–140°C heating prepares chips directly for extrusion',
      'Constructed with industrial-grade SS 302 stainless steel contact parts for longevity',
      'Powered by trusted Havells motors and Havells starters on 380V 50Hz 3-Phase power',
      'Handles output material flake sizes from 1 mm to 25 mm'
    ],
    applications: [
      'Post-consumer HDPE bottle & drum washing',
      'Post-industrial PP woven bag and car battery casing washing',
      'LDPE agricultural film and packaging regrind cleaning',
      'Rigid plastic flake purification and oil de-greasing',
      'Pre-treatment before pelletizing and compounding extrusion'
    ],
    specColumns: [
      { key: 'capacityKgHr', label: 'Capacity', unit: 'kg/h' },
      { key: 'heaterPower', label: 'Heater Power' },
      { key: 'waterMotor', label: 'Water Motor' },
      { key: 'dryerMotor', label: 'Dryer Motor' },
      { key: 'secondWashingMotor', label: '2nd Washing Motor' },
      { key: 'waterCapacity', label: 'Water Capacity', unit: 'L' },
      { key: 'dimensions', label: 'Dimensions (L×W×H)', unit: 'mm' },
      { key: 'weight', label: 'Total Weight', unit: 'kg' },
    ],
    variants: [
      {
        modelNumber: 'W250',
        capacityKgHr: 250,
        motorPower: 'Water: 5HP | Dryer: HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 650,
        dimensionsMm: { length: 3048, width: 609, height: 2488 },
        specs: {
          heaterPower: '36 kW',
          waterMotor: '5 HP',
          dryerMotor: 'Standard HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '800 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '3048 × 609 × 2488 mm',
          weight: '650 kg'
        }
      },
      {
        modelNumber: 'W500',
        capacityKgHr: 500,
        motorPower: 'Water: 5HP | Dryer: 10HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1300,
        dimensionsMm: { length: 3658, width: 914, height: 2488 },
        specs: {
          heaterPower: '72 kW',
          waterMotor: '5 HP',
          dryerMotor: '10 HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '1600 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '3658 × 914 × 2488 mm',
          weight: '1,300 kg'
        }
      },
      {
        modelNumber: 'W750',
        capacityKgHr: 750,
        motorPower: 'Water: 5HP | Dryer: 15HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1500,
        dimensionsMm: { length: 4267, width: 1067, height: 2488 },
        specs: {
          heaterPower: '108 kW',
          waterMotor: '5 HP',
          dryerMotor: '15 HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '1900 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '4267 × 1067 × 2488 mm',
          weight: '1,500 kg'
        }
      },
      {
        modelNumber: 'W1000',
        capacityKgHr: 1000,
        motorPower: 'Water: 7HP | Dryer: 15HP | 2nd Wash: 10HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1800,
        dimensionsMm: { length: 4877, width: 1219, height: 2488 },
        specs: {
          heaterPower: '144 kW',
          waterMotor: '7 HP',
          dryerMotor: '15 HP',
          secondWashingMotor: '10 HP',
          waterCapacity: '2100 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '4877 × 1219 × 2488 mm',
          weight: '1,800 kg'
        }
      },
      {
        modelNumber: 'W1500',
        capacityKgHr: 1500,
        motorPower: 'Water: 10HP | Dryer: 20HP | 2nd Wash: 10HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 2200,
        dimensionsMm: { length: 5069, width: 1219, height: 2488 },
        specs: {
          heaterPower: '216 kW',
          waterMotor: '10 HP',
          dryerMotor: '20 HP',
          secondWashingMotor: '10 HP',
          waterCapacity: '2500 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '5069 × 1219 × 2488 mm',
          weight: '2,200 kg'
        }
      },
      {
        modelNumber: 'W2000',
        capacityKgHr: 2000,
        motorPower: 'Water: 10HP | Dryer: 20HP | 2nd Wash: 15HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 3000,
        dimensionsMm: { length: 5486, width: 2134, height: 2488 },
        specs: {
          heaterPower: '240 kW',
          waterMotor: '10 HP',
          dryerMotor: '20 HP',
          secondWashingMotor: '15 HP',
          waterCapacity: '3000 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '5486 × 2134 × 2488 mm',
          weight: '3,000 kg'
        }
      },
      {
        modelNumber: 'W3000',
        capacityKgHr: 3000,
        motorPower: 'Water: 5HP | Dryer: 10HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 650,
        dimensionsMm: { length: 3048, width: 609, height: 2488 },
        specs: {
          heaterPower: '360 kW',
          waterMotor: '5 HP',
          dryerMotor: '10 HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '800 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '3048 × 609 × 2488 mm',
          weight: '650 kg'
        }
      },
      {
        modelNumber: 'W4000',
        capacityKgHr: 4000,
        motorPower: 'Water: 5HP | Dryer: 10HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1300,
        dimensionsMm: { length: 3658, width: 914, height: 2488 },
        specs: {
          heaterPower: '480 kW',
          waterMotor: '5 HP',
          dryerMotor: '10 HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '1600 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '3658 × 914 × 2488 mm',
          weight: '1,300 kg'
        }
      },
      {
        modelNumber: 'W5000',
        capacityKgHr: 5000,
        motorPower: 'Water: 40HP | Dryer: 15HP | 2nd Wash: 5HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1500,
        dimensionsMm: { length: 4267, width: 1067, height: 2488 },
        specs: {
          heaterPower: '600 kW',
          waterMotor: '40 HP',
          dryerMotor: '15 HP',
          secondWashingMotor: '5 HP',
          waterCapacity: '1900 L',
          materialContact: 'SS 302',
          electricals: 'Havells Motor & Starter',
          dimensions: '4267 × 1067 × 2488 mm',
          weight: '1,500 kg'
        }
      }
    ],
    verifiedSpecs: [
      { label: 'Footprint Design', value: '10 FT Compact Design', status: 'verified' },
      { label: 'Material Contact Parts', value: 'SS 302 Stainless Steel', status: 'verified' },
      { label: 'Motor & Starter Brand', value: 'Havells (Standard across all models)', status: 'verified' },
      { label: 'Electrical System', value: '380V 50Hz 3-Phase', status: 'verified' },
      { label: 'Operating Washing Temp', value: '60°C – 80°C (Removes oil, grease, germs)', status: 'verified' },
      { label: 'Hot Air / Extrusion Prep Temp', value: '120°C – 140°C (Ready for extrusion)', status: 'verified' },
      { label: 'Material Size Range', value: '1 mm – 25 mm', status: 'verified' },
      { label: 'Normal Cleaning Turnaround', value: '~10 minutes', status: 'verified' },
      { label: 'Color / Material Changeover', value: '~30 minutes', status: 'verified' },
      { label: 'Water Pressure', value: 'High-speed water pressure circulation', status: 'verified' }
    ],
    awaitingConfirmationSpecs: [
      { label: 'W3000-W5000 Dimensions/Weight Notice', value: 'Page 3 of brochure shares dimension rows with W250-W750; flagged for physical verification with manufacturing team', status: 'awaiting_confirmation' },
      { label: 'Special Conveyor for ABS/HIPS/GPPS', value: 'Required for dense polymers due to sink-float specific gravity characteristics', status: 'awaiting_confirmation' }
    ],
    metaTitle: 'ABSW Series Compact Plastic Washing Plant (250-5000 kg/h) | ABS Polymers',
    metaDescription: 'Engineered in Coimbatore, India. ABSW Series compact 10 FT plastic washing machine featuring closed-loop water recycling, Havells electricals, and SS 302 construction.',
    published: true
  },
  {
    id: 'g-series-crusher',
    slug: 'g-series-plastic-crusher-machine',
    name: 'G Series Plastic Crusher & Granulator',
    series: 'G Series (G250 – G2000)',
    category: 'crushers-granulators',
    shortDescription: 'High-performance industrial size reduction machine with EN41 alloy steel blades, Havells 20HP–60HP motors, and 480 RPM heavy-duty drive.',
    overview: 'The G Series Plastic Crusher machine is a robust size-reduction powerhouse engineered for continuous industrial grinding of plastic scrap, regrind materials, lumps, and factory production reject. Available in capacities from 250 kg/h to 2000 kg/h, it is powered by heavy-duty 20 HP to 60 HP Havells motors and starters. The precision-machined cutting chamber and high-strength EN41 hardened steel blades ensure maximum wear resistance, clean shear cutting, minimal fines, and low operational maintenance.',
    featured: true,
    highlightBadge: 'Heavy-Duty EN41 Blades',
    heroImage: '/images/products/crusher-granulator.jpg',
    galleryImages: ['/images/products/crusher-granulator.jpg'],
    brochureUrl: '/docs/abs-polymers-machinery-specifications.pdf',
    compatibleMaterials: ['HDPE', 'LDPE', 'PP', 'ABS', 'HIPS', 'GPPS', 'Rigid Mouldings', 'Bottles & Crates'],
    keyBenefits: [
      'High-strength EN41 alloy steel blades provide exceptional cutting durability and wear resistance',
      'Operating rotational speed calibrated at 480 RPM for optimal shear force with minimal fines',
      'Minimum 20 mm high-flow screen mesh ensures uniform particle output size',
      'Grinding chamber dimensions scaled up to 1016 × 762 mm on G2000',
      'Equipped with 100% genuine Havells industrial motors and Havells starters',
      'Heavy-duty cast steel and plate framework weighing up to 2,700 kg for vibration-free continuous run'
    ],
    applications: [
      'Injection moulding runners, sprues, and reject parts',
      'Blow-moulded drums, carboys, cans, and bottles',
      'Plastic crates, pallets, and thermoformed sheet scrap',
      'Post-consumer plastic flakes preparation for washing plants'
    ],
    specColumns: [
      { key: 'capacityKgHr', label: 'Crushing Ability', unit: 'kg/h' },
      { key: 'chamberSize', label: 'Chamber Size (W×D)', unit: 'mm' },
      { key: 'motorPower', label: 'Motor Power' },
      { key: 'bladeMaterial', label: 'Blade Material' },
      { key: 'speedRpm', label: 'Speed', unit: 'RPM' },
      { key: 'screenMesh', label: 'Screen Mesh' },
      { key: 'dimensions', label: 'Dimensions (L×W×H)', unit: 'mm' },
      { key: 'weight', label: 'Total Weight', unit: 'kg' }
    ],
    variants: [
      {
        modelNumber: 'G250',
        capacityKgHr: 250,
        motorPower: '20 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 800,
        dimensionsMm: { length: 1580, width: 1100, height: 1850 },
        specs: {
          chamberSize: '600 × 480 mm',
          motorPower: '20 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '1580 × 1100 × 1850 mm',
          weight: '800 kg'
        }
      },
      {
        modelNumber: 'G500',
        capacityKgHr: 500,
        motorPower: '40 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1400,
        dimensionsMm: { length: 1670, width: 1250, height: 1850 },
        specs: {
          chamberSize: '762 × 533 mm',
          motorPower: '40 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '1670 × 1250 × 1850 mm',
          weight: '1,400 kg'
        }
      },
      {
        modelNumber: 'G750',
        capacityKgHr: 750,
        motorPower: '50 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 1600,
        dimensionsMm: { length: 1790, width: 1250, height: 1850 },
        specs: {
          chamberSize: '812 × 533 mm',
          motorPower: '50 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '1790 × 1250 × 1850 mm',
          weight: '1,600 kg'
        }
      },
      {
        modelNumber: 'G1000',
        capacityKgHr: 1000,
        motorPower: '50 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 2000,
        dimensionsMm: { length: 1950, width: 1250, height: 1850 },
        specs: {
          chamberSize: '914 × 533 mm',
          motorPower: '50 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '1950 × 1250 × 1850 mm',
          weight: '2,000 kg'
        }
      },
      {
        modelNumber: 'G1500',
        capacityKgHr: 1500,
        motorPower: '60 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 2200,
        dimensionsMm: { length: 1950, width: 1530, height: 1950 },
        specs: {
          chamberSize: '914 × 711 mm',
          motorPower: '60 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '1950 × 1530 × 1950 mm',
          weight: '2,200 kg'
        }
      },
      {
        modelNumber: 'G2000',
        capacityKgHr: 2000,
        motorPower: '60 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 2700,
        dimensionsMm: { length: 2240, width: 1590, height: 1950 },
        specs: {
          chamberSize: '1016 × 762 mm',
          motorPower: '60 HP',
          bladeMaterial: 'EN41 Steel',
          speedRpm: '480 RPM',
          screenMesh: 'Min 20 mm',
          electricals: 'Havells Motor & Starter',
          dimensions: '2240 × 1590 × 1950 mm',
          weight: '2,700 kg'
        }
      }
    ],
    verifiedSpecs: [
      { label: 'Blade Material', value: 'High-strength EN41 alloy steel', status: 'verified' },
      { label: 'Cutting Speed', value: '480 RPM constant speed drive', status: 'verified' },
      { label: 'Screen Mesh', value: 'Minimum 20 mm heavy-duty screen', status: 'verified' },
      { label: 'Motor & Starter Brand', value: 'Havells (20 HP – 60 HP ratings)', status: 'verified' },
      { label: 'Operating Voltage', value: '380V 50Hz 3-Phase', status: 'verified' },
      { label: 'Chamber Sizing', value: 'From 600×480 mm up to 1016×762 mm', status: 'verified' }
    ],
    metaTitle: 'G Series Plastic Crusher & Granulator (250-2000 kg/h) | ABS Polymers',
    metaDescription: 'Industrial plastic crusher and granulator from ABS Polymers Coimbatore. Featuring EN41 steel blades, Havells 20HP-60HP motors, 480 RPM, and rigid heavy fabrication.',
    published: true
  },
  {
    id: 'cr-screw-conveyor',
    slug: 'cr-series-screw-conveyor',
    name: 'CR Series Industrial Screw Conveyor',
    series: 'CR Series (CR250 – CR2000)',
    category: 'conveyors',
    shortDescription: 'Industrial screw conveyor with 5400 mm standard length, Havells motors & starters, and optimized 55–105 RPM material transfer speeds.',
    overview: 'The CR Series Screw Conveyor is specifically engineered for continuous, dust-free transfer of plastic flakes, granulate regrind, and scrap between shredders, washing plants, and dewatering units. Featuring a uniform 5400 mm length across all models, it provides dependable throughput from 250 kg/h to 2000 kg/h with screw outer diameters ranging from 152 mm to 300 mm. Built with Havells electric drives and durable heavy flighting, it ensures smooth and jam-free conveying.',
    featured: false,
    highlightBadge: 'Continuous Feed',
    heroImage: '/images/hero-reference.jpg',
    galleryImages: ['/images/hero-reference.jpg'],
    brochureUrl: '/docs/abs-polymers-machinery-specifications.pdf',
    compatibleMaterials: ['Plastic Flakes', 'Granules', 'Washed Scrap', 'Regrind Pellets'],
    keyBenefits: [
      'Standardized 5400 mm length simplifies plant integration and line layout design',
      'Robust Havells motors (7 HP to 20 HP) with Havells motor starters',
      'Operating rotational speeds from 55 to 105 RPM designed to prevent material heating or degradation',
      'Screw outer diameter scaled from 152 mm to 300 mm according to throughput requirements',
      'Vibration-free base structure engineered for continuous 24/7 industrial duty'
    ],
    applications: [
      'Transferring shredded plastic scrap into washing tanks',
      'Elevating washed plastic flakes to vertical dryers',
      'Feeding plastic flakes directly to pelletizing extruder hoppers'
    ],
    specColumns: [
      { key: 'capacityKgHr', label: 'Capacity', unit: 'kg/h' },
      { key: 'screwOd', label: 'Screw OD', unit: 'mm' },
      { key: 'motorPower', label: 'Motor Power' },
      { key: 'speedRpm', label: 'Speed', unit: 'RPM' },
      { key: 'dimensions', label: 'Dimensions (L×W×H)', unit: 'mm' },
      { key: 'weight', label: 'Weight', unit: 'kg' }
    ],
    variants: [
      {
        modelNumber: 'CR250',
        capacityKgHr: 250,
        motorPower: '7 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 320,
        dimensionsMm: { length: 5400, width: 300, height: 450 },
        specs: { screwOd: '152 mm', motorPower: '7 HP', speedRpm: '55 RPM', dimensions: '5400 × 300 × 450 mm', weight: '320 kg', electricals: 'Havells Motor & Starter' }
      },
      {
        modelNumber: 'CR500',
        capacityKgHr: 500,
        motorPower: '10 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 420,
        dimensionsMm: { length: 5400, width: 350, height: 500 },
        specs: { screwOd: '200 mm', motorPower: '10 HP', speedRpm: '60 RPM', dimensions: '5400 × 350 × 500 mm', weight: '420 kg', electricals: 'Havells Motor & Starter' }
      },
      {
        modelNumber: 'CR750',
        capacityKgHr: 750,
        motorPower: '10 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 450,
        dimensionsMm: { length: 5400, width: 350, height: 500 },
        specs: { screwOd: '200 mm', motorPower: '10 HP', speedRpm: '90 RPM', dimensions: '5400 × 350 × 500 mm', weight: '450 kg', electricals: 'Havells Motor & Starter' }
      },
      {
        modelNumber: 'CR1000',
        capacityKgHr: 1000,
        motorPower: '15 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 580,
        dimensionsMm: { length: 5400, width: 450, height: 600 },
        specs: { screwOd: '250 mm', motorPower: '15 HP', speedRpm: '70 RPM', dimensions: '5400 × 450 × 600 mm', weight: '580 kg', electricals: 'Havells Motor & Starter' }
      },
      {
        modelNumber: 'CR1500',
        capacityKgHr: 1500,
        motorPower: '15 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 620,
        dimensionsMm: { length: 5400, width: 450, height: 600 },
        specs: { screwOd: '250 mm', motorPower: '15 HP', speedRpm: '105 RPM', dimensions: '5400 × 450 × 600 mm', weight: '620 kg', electricals: 'Havells Motor & Starter' }
      },
      {
        modelNumber: 'CR2000',
        capacityKgHr: 2000,
        motorPower: '20 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 780,
        dimensionsMm: { length: 5400, width: 550, height: 750 },
        specs: { screwOd: '300 mm', motorPower: '20 HP', speedRpm: '90 RPM', dimensions: '5400 × 550 × 750 mm', weight: '780 kg', electricals: 'Havells Motor & Starter' }
      }
    ],
    verifiedSpecs: [
      { label: 'Standard Conveyor Length', value: '5400 mm across all CR models', status: 'verified' },
      { label: 'Motor & Starter Brand', value: 'Havells 380V 50Hz 3-Phase', status: 'verified' },
      { label: 'Screw Outer Diameter', value: '152 mm to 300 mm', status: 'verified' },
      { label: 'Operating Speed Range', value: '55 to 105 RPM', status: 'verified' }
    ],
    metaTitle: 'CR Series Screw Conveyor (250-2000 kg/h) | ABS Polymers Coimbatore',
    metaDescription: 'Industrial screw conveyor CR series for plastic recycling plants. Sturdy 5400mm design, Havells motors, low maintenance material handling.',
    published: true
  },
  {
    id: 'mtb-transport-blower',
    slug: 'mtb-material-transport-blower',
    name: 'MTB Series Material Transport Blower',
    series: 'MTB Series (MTB250 – MTB2000)',
    category: 'blowers',
    shortDescription: 'Heavy-duty pneumatic conveying blower with dynamically balanced MS impeller, 2880 RPM Havells drive, and up to 6500 m³/h air delivery.',
    overview: 'The Material Transport Blower (MTB Series) is engineered for efficient pneumatic conveying of plastic flakes, lightweight granules, and regrind materials across recycling facilities. Featuring a dynamically balanced MS impeller, heavy-duty fabricated steel housing, and high-efficiency direct-coupled 2880 RPM Havells motors, it reliably delivers static pressures up to 450 mmWG and airflow up to 6500 m³/h.',
    featured: false,
    highlightBadge: '2880 RPM Drive',
    heroImage: '/images/hero-reference.jpg',
    galleryImages: ['/images/hero-reference.jpg'],
    brochureUrl: '/docs/abs-polymers-machinery-specifications.pdf',
    compatibleMaterials: ['ABS', 'HIPS', 'PP', 'HDPE', 'LDPE', 'PET flakes'],
    keyBenefits: [
      'Dynamically balanced MS impeller prevents vibration and extends bearing service life',
      'Direct-coupled 2880 RPM Havells motor for zero belt slip and high energetic efficiency',
      'Generates static pressures from 250 to 450 mmWG for long-distance pipe transport',
      'Fitted with standard industrial pipe sizes from 100 mm (4”) up to 250 mm (10”)',
      'Heavy-duty fabricated MS base frame with industrial protective anti-corrosion coating'
    ],
    applications: [
      'Pneumatic transfer of washed flakes to drying silos',
      'Conveying pellets from extruder cutter heads to storage bins',
      'Dust and fines aspiration in plastic granulator discharge'
    ],
    specColumns: [
      { key: 'capacityKgHr', label: 'Capacity', unit: 'kg/h' },
      { key: 'pipeSize', label: 'Pipe Size', unit: 'mm' },
      { key: 'motorPower', label: 'Motor Power' },
      { key: 'airFlow', label: 'Air Flow', unit: 'm³/h' },
      { key: 'staticPressure', label: 'Static Pressure' },
      { key: 'dimensions', label: 'Dimensions (L×W×H)', unit: 'mm' },
      { key: 'weight', label: 'Weight', unit: 'kg' }
    ],
    variants: [
      {
        modelNumber: 'MTB250',
        capacityKgHr: 250,
        motorPower: '5 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 90,
        dimensionsMm: { length: 700, width: 500, height: 700 },
        specs: { pipeSize: '100 mm', motorPower: '5 HP', airFlow: '1800 m³/h', staticPressure: '250 mmWG', speedRpm: '2880 RPM', dimensions: '700 × 500 × 700 mm', weight: '90 kg' }
      },
      {
        modelNumber: 'MTB500',
        capacityKgHr: 500,
        motorPower: '7 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 120,
        dimensionsMm: { length: 800, width: 600, height: 800 },
        specs: { pipeSize: '125 mm', motorPower: '7 HP', airFlow: '2500 m³/h', staticPressure: '300 mmWG', speedRpm: '2880 RPM', dimensions: '800 × 600 × 800 mm', weight: '120 kg' }
      },
      {
        modelNumber: 'MTB750',
        capacityKgHr: 750,
        motorPower: '10 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 160,
        dimensionsMm: { length: 900, width: 700, height: 900 },
        specs: { pipeSize: '150 mm', motorPower: '10 HP', airFlow: '3500 m³/h', staticPressure: '350 mmWG', speedRpm: '2880 RPM', dimensions: '900 × 700 × 900 mm', weight: '160 kg' }
      },
      {
        modelNumber: 'MTB1000',
        capacityKgHr: 1000,
        motorPower: '10 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 180,
        dimensionsMm: { length: 1000, width: 700, height: 1000 },
        specs: { pipeSize: '150 mm', motorPower: '10 HP', airFlow: '4000 m³/h', staticPressure: '350 mmWG', speedRpm: '2880 RPM', dimensions: '1000 × 700 × 1000 mm', weight: '180 kg' }
      },
      {
        modelNumber: 'MTB1500',
        capacityKgHr: 1500,
        motorPower: '15 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 250,
        dimensionsMm: { length: 1200, width: 850, height: 1200 },
        specs: { pipeSize: '200 mm', motorPower: '15 HP', airFlow: '5500 m³/h', staticPressure: '400 mmWG', speedRpm: '2880 RPM', dimensions: '1200 × 850 × 1200 mm', weight: '250 kg' }
      },
      {
        modelNumber: 'MTB2000',
        capacityKgHr: 2000,
        motorPower: '20 HP',
        voltage: '380V 50Hz 3-Phase',
        weightKg: 320,
        dimensionsMm: { length: 1400, width: 1000, height: 1400 },
        specs: { pipeSize: '250 mm', motorPower: '20 HP', airFlow: '6500 m³/h', staticPressure: '450 mmWG', speedRpm: '2880 RPM', dimensions: '1400 × 1000 × 1400 mm', weight: '320 kg' }
      }
    ],
    verifiedSpecs: [
      { label: 'Impeller Construction', value: 'Dynamically balanced Mild Steel (MS)', status: 'verified' },
      { label: 'Operating Speed', value: '2880 RPM direct-coupled', status: 'verified' },
      { label: 'Motor & Starter Brand', value: 'Havells (380V / 415V 50Hz 3-Phase)', status: 'verified' },
      { label: 'Air Flow Range', value: '1800 m³/h to 6500 m³/h', status: 'verified' },
      { label: 'Static Pressure Range', value: '250 mmWG to 450 mmWG', status: 'verified' }
    ],
    awaitingConfirmationSpecs: [
      { label: 'Voltage Specification Note', value: 'Brochure text mentions 415V while variant table states 380V 50Hz; dual compatibility flagged for electrical confirmation', status: 'awaiting_confirmation' }
    ],
    metaTitle: 'MTB Material Transport Blower (250-2000 kg/h) | ABS Polymers',
    metaDescription: 'Industrial material transport blowers for pneumatic conveying of plastic flakes & regrind. 2880 RPM Havells drive, up to 6500 m3/h airflow.',
    published: true
  }
];

