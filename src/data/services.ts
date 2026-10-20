import { ServiceItem } from '@/types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'turnkey-recycling-plants',
    slug: 'complete-plastic-recycling-plant-solutions',
    title: 'Complete Plastic Recycling Plant Solutions',
    shortDescription: 'Turnkey recycling plants customized to your waste stream, factory layout, and capacity targets from 250 kg/h to 5000 kg/h.',
    fullDescription: 'ABS Polymers engineers complete, integrated plastic recycling plants engineered from the ground up for maximum throughput and low energy consumption. From initial scrap shredding, magnetic separation, high-temperature friction washing, closed-loop water treatment, and high-speed dewatering to pneumatic transport and extrusion compounding, we deliver complete automated systems configured for your specific polymer mix.',
    iconName: 'Factory',
    processSteps: [
      { step: 1, title: 'Scrap Assessment & Capacity Planning', description: 'Analysis of plastic scrap type (rigids, films, drums, bags), contamination levels, and target output volume.' },
      { step: 2, title: 'Factory Layout & CAD Engineering', description: 'Optimized machinery footprint design, taking advantage of our 10 FT compact washing system to conserve valuable floor space.' },
      { step: 3, title: 'Precision Fabrication & Testing', description: 'SS 302 fabrication, dynamic balancing of rotors, and factory trial run under full motor electrical load.' },
      { step: 4, title: 'On-Site Commissioning & Handover', description: 'Mechanical installation, electrical synchronization, operator training, and water recycling system balance.' }
    ],
    deliverables: [
      'Tailored turnkey line architecture',
      'Civil and electrical load layouts',
      'Havells electrical panel boards and safety starters',
      'Water management and filtration integration',
      'Operator standard operating procedures (SOP) and maintenance manuals'
    ],
    image: '/images/hero-reference.jpg'
  },
  {
    id: 'custom-machinery-design',
    slug: 'custom-machinery-design-and-engineering',
    title: 'Custom Machinery Design & Engineering',
    shortDescription: 'Bespoke machinery modifications, custom conveyor lengths, specialized cutting rotors, and high-temperature washing chambers.',
    fullDescription: 'Every recycling business has unique floor layouts, ceiling heights, and polymer feed characteristics. Our engineering team in Coimbatore customizes grinder cutting chambers, screw flight pitches, heating capacities, and water recycling circuits to meet exact customer specifications.',
    iconName: 'Settings',
    processSteps: [
      { step: 1, title: 'Requirements Definition', description: 'Clarifying throughput, polymer melt index, flake size, and facility space limitations.' },
      { step: 2, title: '3D CAD Modeling', description: 'Structural engineering, stress simulation, and clearance optimization.' },
      { step: 3, title: 'Custom Tooling & Assembly', description: 'Heavy MS/SS fabrication, specialized blade hardening, and drive sizing.' },
      { step: 4, title: 'Prototype & Field Trial', description: 'Verification of cutting efficiency, power draw, and output purity.' }
    ],
    deliverables: [
      'Tailored conveyor lengths & intake hoppers',
      'Specialized blade geometries for soft film vs. rigid lumps',
      'Upgraded water pumps and heating elements for heavy contamination'
    ],
    image: '/images/hero-reference.jpg'
  },
  {
    id: 'installation-commissioning',
    slug: 'installation-and-commissioning',
    title: 'Installation & On-Site Commissioning',
    shortDescription: 'Professional on-site machinery assembly, electrical connection, cold & hot trial runs across India and the UAE.',
    fullDescription: 'Our experienced industrial technicians travel to your facility to supervise uncrating, foundation anchoring, electrical wiring of Havells motors, plumbing connections, and initial material trials. We ensure the plant achieves rated capacity before final client handover.',
    iconName: 'Wrench',
    processSteps: [
      { step: 1, title: 'Pre-Delivery Site Preparation', description: 'Reviewing foundation, 380V/415V power supply, and water line readiness.' },
      { step: 2, title: 'Mechanical Erection', description: 'Leveling, alignment of screw conveyors, blower ducting, and washing tanks.' },
      { step: 3, title: 'Electrical & Automation Hookup', description: 'Wiring motors, control consoles, thermal overload relays, and emergency stops.' },
      { step: 4, title: 'Trial Run with Real Scrap', description: 'Tuning water temperature to 60-80°C and verifying clean flake output.' }
    ],
    deliverables: [
      'Site readiness checklist',
      'Certified mechanical & electrical commissioning sign-off',
      'Staff hands-on operational training'
    ],
    image: '/images/hero-reference.jpg'
  },
  {
    id: 'spare-parts-support',
    slug: 'genuine-spare-parts-and-components',
    title: 'Genuine Spare Parts & Wear Components',
    shortDescription: 'Prompt supply of EN41 hardened blades, screen meshes, Havells motor replacements, screw flights, and heating elements.',
    fullDescription: 'Keep machine downtime to an absolute minimum with direct manufacturer replacement parts. We stock precision-ground EN41 steel crusher knives, perforated 20mm screen meshes, SS 302 washing tank liners, heater elements, and OEM Havells electrical starters.',
    iconName: 'Package',
    processSteps: [
      { step: 1, title: 'Part Identification', description: 'Matching machine model number (e.g. G1000, W500, CR750) and component serial.' },
      { step: 2, title: 'Quality Inspection', description: 'Tolerance checks, Rockwell hardness testing on cutting blades, and dimensional verification.' },
      { step: 3, title: 'Priority Dispatch', description: 'Fast dispatch from Coimbatore warehouse across India and air-freight/sea-cargo to UAE.' }
    ],
    deliverables: [
      'EN41 high-wear alloy cutting blades',
      'Heavy-gauge perforated screen plates',
      'Havells motors, starters, and contactors',
      'Dynamically balanced blower impellers and conveyor screws'
    ],
    image: '/images/hero-reference.jpg'
  },
  {
    id: 'maintenance-after-sales',
    slug: 'preventive-maintenance-and-after-sales-support',
    title: 'Preventive Maintenance & After-Sales Support',
    shortDescription: 'Scheduled technical checkups, blade resharpening assistance, and remote diagnostic guidance.',
    fullDescription: 'ABS Polymers stands firmly behind every machine manufactured. Our service team offers periodic maintenance inspection plans, bearing lubrication protocols, blade sharpening angles consultation, and telephone/video troubleshooting to ensure 24/7 uptime for your recycling line.',
    iconName: 'Headphones',
    processSteps: [
      { step: 1, title: 'Preventive Schedule Setup', description: 'Customized maintenance schedule tailored to operating hours and polymer abrasive load.' },
      { step: 2, title: 'Technical Inspection Visits', description: 'Vibration monitoring, electrical amp draw verification, and wear analysis.' },
      { step: 3, title: 'Rapid Technical Assistance', description: 'Direct helpline support with senior machinery engineers.' }
    ],
    deliverables: [
      'Preventive maintenance logbooks',
      'Blade sharpening angle guidelines',
      'Fast-track warranty and service response'
    ],
    image: '/images/hero-reference.jpg'
  }
];
