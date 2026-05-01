export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'primordial' | 'elemental' | 'afterglow' | 'libations';
  tags: string[];
  image: string;
}

export const MENU_DATA: Dish[] = [
  {
    id: '1',
    name: 'Obsidian Glazed Wagyu',
    description: 'A5 Wagyu beef seared over volcanic rock, finished with a black garlic and charcoal reduction.',
    price: 125000,
    category: 'primordial',
    tags: ['GF', 'Signature'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '2',
    name: 'Cryo-Scallops',
    description: 'Flash-frozen Hokkaido scallops, served with warm marrow butter and sea foam.',
    price: 65000,
    category: 'elemental',
    tags: ['Seafood'],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    name: 'Ember Roasted Carrots',
    description: 'Rainbow carrots buried in hot coals for 6 hours, topped with honey-miso glaze and pine nut soil.',
    price: 42000,
    category: 'elemental',
    tags: ['V', 'GF'],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '4',
    name: 'Cosmic Bone Marrow',
    description: 'Roasted marrow with sourdough crisps, infused with truffle oil and edible gold dust.',
    price: 55000,
    category: 'primordial',
    tags: ['Rich'],
    image: 'https://images.unsplash.com/photo-1552526879-11f173f4d088?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '5',
    name: 'Solar Flare Sorbet',
    description: 'Chili-infused mango sorbet with a popping candy "nebula" and liquid nitrogen display.',
    price: 25000,
    category: 'afterglow',
    tags: ['V', 'GF'],
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '6',
    name: 'Zuma Suya Synthesis',
    description: 'Black-angus beef strips flash-seared at 800°C, encrusted in atomic peanut yaji dust with a scent of charred cedar.',
    price: 85000,
    category: 'libations',
    tags: ['Spicy', 'Local'],
    image: 'https://images.unsplash.com/photo-1620921652168-31846b45f41d?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '7',
    name: 'Prism Moi Moi',
    description: 'Velvet bean soufflé steamed in solar-activated leaves, topped with a single cryo-shrimp and habanero emulsion.',
    price: 35000,
    category: 'elemental',
    tags: ['Local', 'V'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '8',
    name: 'Neon Egusi & Fufu Silk',
    description: 'Saffron-infused egusi puree with butter-poached lobster tail and elastic pounded yam ribbons.',
    price: 95000,
    category: 'libations',
    tags: ['Luxury', 'Local'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '9',
    name: 'Groundnut Fusion & Semo',
    description: 'A velvety groundnut reduction with garden egg accents, paired with cloud-light semolina discs.',
    price: 55000,
    category: 'libations',
    tags: ['Rich', 'Local'],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1000'
  }
];
