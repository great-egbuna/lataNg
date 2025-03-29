import { ICategory } from "@/context/AppContext";
import { ImageSourcePropType } from "react-native";

import affiliate from "@/assets/images/affiliate.webp";
import agric from "@/assets/images/agric.svg";
import books from "@/assets/images/books.svg";
import children from "@/assets/images/children.svg";
import construction from "@/assets/images/construction.svg";
import dispatchRider from "@/assets/images/dispatch_rider.webp";
import electronics from "@/assets/images/electronics.svg";
import fashion from "@/assets/images/fashion.svg";
import furniture from "@/assets/images/furniture.svg";
import health from "@/assets/images/health.svg";
import homeAccessories from "@/assets/images/home_accessories.svg";
import jobs from "@/assets/images/jobs.svg";
import machinery from "@/assets/images/machinery.svg";
import medicals from "@/assets/images/medicals.svg";
import gadgets from "@/assets/images/gadgets.svg";
import property from "@/assets/images/property.svg";
import services from "@/assets/images/services.svg";
import sportsAndArts from "@/assets/images/sports_and_arts.svg";

import { images } from "./images";

export interface ICategoryWithImage extends ICategory {
  image: ImageSourcePropType;
  subcategories: { name: string; id: string }[];
}

export const categories: ICategoryWithImage[] = [
  {
    id: "1",
    name: "Affiliate",
    image: affiliate,
    subcategories: [],
  },
  {
    id: "2",
    name: "Agric & Food",
    image: agric,
    subcategories: [],
  },
  {
    id: "3",
    name: "Books",
    image: books,
    subcategories: [],
  },
  {
    id: "4",
    name: "Cars & Vehicles",
    image: images.lataLogoSmall,
    subcategories: [],
  },
  {
    id: "5",
    name: "Children",
    image: children,
    subcategories: [],
  },
  {
    id: "6",
    name: "Construction",
    image: construction,
    subcategories: [],
  },
  {
    id: "7",
    name: "Dispatch rider",
    image: dispatchRider,
    subcategories: [],
  },
  {
    id: "8",
    name: "Electronics",
    image: electronics,
    subcategories: [],
  },
  {
    id: "9",
    name: "Fashion",
    image: fashion,
    subcategories: [],
  },
  {
    id: "10",
    name: "Furniture",
    image: furniture,
    subcategories: [],
  },
  {
    id: "11",
    name: "Health & Beauty",
    image: health,
    subcategories: [],
  },
  {
    id: "12",
    name: "Home Accessories",
    image: homeAccessories,
    subcategories: [],
  },
  {
    id: "13",
    name: "Jobs",
    image: jobs,
    subcategories: [],
  },
  {
    id: "14",
    name: "Machineries",
    image: machinery,
    subcategories: [],
  },
  {
    id: "15",
    name: "Medicals",
    image: medicals,
    subcategories: [],
  },
  {
    id: "16",
    name: "Gadgets",
    image: gadgets,
    subcategories: [],
  },
  {
    id: "17",
    name: "Properties",
    image: property,
    subcategories: [],
  },
  {
    id: "18",
    name: "Services",
    image: services,
    subcategories: [],
  },
  {
    id: "19",
    name: "Sports and Art",
    image: sportsAndArts,
    subcategories: [],
  },
];
