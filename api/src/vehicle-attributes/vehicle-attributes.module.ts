import { Module } from "@nestjs/common";
import { VehicleAttributesService } from "./vehicle-attributes.service";
import { PantarisApiModule } from "src/pantaris/pantaris.module";

@Module({
  imports: [PantarisApiModule],
  providers: [VehicleAttributesService],
  exports: [VehicleAttributesService],
})
export class VehicleAttributesModule {}
