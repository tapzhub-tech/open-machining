// KPI Data
export const kpiData = [
  {
    title: "Vendors Registered",
    value: "132",
    iconName: "Search",
    color: "text-blue-600",
  },
  {
    title: "Machines on Floor",
    value: "132",
    iconName: "Factory",
    color: "text-yellow-600",
  },
  {
    title: "Technical Staff",
    value: "240",
    iconName: "Users",
    color: "text-green-600",
  },
  {
    title: "CNC Programmers",
    value: "103",
    iconName: "Globe",
    color: "text-red-600",
  },
];

// Industry Distribution Data
export const industryData = [
  { name: "Automotive", count: 20 },
  { name: "Energy & Power", count: 20 },
  { name: "Automation & Robotics", count: 20 },
  { name: "Consumer Products", count: 18 },
  { name: "Medical Devices", count: 17 },
  { name: "Aerospace", count: 13 },
];

// Machine Type Data
export const machineTypeData = [
  { name: "Turn", count: 71 },
  { name: "Milling", count: 36 },
  { name: "Wire Cutting", count: 12 },
  { name: "Grinding", count: 11 },
  { name: "5-Axis", count: 2 },
];

// State Data
export const stateData = [
  { name: "Unknown", count: 7 },
  { name: "Karnataka", count: 7 },
  { name: "Goa", count: 4 },
];

// Vendor Data Types
export interface Vendor {
  name: string;
  location: string;
  machines: number;
  staff: number;
  programmers: number;
  industries: string[];
}

// Vendor Register Data
export const vendorsData: Vendor[] = [
  {
    name: "MICROGRADE TOOLS",
    location: "Ambernath, Maharashtra",
    machines: 16,
    staff: 26,
    programmers: 3,
    industries: [
      "Aerospace",
      "Medical Devices",
      "Energy & Power",
      "Consumer Products",
      "Automation & Robotics",
    ],
  },
  {
    name: "JASRAJ MULTITECH CNC INDIA PVT LTD",
    location: "N/A",
    machines: 16,
    staff: 12,
    programmers: 5,
    industries: ["Consumer Products", "Automation & Robotics"],
  },
];

// Geographic Callout Text
export const geographicCallout =
  "The register is Maharashtra-concentrated — a Kolhapur-Thane-Ambernath-Navi Mumbai industrial corridor accounts for the large majority of listed capacity.";