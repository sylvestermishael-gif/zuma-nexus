export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Starters' | 'Mains' | 'Desserts' | 'Sides';
  tags: string[];
  image: string;
}

export const MENU_DATA: Dish[] = [
  {
    id: '1',
    name: 'Glazed Wagyu Beef',
    description: 'A5 Wagyu beef seared over charcoal with black garlic reduction.',
    price: 125000,
    category: 'Mains',
    tags: ['GF', 'Signature'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '2',
    name: 'Chilled Scallops',
    description: 'Fresh Hokkaido scallops served with warm marrow butter and sea salt.',
    price: 65000,
    category: 'Starters',
    tags: ['Seafood'],
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    name: 'Roasted Carrots',
    description: 'Rainbow carrots roasted in hot coals with honey-miso glaze and pine nuts.',
    price: 42000,
    category: 'Sides',
    tags: ['V', 'GF'],
    image: 'https://images.unsplash.com/photo-1467453272184-718ad468840b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '4',
    name: 'Roasted Bone Marrow',
    description: 'Rich roasted bone marrow served with sourdough crisps and truffle oil.',
    price: 55000,
    category: 'Starters',
    tags: ['Rich'],
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdead059?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '5',
    name: 'Mango Sorbet',
    description: 'Refreshing mango sorbet with a hint of chili and fruit accents.',
    price: 25000,
    category: 'Desserts',
    tags: ['V', 'GF'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '6',
    name: 'Beef Suya',
    description: 'Premium beef strips seared at high heat with traditional spicy peanut seasoning.',
    price: 85000,
    category: 'Mains',
    tags: ['Spicy', 'Local'],
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '7',
    name: 'Steamed Moi Moi',
    description: 'Traditional bean soufflé steamed in leaves with shrimp and pepper emulsion.',
    price: 35000,
    category: 'Starters',
    tags: ['Local', 'V'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '8',
    name: 'Egusi & Pounded Yam',
    description: 'Traditional egusi soup served with butter-poached lobster and soft pounded yam.',
    price: 95000,
    category: 'Mains',
    tags: ['Luxury', 'Local'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '9',
    name: 'Groundnut Soup & Semo',
    description: 'Velvety groundnut soup with garden egg, served with light semolina.',
    price: 55000,
    category: 'Mains',
    tags: ['Rich', 'Local'],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1000'
  }
];
