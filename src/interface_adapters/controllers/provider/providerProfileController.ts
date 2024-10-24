import { Request, Response } from "express";
import IProfileInteractor from "../../../entities/provider/IprofileInteractor";
import HttpStatus from "../../../entities/rules/statusCode";
import { IUploadToCloudinary } from "../../../entities/services/Iclodinary";

class ProviderProfileController {
  constructor(
    private readonly providerProfileInteractor: IProfileInteractor,
    private readonly cloudinary: IUploadToCloudinary
  ) {}
  async getDataToProfile(req: Request, res: Response) {
    try {
      const id: string | undefined = req.query.id + "";

      if (!id)
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "provided id not passed" });
      const response =
        await this.providerProfileInteractor.getDataToProfile(id);

      if (!response.success) {
        if (response.message === "500") {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
        }
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "something went wrong" });
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async editAbout(req: Request, res: Response) {
    try {
      const { id, about } = req.body.data;

      const response = await this.providerProfileInteractor.editabout({
        id,
        about,
      });
      if (!response.success) {
        return response.message === "500"
          ? res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
          : res.status(HttpStatus.Unprocessable_Entity).json(response);
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error " });
    }
  }

  async addLogo(req: Request, res: Response) {
    try {
        console.log(req.body );
         
      const { id } = req.body;
      const image = req.file?.buffer;
      if (image instanceof Buffer) {
        const cloudinaryresponse = await this.cloudinary.uploadToCloudinary(
          image,
          "FixitHub",
          "FixithubImages"
        ); 
        if (cloudinaryresponse.success) {
          const data = {
            id: id, 
            url: cloudinaryresponse.url ? cloudinaryresponse.url : "",
          };
          const response = await this.providerProfileInteractor.addImage(data);
          if (response.success) {
            return res.status(HttpStatus.OK).json({ url: response.url });
          }
        }
      }
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "somethingw went wrong" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  }

  async updateProfile(req:Request,res:Response){
    try {
      const { id,whichisTotChange,newOne} = req.body
      const data = {id,whichisTotChange,newOne}
      const response = await this.providerProfileInteractor.updateProfiledatas(data)
      if (!response.success) {
         if (response.message==="500") {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("internal server error")
         }else{
          return res.status(HttpStatus.Unprocessable_Entity).json("something went wrong")
         }
      }
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"internal server"})
    }
  }
}

export default ProviderProfileController;
