import { IsNotEmpty, IsString } from "class-validator";

export class CreateVehicleAttributeTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  tag!: string;
}
