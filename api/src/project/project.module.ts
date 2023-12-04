import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { PantarisApiModule } from "src/pantaris/pantaris.module";
import { VehicleAttributeGroupsModule } from "src/pantaris";

@Module({
  controllers: [ProjectController],
  imports: [PantarisApiModule, VehicleAttributeGroupsModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
