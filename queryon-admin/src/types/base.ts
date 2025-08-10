import { LucideIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface ICommonTypes {
  isLoaded: boolean;
  activeDemo: number;
  setActiveDemo: Dispatch<SetStateAction<number>>;
}

export interface MousePos {
  x: number;
  y: number;
}

export interface IFeatures {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  particleColor: string;
}

export interface ITestimonials {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}
