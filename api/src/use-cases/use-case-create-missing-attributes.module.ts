import { Module } from "@nestjs/common";
import { UseCaseCreateMissingAttributesService } from "./use-case-create-missing-attributes.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/database/database.module";
import { VehicleAttributeGroupsModule } from "src/pantaris";
import { ProjectNotificationsModule } from "src/pantaris/project-notifications/project-notifications.module";
import { VehicleGroupsModule } from "src/pantaris/vehicle-groups";
import { VehicleAttributeTemplateModule } from "src/vehicle-attribute-template/vehicle-attribute-template.module";
import { VehicleAttributesModule } from "src/vehicle-attributes/vehicle-attributes.module";
import { CreateMissingAttributesController } from "./use-case-create-missing-attributes.controller";

@Module({
  controllers: [CreateMissingAttributesController],
  providers: [UseCaseCreateMissingAttributesService],
  imports: [
    DatabaseModule,
    ProjectNotificationsModule,
    VehicleAttributeGroupsModule,
    VehicleAttributeTemplateModule,
    VehicleAttributesModule,
    VehicleGroupsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class CreateMissingAttributesModule {
  async byProjectIds() {}
}
