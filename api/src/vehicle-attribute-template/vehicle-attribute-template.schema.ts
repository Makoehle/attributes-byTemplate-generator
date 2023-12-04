import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class VehicleAttributeTemplate {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  tag!: string;

  @Prop({ default: "STRING" })
  type!: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const VehicleAttributeTemplateSchema = SchemaFactory.createForClass(
  VehicleAttributeTemplate,
);

export type VehicleAttributeTemplateDocument =
  HydratedDocument<VehicleAttributeTemplate>;
