import { Types } from "mongoose";

  
  interface Service {
    typeId: string;    // ObjectId as string
    category: string;
    subtype: Array<{
      type: string;
      startingPrice: number;
    }>;
  }
  
  export interface ProvidingServices {
    workshopId:Types.ObjectId,
    twoWheeler?:Service[],
    fourWheeler?:Service[]
  }
  