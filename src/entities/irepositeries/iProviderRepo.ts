import {
  RegisterResponse,
  ProviderRegisterData,
  SigIn,
  SignResponse,
  IproviderReponseData,
  ResponseAccordingToDate,
  ResponsegetBookingStillTodaysDate,
  NotifyGetterResponse,
  UnreadMessageCount,
  ReviewResponse,
} from "../../entities/rules/provider";
import { ProvidingServices } from "../../entities/provider/IService";
import { servicetype } from "../../entities/rules/admin";
import { ObjectId } from "mongoose";

interface IProviderRepository {
  sendOtp(otp: string, email: string): Promise<{ created: boolean }>;
  providerExist(email: string): Promise<boolean | null>;
  verifyOtp(otp: string, email: string): Promise<boolean | null>;
  registerProvider(registerdata: ProviderRegisterData): Promise<{
    created: boolean;
    message: string;
    provider?: RegisterResponse;
  }>;
  signInProvider(
    providerSignData: SigIn
  ): Promise<{ success: boolean; message: string; provider?: SignResponse }>;
  getProviderServices(
    id: string,
    vehicleType: number
  ): Promise<{
    success: boolean;
    message: string;
    providerService?: ProvidingServices;
    allServices?: servicetype[];
  }>;

  addGeneralOrRoadService(data: {
    providerid: string;
    typeid: string;
    category: string;
    vehicleType: string;
  }): Promise<{ success: boolean; message: string }>;

  removeGeneralOrRoadService(data: {
    workshopId: string;
    typeid: string;
    type: string;
    vehicleType: string;
  }): Promise<{ success?: boolean }>;

  addSubTypes(
    providerid: string,
    serviceid: string,
    newSubType: { type: string; startingprice: number; vehicleType: string }
  ): Promise<{ success: boolean; message: string }>;
  editSubType(
    providerid: string,
    serviceid: string,
    subtype: { type: string; startingprice: number; vehicleType: string }
  ): Promise<{ success: boolean; message: string }>;
  deleteSubtype(
    providerid: string,
    serviceid: string,
    subtype: { type: string },
    vehicleType: string
  ): Promise<{ success: boolean; message: string }>;

  getallBrands(id: string): Promise<{
    succes: boolean;
    message: string;
    brands?: { _id: string; brand: string }[];
    supportedBrands?: { brand: string }[] | [];
  }>;
  addBrands(data: {
    id: string;
    brandid: string;
  }): Promise<{ success: boolean; message: string }>;
  deleteBrand(data: {
    id: string;
    brandid: string;
  }): Promise<{ success: boolean; message: string }>;
  getDataToProfile(id: string): Promise<{
    success: boolean;
    message?: string;
    providerData?: IproviderReponseData | null;
  }>;
  editabout(data: {
    id: string;
    about: string;
  }): Promise<{ success: boolean; message?: string }>;
  addImage(data: {
    id: string;
    url: string;
  }): Promise<{ success: boolean; message: string; url?: string }>;
  updateProfiledatas(data: {
    id: string;
    whichisTotChange: string;
    newOne: string;
  }): Promise<{ success: boolean; message?: string }>;
  getAllBrand(id: string): Promise<{
    success: boolean;
    message?: string;
    brandData?: { _id: string; brand: string }[] | null;
  }>;
  changepassword(data: {
    id: string;
    currentpassowrd: string;
    newpassowrd: string;
  }): Promise<{ success?: boolean; message?: string }>;
  updateLogo(
    url: string,
    id: string
  ): Promise<{ success?: boolean; message?: string; url?: string }>;
  addDate(date: Date, id: string): Promise<{ success?: boolean; id: string }>;
  providerAddedDates(
    id: string
  ): Promise<{ success?: boolean; data: { _id: ObjectId; date: Date }[] | [] }>;
  updateCount(id: string, toDo: string): Promise<{ success?: boolean }>;
  getBookingsAccordingToDates(
    id: string,
    date: Date
  ): Promise<{ success?: boolean; data?: ResponseAccordingToDate[] | [] }>;
  getBookingStillTodaysDate(
    id: string,
    startIndex: number,
    status?: string | undefined
  ): Promise<{
    success?: boolean;
    data?: ResponsegetBookingStillTodaysDate[] | [];
    count: number;
  }>;
  getBookingGreaterThanTodaysDate(id: string): Promise<{
    success?: boolean;
    data?: ResponsegetBookingStillTodaysDate[] | [];
  }>;
  updateStatus(
    id: string,
    status: string,
    amount: number
  ): Promise<{ success?: boolean; paymentId?: string }>;
  notificationCountUpdater(id: string): Promise<{ count: number }>;
  notificationsGetter(id: string): Promise<{
    notfiyData: NotifyGetterResponse[] | [];
    countOfUnreadMessages: UnreadMessageCount[] | [];
  }>;
  getFeedBacks(
    providerId: string
  ): Promise<{ feedBacks?: ReviewResponse[] | [] }>;

  likeFeedBack(id: string, state: boolean): Promise<{ success?: boolean }>;
  reply(id: string, reply: string): Promise<{ success?: boolean }>;
  getMonthlyRevenue(
    id: string
  ): Promise<{ data: { month: string; revenue: number }[] | [] }>;
  TopServicesBooked(
    id: string
  ): Promise<{ data: { serviceType: string; count: number }[] | [] }>;
}

export default IProviderRepository;
