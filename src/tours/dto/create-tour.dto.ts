export class CreateTourDto {
  title: string;
  description: string;
  priceSingle: number;
  priceDouble: number;
  priceTwin: number;
  priceTriple: number;
  priceChild3to6: number;
  priceChild7to12: number;
  location: string;
  startDate: Date;
  endDate: Date;
  itinerary: string[];
  pickupNote: string;
  cancellationPolicy: string;
  tax: string;
  includedService: string;
  excludedService: string;
  highlights: string;
  generalCondition: string;
  emiDetails: string;
  images: string[]; // URLs of the images
}
