import {
  CalendarDays,
  Car,
  Crown,
  Dog,
  Mail,
  MapPin,
  Music,
  Phone,
  ShieldCheck,
  Star,
  Store,
  Trophy,
  Users,
} from "lucide-react";

export const eventInfo = {
  date: "Saturday, Oct 17, 2026",
  time: "Doors open 11AM - 9PM",
  venue: "9205 E Independence Blvd",
  address: "Matthews, NC 28105",
  phone: "704.449.5212",
  email: "contact@CarolinaClassicsCarshow.com",
};

export const quickInfo = [
  [CalendarDays, eventInfo.date, eventInfo.time],
  [MapPin, eventInfo.venue, eventInfo.address],
  [Crown, "All Ages Welcome", "Over 20 awards, trophies & cash prizes"],
];

export const packages = [
  {
    name: "Diamond",
    price: "$10,000",
    amount: 10000,
    tag: "Exclusive / 1 Available",
    glow: "from-blue-500 to-cyan-300",
    perks: ["Presented By naming rights", "Main stage recognition", "Largest logo on all marketing", "Premier booth location", "Social media campaign", "VIP access for 10", "Product showcase", "Included in media & press"],
  },
  {
    name: "Platinum",
    price: "$5,000",
    amount: 5000,
    tag: "High Visibility",
    glow: "from-zinc-400 to-white",
    perks: ["Large logo on marketing", "Premium booth location", "Social media features", "Stage mentions", "VIP access for 6", "Swag bag inclusion", "Logo on website & signage"],
  },
  {
    name: "Gold",
    price: "$2,500",
    amount: 2500,
    tag: "Solid Exposure",
    glow: "from-yellow-500 to-amber-200",
    perks: ["Medium logo on marketing", "Booth space", "Social media mentions", "Logo on select signage", "4 general admission tickets", "Program inclusion", "Swag bag inclusion"],
  },
  {
    name: "Silver",
    price: "$1,000",
    amount: 1000,
    tag: "Great Value",
    glow: "from-slate-300 to-zinc-500",
    perks: ["Small logo on marketing", "Shared booth option", "1-2 social media mentions", "Logo on website", "2 general admission tickets", "Name in event program"],
  },
];

export const features = [
  [Car, "Custom Cars"],
  [ShieldCheck, "Classics"],
  [Star, "Exotics"],
  [Music, "Live DJs"],
  [Users, "Models"],
  [Store, "Vendors"],
  [Dog, "Puppy Vendors"],
  [Trophy, "Awards"],
];

export const sponsorLogos = [
  "Diamond Sponsor",
  "Platinum Sponsor",
  "Gold Sponsor",
  "Silver Sponsor",
  "Food Truck Partner",
  "Media Partner",
  "Auto Club Partner",
  "Community Partner",
];

export const heroSponsors = [
  "Porsche Charlotte",
  "Freedom Auto",
  "Detail Kings",
  "Carolina Wraps",
  "Queen City Customs",
  "Street Society",
  "Luxury Wheel Co.",
  "Elite Tint",
];

export const tickerSponsors = [
  "Diamond Sponsor Available",
  "Porsche Charlotte",
  "Carolina Wraps",
  "Detail Kings",
  "Street Society",
  "Luxury Wheel Co.",
  "Food Truck Partners",
  "Media Partners",
  "Vendor Spots Open",
  "Sponsor Now",
];

export const ticketOptions = [
  {
    name: "General Admission",
    price: "$10",
    amount: 10,
    envKey: "VITE_STRIPE_GENERAL_ADMISSION_URL",
    perks: ["Event access", "Live DJs", "Vendor village", "Car competition viewing"],
    glow: "from-zinc-700 to-zinc-400",
  },
  {
    name: "VIP Admission",
    price: "$50",
    amount: 50,
    envKey: "VITE_STRIPE_VIP_ACCESS_URL",
    perks: ["VIP lounge", "Fast entry", "Premium viewing area", "VIP badge & swag"],
    glow: "from-yellow-500 to-amber-200",
  },
];

export const contactIcons = { Phone, Mail };
