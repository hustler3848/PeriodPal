
export type Location = {
  id: number;
  name: string;
  address: string;
  available_products: string[];
  open_hours: string;
  contact?: string;
  wheelchair_accessible: boolean;
  verified_by: "NGO" | "crowdsourced";
};

export const locations: Location[] = [
  {
    id: 1,
    name: 'Community Health Center',
    address: '123 Wellness Ave, Healthville, ST 12345',
    available_products: ['Sanitary Pads', 'Tampons'],
    open_hours: 'Mon-Fri 9am-5pm',
    contact: '555-123-4567',
    wheelchair_accessible: true,
    verified_by: 'NGO'
  },
  {
    id: 2,
    name: 'City Public Library',
    address: '456 Bookworm Rd, Readington, ST 67890',
    available_products: ['Sanitary Pads'],
    open_hours: 'Daily 10am-8pm',
    wheelchair_accessible: true,
    verified_by: 'crowdsourced'
  },
  {
    id: 3,
    name: 'The Hope Shelter',
    address: '789 Kindness Blvd, Compassion City, ST 54321',
    available_products: ['Sanitary Pads', 'Tampons', 'Menstrual Cups'],
    open_hours: '24/7',
    contact: 'https://hopeshelter.org',
    wheelchair_accessible: false,
    verified_by: 'NGO'
  },
  {
    id: 4,
    name: 'University Student Union',
    address: '101 College Dr, Academia, ST 13579',
    available_products: ['Sanitary Pads', 'Tampons', 'Reusable Pads'],
    open_hours: 'Mon-Sat 8am-10pm',
    wheelchair_accessible: true,
    verified_by: 'crowdsourced'
  },
];
