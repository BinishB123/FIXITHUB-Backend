import {
    INotifyGetterResponse,
    NotifyGetterResponse,
    reportData,
} from "./IuserResponse";

interface IUserProfileInteractor {
    userUpdateData(data: {
        id: string;
        newData: string;
        whichToChange: string;
    }): Promise<{ success?: boolean; message?: string; newData?: string }>;
    addOrChangePhoto(data: {
        id: string;
        url?: string;
    }): Promise<{ success?: boolean; message?: string; url?: string }>;
    // addReview()
    notificationCountUpdater(id: string): Promise<{ count: number }>;
    notificationsGetter(
        id: string
    ): Promise<{ notfiyData: INotifyGetterResponse[] | [] }>;

    createReport(data: reportData): Promise<{ success?: boolean }>;
    getReport(id: string): Promise<{ data: reportData[] | [] }>;
}

export default IUserProfileInteractor;
