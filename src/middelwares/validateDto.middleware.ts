import { Request, Response, NextFunction } from "express";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";
import { EMPTY_DATA_COUNT } from "../utills/conts.js";

export const validateDto =
  (DtoClass: ClassConstructor<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(DtoClass, req.body);

    const errorsList = await validate(dtoObject);

    if (errorsList.length > EMPTY_DATA_COUNT) {
      return res.status(400).json({
        message: errorsList.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        ),
      });
    }

    req.body = dtoObject;

    next();
  };
