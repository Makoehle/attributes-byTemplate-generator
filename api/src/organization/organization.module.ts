import { Module } from "@nestjs/common";
import { OrgService } from "./organization.service";
import { OrgController } from "./organization.controller";
import { ProjectModule } from "src/project/project.module";
import { VehicleAttributeTemplateModule } from "src/vehicle-attribute-template/vehicle-attribute-template.module";
import { VehicleAttributesModule } from "src/vehicle-attributes/vehicle-attributes.module";
import { VehicleAttributeGroupsModule } from "src/pantaris";
import { ProjectNotificationsModule } from "src/pantaris/project-notifications/project-notifications.module";
import { VehicleGroupsModule } from "src/pantaris/vehicle-groups";

@Module({
  imports: [
    ProjectModule,
    ProjectNotificationsModule,
    VehicleAttributeGroupsModule,
    VehicleAttributeTemplateModule,
    VehicleAttributesModule,
    VehicleGroupsModule,
  ],
  providers: [OrgService],
  controllers: [OrgController],
})
export class OrgModule {}
