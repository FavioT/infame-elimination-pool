export interface Note {
  id: string;
  title: string;
  body: string;
  color: string;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NOTE_COLORS: { name: string; value: string }[] = [
  { name: 'Default',   value: '#ffffff' },
  { name: 'Coral',     value: '#f28b82' },
  { name: 'Peach',     value: '#fbbc04' },
  { name: 'Sand',      value: '#fff475' },
  { name: 'Mint',      value: '#ccff90' },
  { name: 'Teal',      value: '#a7ffeb' },
  { name: 'Denim',     value: '#cbf0f8' },
  { name: 'Lavender',  value: '#aecbfa' },
  { name: 'Grape',     value: '#d7aefb' },
  { name: 'Pink',      value: '#fdcfe8' },
  { name: 'Chestnut',  value: '#e6c9a8' },
];
