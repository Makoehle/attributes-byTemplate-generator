import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { OrgModule } from "./organization/organization.module";
import { ProjectModule } from "./project/project.module";
import { VehicleAttributeTemplateModule } from "./vehicle-attribute-template/vehicle-attribute-template.module";
import { VehicleAttributeGroupsModule } from "./pantaris";
import { CreateMissingAttributesModule } from "./use-cases/use-case-create-missing-attributes.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    OrgModule,
    ProjectModule,
    VehicleAttributeGroupsModule,
    VehicleAttributeTemplateModule,
    CreateMissingAttributesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
