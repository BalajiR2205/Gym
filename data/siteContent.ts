// Site configurations and content definitions
export const SITE_NAME = "Be Strong";
export const BRAND_TAGLINE = "UNISEX FITNESS CENTER";
export const HERO_SUBHEADING = "Welcome to Be Strong Gym A/C, where limits are shattered. Join an elite community, train with industry experts, and experience a state-of-the-art facility designed to push you to the next level.";

// Contact Details (configured with new values)
export const PHONE_NUMBER = "9063906499";
export const ADDRESS = "Be Strong Gym A/C, Unisex Fitness Center";
export const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.083117985202!2d79.45644747521611!3d13.652707699579754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b000bbc9153%3A0x38bf77aef0bb95f6!2sBe%20Strong%20Gym!5e0!3m2!1sen!2sin!4v1782724787993!5m2!1sen!2sin";
export const WHATSAPP_NUMBER = "+916302984054";
export const EMAIL = "contact@bestronggym.com";

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
};

export const WORKING_HOURS = {
  weekdays: "Monday–Saturday 5:00 AM–10:00 PM",
  sunday: "Sunday 6:00 AM–8:00 PM",
};

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "monthly",
    name: "General Access",
    price: "₹1,999",
    duration: "1 Month",
    features: [
      "Access to all equipment",
      "Locker facility",
      "Trainer guidance",
      "Free fitness assessment",
    ],
  },
  {
    id: "quarterly",
    name: "General Access",
    price: "₹4,999",
    duration: "3 Months",
    features: [
      "Access to all equipment",
      "Locker facility",
      "Trainer guidance",
      "Free fitness assessment",
      "1 free Personal Training session",
    ],
  },
  {
    id: "half-yearly",
    name: "General Access",
    price: "₹6,999",
    duration: "6 Months",
    isPopular: true,
    features: [
      "Access to all equipment",
      "Locker facility",
      "Trainer guidance",
      "Free fitness assessment",
      "Priority lockers",
      "2 free Personal Training sessions",
    ],
  },
  {
    id: "annual",
    name: "General Access",
    price: "₹9,999",
    duration: "12 Months",
    features: [
      "Access to all equipment",
      "Locker facility",
      "Trainer guidance",
      "Free fitness assessment",
      "Priority lockers",
      "Monthly body assessment",
      "5 free Personal Training sessions",
    ],
  },
];

export const PERSONAL_TRAINING_PLANS: MembershipPlan[] = [
  {
    id: "pt-monthly",
    name: "Personal Training",
    price: "₹5,999",
    duration: "1 Month",
    features: [
      "1-on-1 expert coaching",
      "Custom workout program",
      "Diet & nutrition planning",
      "Body posture correction",
      "Progress tracking & support",
    ],
  },
  {
    id: "pt-quarterly",
    name: "Personal Training",
    price: "₹14,999",
    duration: "3 Months",
    isPopular: true,
    features: [
      "1-on-1 expert coaching",
      "Custom workout program",
      "Diet & nutrition planning",
      "Body posture correction",
      "Progress tracking & support",
      "Accelerated transformation plan",
    ],
  },
];

export interface Facility {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const FACILITIES: Facility[] = [
  {
    id: "cardio",
    title: "Cardio Zone",
    description: "Premium treadmills, ellipticals, and stationary bikes for peak stamina.",
    iconName: "Activity",
  },
  {
    id: "weights",
    title: "Free Weights Area",
    description: "Extensive selection of dumbbells, barbells, and olympic lifting platforms.",
    iconName: "Dumbbell",
  },
  {
    id: "strength",
    title: "Strength Machines",
    description: "Advanced selectorized and plate-loaded machines for targeted muscle growth.",
    iconName: "Zap",
  },
  {
    id: "lockers",
    title: "Locker Rooms",
    description: "Secure lockers, refreshing showers, and grooming stations.",
    iconName: "ShieldCheck",
  },
  {
    id: "parking",
    title: "Parking",
    description: "Spacious, secure, and free parking for members.",
    iconName: "MapPin",
  },
  {
    id: "ac",
    title: "Air Conditioning",
    description: "Fully climate-controlled spaces to keep you cool during intense sessions.",
    iconName: "Wind",
  },
  {
    id: "diet",
    title: "Diet Consultation",
    description: "Customized nutrition guides created by certified dieticians.",
    iconName: "Apple",
  },
  {
    id: "security",
    title: "CCTV & Security",
    description: "24/7 surveillance and secure access control for peace of mind.",
    iconName: "Shield",
  },
];

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  certification: string;
  image: string;
  instagram: string;
}

export const TRAINERS: Trainer[] = [
  {
    id: "trainer-1",
    name: "Vikram Singh",
    specialty: "Strength & Conditioning",
    bio: "Passionate coach dedicated to building functional strength, endurance, and boosting mental resilience.",
    certification: "Certified Strength Coach",
    image: "/images/placeholder.jpg",
    instagram: "#",
  },
  {
    id: "trainer-2",
    name: "Rohan Malhotra",
    specialty: "Fat Loss & HIIT",
    bio: "Helping clients burn fat, tone up, and transform their metabolic health through dynamic workouts.",
    certification: "ACE Certified Trainer",
    image: "/images/placeholder.jpg",
    instagram: "#",
  },
  {
    id: "trainer-3",
    name: "Neha Sharma",
    specialty: "Mobility & Yoga",
    bio: "Specializing in athletic mobility, correcting posture, and restorative post-workout recovery practices.",
    certification: "RYT 200 Yoga Specialist",
    image: "/images/placeholder.jpg",
    instagram: "#",
  },
];

// Transformation Gallery (8 Items using placeholders)
export interface GalleryItem {
  id: string;
  image: string;
  title: string;
}

export const GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `gallery-${index + 1}`,
  image: "/images/placeholder.jpg",
  title: `Transformation ${index + 1}`,
}));
