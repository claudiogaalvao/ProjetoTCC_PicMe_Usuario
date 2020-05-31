import RatingModel from "./rating-model";
import ImageModel from "./image-model";

export default interface PhotographerModel {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  phone?: string;
  cpf?: string;
  zipCode?: string;
  street?: string;
  number?: number;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  photo?: string;
  active?: boolean;
  permission?: boolean;
  photographerId?: string;
  ratings?: RatingModel[];
  portfolioImages?: string[];
  ratingCount: number;
  ratingSum: number;
}