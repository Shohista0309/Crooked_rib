export type Role = "CUSTOMER" | "CREATOR" | "SELLER" | "ADMIN";

export type OrderStatus =
  | "REQUEST_SUBMITTED"
  | "UNDER_REVIEW"
  | "QUOTATION_SENT"
  | "CUSTOMER_APPROVED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type ProductCategory =
  | "FABRIC"
  | "THREAD"
  | "BUTTONS"
  | "ZIPPERS"
  | "ACCESSORIES"
  | "TRIM";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface DesignGenerationInput {
  category: string;
  genderCategory?: string;
  style: string;
  season?: string;
  colors: string;
  occasion?: string;
  budget?: number;
  fabricPreferences?: string;
  description: string;
}

export interface DesignGenerationResult {
  title: string;
  conceptDescription: string;
  recommendedFabrics: string[];
  recommendedAccessories: string[];
  technicalNotes: string[];
  suggestedColors: string[];
  estimatedDifficulty: "EASY" | "MEDIUM" | "ADVANCED" | "HAUTE_COUTURE";
}
