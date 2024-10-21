import { Request, Response } from "express";
import IuserServiceInteractor from "../../../entities/user/IuserServiceInteractor";
import HttpStatus from "../../../entities/rules/statusCode";

class UserServiceContoller {
  constructor(private readonly UserServiceInteractor: IuserServiceInteractor) {}
  async getServices(req: Request, res: Response) {
    try {
      const { category } = req.params;
      if (!category) {
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "no category provided" });
      }
      const response = await this.UserServiceInteractor.getServices(category);
      if (!response.success) {
        if (response.message === "500") {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "" });
        }
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "failed data fetching" });
      }

      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed" });
    }
  }
}

export default UserServiceContoller