import { Module } from "@nestjs/common";
import { VehicleGroupsService } from "./vehicle-groups.service";
import { PantarisApiModule } from "../pantaris.module";

@Module({
  imports: [PantarisApiModule],
  providers: [VehicleGroupsService],
  exports: [VehicleGroupsService],
})
export class VehicleGroupsModule {}
