import { Body, Controller, Post } from "@nestjs/common";
import { CreateVehicleAttributeTemplateDto } from "./vehicle-attribute-template.dto";
import { VehicleAttributeTemplateService } from "./vehicle-attribute-template.service";

@Controller("vehicle-attribute-templates")
export class VehicleAttributeTemplateController {
  constructor(private readonly srv: VehicleAttributeTemplateService) {}
  @Post()
  create(@Body() template: CreateVehicleAttributeTemplateDto) {
    return this.srv.create(template);
  }
}
