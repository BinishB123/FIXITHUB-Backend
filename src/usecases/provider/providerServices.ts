import {
  providingGeneralServiceData,
  ProvidingRoadServices,
  Services,
} from "entities/rules/provider";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IproviderServiceInteractor from "../../entities/provider/IproviderService";
import { servicetype } from "../../entities/rules/admin";
import { response } from "express";

class ProviderServicesInteractor implements IproviderServiceInteractor {
  constructor(private readonly providerRepo: IProviderRepository) {}

  async getProviderServices(
    id: string,
    vehicletype: number
  ): Promise<{
    success: boolean;
    message: string;
    providerGeneralServiceData?: providingGeneralServiceData[];
    providerRoadServiceData?: ProvidingRoadServices[];
  }> {
    try {
      const getProvider = await this.providerRepo.getProviderServices(
        id,
        vehicletype
      );

      const providerServices: Services[] | any =
        vehicletype == 2
          ? getProvider?.providerService?.twoWheeler || []
          : getProvider?.providerService?.fourWheeler || [];

      if (providerServices.length === 0) {
        return await this.organizeProviderServices(getProvider.allServices);
      } else {
        return await this.organizeProviderServicesALL(
          getProvider.allServices,
          providerServices
        );
      }
    } catch (error) {
      console.error("Error fetching provider services:", error);
      return {
        success: false,
        message: "An error occurred while fetching provider services.",
      };
    }
  }

  // this is also helper function getProviderServices | in else consition this function will check which types services the provider is added and which types of
  //subtypes the provider is according to that it will check update the isAdded field set true or false
  private async organizeProviderServicesALL(
    allServices: servicetype[] | undefined,
    providerServices: Services[]
  ): Promise<{
    success: boolean;
    message: string;
    providerGeneralServiceData?: providingGeneralServiceData[];
    providerRoadServiceData?: ProvidingRoadServices[];
  }> {
    const providerGeneralService: providingGeneralServiceData[] = [];
    const providerRoadServices: ProvidingRoadServices[] = [];

    if (allServices && providerServices) {
      for (const service of allServices) {
        if (service.category === "general") {
          const checker = providerServices.find((item) => {
            return item.typeId + "" === service._id;
          });

          if (checker) {
            const generalService: providingGeneralServiceData = {
              typeid: service._id,
              typename: service.serviceType,
              category: service.category,
              image: service.imageUrl,
              isAdded: true,
              subType:
                service.subTypes?.map((item) => {
                  
                  
                  return { 
                    isAdded: checker.subtype?.some((sub) => sub.type+"" === item._id+""), 
                    priceRange:
                      checker.subtype?.find((sub) => sub.type+"" === item._id+"")
                        ?.startingPrice ?? undefined,
                    type:item.type,
                    _id:item._id
                    
                  };
                }) || [],
            };
            providerGeneralService.push(generalService);
          } else {
            const generalService: providingGeneralServiceData = {
              typeid: service._id,
              typename: service.serviceType,
              category: service.category,
              image: service.imageUrl,
              isAdded: false,
              subType:
                service.subTypes?.map((item) => {
                  return {
                    isAdded: false,
                    type: item.type,
                    _id:item._id
                  };
                }) || [],
            };
            providerGeneralService.push(generalService);
          }
        } else if (service.category === "road") {
          const checker = providerServices.find((item) => {
            return item.typeId + "" === service._id;
          });

          if (checker) {
            const roadService: ProvidingRoadServices = {
              typeid: service._id,
              image: service.imageUrl,
              typename: service.serviceType,
              category: service.category,
              isAdded: true,
            };
            providerRoadServices.push(roadService);
          } else {
            const roadService: ProvidingRoadServices = {
              typeid: service._id,
              image: service.imageUrl,
              typename: service.serviceType,
              category: service.category,
              isAdded: false,
            };
            providerRoadServices.push(roadService);
          }
        }
      }
    }

    return {
      success: true,
      message: "Services organized successfully",
      providerGeneralServiceData: providerGeneralService,
      providerRoadServiceData: providerRoadServices,
    };
  }

