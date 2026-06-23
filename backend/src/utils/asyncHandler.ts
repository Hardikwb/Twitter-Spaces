import type { NextFunction } from "express";

type TRequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => Promise<any>;

const asyncHandler = function (requestHandler: TRequestHandler) {
  // return (req:Request,res:Response,next:NextFunction)=>{
  //     Promise.resolve(requestHandler(req,res,next))
  //             .catch((err)=>next(err))
  // }

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default asyncHandler;
