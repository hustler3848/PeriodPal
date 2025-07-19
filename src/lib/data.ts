
export type Location = {
  id: number;
  name: string;
  address: string;
  products: string[];
  hours: string;
  accessible: boolean;
};

export const locations: Location[] = [
  {
    id: 1,
    name: 'Community Health Center',
    address: '123 Wellness Ave, Healthville, ST 12345',
    products: ['Pads', 'Tampons'],
    hours: 'Mon-Fri 9am-5pm',
    accessible: true,
  },
  {
    id: 2,
    name: 'City Public Library',
    address: '456 Bookworm Rd, Readington, ST 67890',
    products: ['Pads'],
    hours: 'Daily 10am-8pm',
    accessible: true,
  },
  {
    id: 3,
    name: 'The Hope Shelter',
    address: '789 Kindness Blvd, Compassion City, ST 54321',
    products: ['Pads', 'Tampons', 'Menstrual Cups'],
    hours: '24/7',
    accessible: false,
  },
    {
    id: 4,
    name: 'University Student Union',
    address: '101 College Dr, Academia, ST 13579',
    products: ['Pads', 'Tampons'],
    hours: 'Mon-Sat 8am-10pm',
    accessible: true,
  },
];
