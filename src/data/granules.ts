import { GranuleProduct } from '@/types';

export const GRANULE_CATEGORIES = [
  { id: 'hdpe', name: 'HDPE Granules', short: 'High-Density Polyethylene', description: 'Blow moulding, injection moulding, and extrusion grade recycled HDPE granules.' },
  { id: 'ldpe', name: 'LDPE Granules', short: 'Low-Density Polyethylene', description: 'Film grade and injection grade reprocessed LDPE granules.' },
  { id: 'pp', name: 'PP Granules', short: 'Polypropylene', description: 'Woven sack, homopolymer, and copolymer recycled PP granules.' },
  { id: 'abs', name: 'ABS Granules', short: 'Acrylonitrile Butadiene Styrene', description: 'High-impact engineering ABS reprocessed granules for automotive and electronics.' },
  { id: 'hips', name: 'HIPS Granules', short: 'High Impact Polystyrene', description: 'Sheet extrusion and injection moulding grade HIPS reprocessed granules.' },
  { id: 'gpps', name: 'GPPS Granules', short: 'General Purpose Polystyrene', description: 'High clarity and rigid reprocessed GPPS granules.' }
];

export const GRANULE_PRODUCTS: GranuleProduct[] = [
  {
    id: 'hdpe-blow-moulding-granules',
    slug: 'hdpe-blow-moulding-recycled-granules',
    name: 'Recycled HDPE Granules (Blow Moulding Grade)',
    materialType: 'HDPE',
    grade: 'BM-200 Series',
    appearance: 'Cylindrical uniform pellets, washed & degreased',
    colorsAvailable: ['Milky White', 'Natural', 'Blue', 'Black'],
    meltFlowIndex: '0.8 – 1.2 g/10min (190°C/2.16kg)',
    density: '0.952 g/cm³',
    tensileStrength: '22 MPa',
    shortDescription: 'Uniformly filtered, high-ESCR recycled HDPE pellets suitable for bottles, lubricant containers, and industrial drums.',
    overview: 'With over 35 years of specialized expertise in the plastic granules trading and manufacturing industry in Coimbatore, ABS Polymers supplies consistent, lab-tested recycled HDPE granules. Produced from selected post-industrial and thoroughly washed post-consumer scrap processed through continuous filtration and degreasing washing lines.',
    applications: [
      'Chemical and pesticide bottles (up to 5 litres)',
      'Lubricant oil and detergent containers',
      'Blow-moulded household containers',
      'HDPE pipe masterbatch blending'
    ],
    packaging: '25 kg PP woven laminated bags with inner liner',
    minOrderQuantity: '1,000 kg (1 Metric Ton)',
    status: 'available',
    image: '/images/hero-reference.jpg',
    verifiedSpecs: [
      { label: 'Base Polymer', value: 'High Density Polyethylene (100% Reprocessed)', status: 'verified' },
      { label: 'Filtration Mesh', value: 'Double 80/100 mesh screen during extrusion', status: 'verified' },
      { label: 'Source Scrap Type', value: 'Post-industrial drums and sorted hollow-ware', status: 'verified' },
      { label: 'Melt Flow Index (MFI)', value: '0.8 – 1.2 g/10min', status: 'verified' }
    ],
    metaTitle: 'Recycled HDPE Granules (Blow Moulding Grade) | ABS Polymers Coimbatore',
    metaDescription: 'High quality recycled HDPE granules from ABS Polymers, Coimbatore. 35+ years experience in plastic granules business. Uniform melt index, prompt delivery.',
    published: true
  },
  {
    id: 'pp-injection-grade-granules',
    slug: 'pp-injection-grade-recycled-granules',
    name: 'Recycled PP Granules (Injection Moulding Grade)',
    materialType: 'PP',
    grade: 'PP-INJ-350',
    appearance: 'Smooth uniform granules',
    colorsAvailable: ['Black', 'Grey', 'Red', 'Blue', 'Milky'],
    meltFlowIndex: '10 – 14 g/10min (230°C/2.16kg)',
    density: '0.905 g/cm³',
    shortDescription: 'Tough, high-flow reprocessed PP granules engineered for automotive battery casing, industrial crates, and household articles.',
    overview: 'Our reprocessed Polypropylene (PP) injection grade granules are manufactured under strict thermal control. Produced from clean battery casings and industrial polypropylene scrap, they deliver excellent impact resistance and smooth mould-cavity filling.',
    applications: [
      'Automotive battery containers and lids',
      'Industrial storage crates and fruit baskets',
      'Furniture components and household buckets',
      'Electrical switch boxes and enclosures'
    ],
    packaging: '25 kg bags / 500 kg jumbo bags on request',
    minOrderQuantity: '1 Metric Ton',
    status: 'available',
    image: '/images/hero-reference.jpg',
    verifiedSpecs: [
      { label: 'Base Polymer', value: 'Polypropylene Copolymer / Homopolymer blend', status: 'verified' },
      { label: 'Flow Index', value: 'MFI 10–14 g/10min', status: 'verified' },
      { label: 'Moisture Content', value: '< 0.15% after drying', status: 'verified' }
    ],
    metaTitle: 'Recycled PP Granules (Injection Grade) | ABS Polymers Coimbatore',
    metaDescription: 'Reprocessed Polypropylene PP granules for crates, battery boxes and industrial mouldings. ABS Polymers Coimbatore, India.',
    published: true
  },
  {
    id: 'ldpe-film-grade-granules',
    slug: 'ldpe-film-grade-recycled-granules',
    name: 'Recycled LDPE Granules (Film Grade)',
    materialType: 'LDPE',
    grade: 'LD-FLM-100',
    appearance: 'Transparent to honey / black pellets',
    colorsAvailable: ['Natural Semi-Clear', 'Amber', 'Black'],
    meltFlowIndex: '1.5 – 2.5 g/10min (190°C/2.16kg)',
    shortDescription: 'Flexible and clean reprocessed LDPE granules for general packaging films, garbage bags, and construction liners.',
    overview: 'Manufactured from clean washed agricultural film and packaging waste. Features good elongation and seal strength for blown film extrusion and sheet applications.',
    applications: [
      'Garbage and waste disposal bags',
      'Agricultural mulch film and canal liners',
      'Shrink and secondary bundling films',
      'Moulded flexible caps and plugs'
    ],
    packaging: '25 kg branded poly-lined bags',
    minOrderQuantity: '1 Metric Ton',
    status: 'available',
    image: '/images/hero-reference.jpg',
    verifiedSpecs: [
      { label: 'Material Source', value: 'Clean post-industrial stretch & agricultural film', status: 'verified' },
      { label: 'Tensile Elongation', value: '> 350%', status: 'verified' }
    ],
    metaTitle: 'Recycled LDPE Film Grade Granules | ABS Polymers',
    metaDescription: 'High quality recycled LDPE granules for blown film, garbage bags, and packaging sheet extrusion from ABS Polymers Coimbatore.',
    published: true
  },
  {
    id: 'abs-engineering-recycled-granules',
    slug: 'abs-engineering-recycled-granules',
    name: 'Reprocessed ABS Engineering Granules',
    materialType: 'ABS',
    grade: 'ABS-ENG-500',
    appearance: 'High gloss black and grey pellets',
    colorsAvailable: ['Jet Black', 'Light Grey', 'Custom Order'],
    meltFlowIndex: '15 – 22 g/10min (220°C/10kg)',
    shortDescription: 'High impact strength and dimensional stability engineering ABS pellets for electronic housings and automotive accessories.',
    overview: 'Engineered reprocessed ABS resin derived from sorted appliance shells and automotive interior components. Offers balanced stiffness, surface finish, and impact toughness.',
    applications: [
      'Home appliance housings and trims',
      'Automotive interior consoles and air vents',
      'Electronic enclosures and cable spools',
      'Luggage handles and protective cases'
    ],
    packaging: '25 kg moisture-barrier multi-wall bags',
    minOrderQuantity: '500 kg',
    status: 'available',
    image: '/images/hero-reference.jpg',
    verifiedSpecs: [
      { label: 'Polymer Type', value: 'Acrylonitrile Butadiene Styrene', status: 'verified' },
      { label: 'Izod Impact Strength', value: 'Verified upon batch testing', status: 'verified' }
    ],
    metaTitle: 'Reprocessed ABS Engineering Plastic Granules | ABS Polymers',
    metaDescription: 'High-impact reprocessed ABS plastic granules from ABS Polymers Coimbatore. Ideal for automotive parts and consumer electronics.',
    published: true
  }
];

