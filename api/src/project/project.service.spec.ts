import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "./project.service";
import { PantarisApiModule } from "src/pantaris/pantaris.module";
import { ConfigModule } from "@nestjs/config";
import { VehicleAttributeGroupsModule } from "src/pantaris";
import { GROUP_NAME } from "src/constants";
import { Logger } from "@nestjs/common";

describe("ProjectService", () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PantarisApiModule,
        ConfigModule.forRoot({ isGlobal: true }),
        VehicleAttributeGroupsModule,
      ],
      providers: [ProjectService],
    })
      .setLogger(new Logger())
      .compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it("should do sth", async () => {
    await service.searchByProjectIds(
      [
        "03802600-8f5e-11ee-8275-4f1adaa706e5",
        "227c40c0-8f5e-11ee-9519-bb8b71536ceb",
        "c1ae9c2e-879d-11ee-9517-23adf69fea8b",
      ],
      GROUP_NAME,
    );
  });
});
