import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  VehicleAttributeTemplate,
  VehicleAttributeTemplateDocument,
} from "./vehicle-attribute-template.schema";
import { Model } from "mongoose";
import { CreateVehicleAttributeTemplateDto } from "./vehicle-attribute-template.dto";

@Injectable()
export class VehicleAttributeTemplateService {
  constructor(
    @InjectModel(VehicleAttributeTemplate.name)
    private model: Model<VehicleAttributeTemplateDocument>,
  ) {}

  create(template: CreateVehicleAttributeTemplateDto) {
    return this.model.create(template);
  }

  getAll() {
    return this.model.find({ isDeleted: false }).sort({ name: 1 });
  }
}
