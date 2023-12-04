import { Module } from "@nestjs/common";
import { VehicleAttributeTemplateService } from "./vehicle-attribute-template.service";
import { VehicleAttributeTemplateController } from "./vehicle-attribute-template.controller";
import {
  VehicleAttributeTemplate,
  VehicleAttributeTemplateSchema,
} from "./vehicle-attribute-template.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VehicleAttributeTemplate.name,
        schema: VehicleAttributeTemplateSchema,
      },
    ]),
  ],
  controllers: [VehicleAttributeTemplateController],
  providers: [VehicleAttributeTemplateService],
  exports: [VehicleAttributeTemplateService],
})
export class VehicleAttributeTemplateModule {}
