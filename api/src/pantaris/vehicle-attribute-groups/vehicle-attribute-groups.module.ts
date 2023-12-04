import { Module } from "@nestjs/common";
import { VehicleAttributeGroupsService } from "./vehicle-attribute-groups.service";
import { PantarisApiModule } from "src/pantaris/pantaris.module";

@Module({
  imports: [PantarisApiModule],
  providers: [VehicleAttributeGroupsService],
  exports: [VehicleAttributeGroupsService],
})
export class VehicleAttributeGroupsModule {
  // constructor(private readonly srv: VehicleAttributeGroupsService) {}
  // async onModuleInit() {
  //   await this.srv.search(["696ec8fe-8ae5-11ee-beff-336df3fcb565"], "test");
  // }
}