  //this is helper function of getProviderServices  if length ====0 this function is called is provider not yet added any
  // services all the isAdded  field is set to false
  private async organizeProviderServices(
    allServices: servicetype[] | undefined
  ): Promise<{
    success: boolean;
    message: string;
    providerGeneralServiceData?: providingGeneralServiceData[];
    providerRoadServiceData?: ProvidingRoadServices[];
  }> {
    const providerGeneralService: providingGeneralServiceData[] = [];
    const providerRoadServices: ProvidingRoadServices[] = [];

    if (allServices) {
      for (const service of allServices) {
        if (service.category === "general") {
          const generalService: providingGeneralServiceData = {
            typeid: service._id,
            typename: service.serviceType,
            category: service.category,
            image: service.imageUrl,
            isAdded: false,
            subType:
              service.subTypes?.map((item) => ({
                isAdded: false,
                type: item.type,
                _id:item._id
              })) || [],
          };
          providerGeneralService.push(generalService);
        } else if (service.category === "road") {
          const roadService: ProvidingRoadServices = {
            typeid: service._id,
            image: service.imageUrl,
            typename: service.serviceType,
            category: service.category,
            isAdded: false,
          };
          providerRoadServices.push(roadService);
        }
      }
    }

    return {
      success: true,
      message: "200",
      providerGeneralServiceData: providerGeneralService,
      providerRoadServiceData: providerRoadServices,
    };
  }

  async addGeneralOrRoadService(data: {
    providerid: string;
    typeid: string;
    category: string;
    vehicleType: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.providerRepo.addGeneralOrRoadService(data);
      return response;
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async addSubTypes(
    providerid: string,
    serviceid: string,
    newSubType: { type: string; startingprice: number; vehicleType: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.providerRepo.addSubTypes(
        providerid,
        serviceid,
        newSubType
      );
      return response;
    } catch (error) {
      return { success: false, message: "500" };
    }
  }
  
  async editSubType(providerid: string, serviceid: string, subtype: { type: string; startingprice: number; vehicleType: string; }): Promise<{ success: boolean; message: string; }> {
      try {
        const updated = await this.providerRepo.editSubType(providerid,serviceid,subtype)
        return updated
      } catch (error) {
        return {success:false,message:""}
      }
  }
  
  async deleteSubtype(providerid: string, serviceid: string, subtype: { type: string; }, vehicleType: string): Promise<{ success: boolean; message: string; }> {
      try {
         const subTypeDeleteResponse = await this.providerRepo.deleteSubtype(providerid,serviceid,subtype,vehicleType)
         return subTypeDeleteResponse
      } catch (error) {
        return {success:false,message:""}
      }
  }

  async getallBrands(id:string): Promise<{ succes: boolean; message: string; brands?: { _id: string; brand: string; isAdded:boolean }[]; }> {
      try {
        const response = await this.providerRepo.getallBrands(id)
        
        if (response.succes) {
          if (response.supportedBrands?.length===0) {
             if (response.brands) {
               const brand = response.brands.map((data)=>{
                return {...data,isAdded:false}
               })
               return { succes:response.succes,message:response.message,brands:brand}
             }
            
          }else{
            if (response.brands) {
              const brand = response.brands.map((brand)=>{
                return {...brand,isAdded:response.supportedBrands?.some((data)=>data.brand+""==brand._id+"")|| false}
              })
              
              return { succes:response.succes,message:response.message,brands:brand}
            }
          }
         return { succes:response.succes,message:response.message}
        }
        return { succes:response.succes,message:response.message}
      } catch (error) {
        return {succes:false,message:"500"}
      }
  }

  async addBrands(data: { id: string; brandid: string; }): Promise<{ success: boolean; message: string; }> {
        try {
          const response = await this.providerRepo.addBrands(data)
          return response
        } catch (error) {
          return {success:false,message:"500"}
        }
  }

  async deleteBrands(data: { id: string; brandid: string; }): Promise<{ success: boolean; message: string; }> {
    try {
      const response = await this.providerRepo.deleteBrand(data)
      return response
    } catch (error) {
      return {success:false,message:"500"}
    }
  }

}

export default ProviderServicesInteractor;
