import { IsNotEmpty, IsString } from "class-validator";
import { ICreateVehicleAttributeGroup } from "../types";

export class CreateVehicleAttributeGroupDto
  implements ICreateVehicleAttributeGroup
{
  // TODO: Use other projects or startpage to find out how to validate type
  project: { id: string };

  @IsString()
  @IsNotEmpty()
  name: string;
}
