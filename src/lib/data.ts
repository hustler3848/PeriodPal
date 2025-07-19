
export type Location = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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
    latitude: 34.0522,
    longitude: -118.2437,
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
    latitude: 34.0600,
    longitude: -118.2500,
    available_products: ['Sanitary Pads'],
    open_hours: 'Daily 10am-8pm',
    contact: '555-987-6543',
    wheelchair_accessible: true,
    verified_by: 'crowdsourced'
  },
  {
    id: 3,
    name: 'The Hope Shelter',
    address: '789 Kindness Blvd, Compassion City, ST 54321',
    latitude: 34.0450,
    longitude: -118.2300,
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
    latitude: 34.0722,
    longitude: -118.2637,
    available_products: ['Sanitary Pads', 'Tampons', 'Reusable Pads'],
    open_hours: 'Mon-Sat 8am-10pm',
    contact: '555-555-5555',
    wheelchair_accessible: true,
    verified_by: 'crowdsourced'
  },
   {
    id: 5,
    name: "Kathmandu Women's Aid",
    address: "Thamel, Kathmandu, Nepal",
    latitude: 27.7172,
    longitude: 85.3240,
    available_products: ["Sanitary Pads", "Reusable Pads"],
    open_hours: "Sun-Fri 10am-4pm",
    contact: "+977-1-4411222",
    wheelchair_accessible: false,
    verified_by: "NGO"
  },
  {
    id: 6,
    name: "Pokhara Youth Center",
    address: "Lakeside, Pokhara, Nepal",
    latitude: 28.2146,
    longitude: 83.9613,
    available_products: ["Sanitary Pads"],
    open_hours: "Daily 11am-6pm",
    contact: "+977-61-522333",
    wheelchair_accessible: true,
    verified_by: "crowdsourced"
  }
];
