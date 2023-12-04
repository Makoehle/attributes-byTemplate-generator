import { Logger } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { UseCaseCreateMissingAttributesService } from "./use-case-create-missing-attributes.service";
import { VehicleAttributeGroupsModule } from "src/pantaris";
import { ConfigModule } from "@nestjs/config";
import { VehicleGroupsModule } from "src/pantaris/vehicle-groups";
import { VehicleAttributeTemplateModule } from "src/vehicle-attribute-template/vehicle-attribute-template.module";
import { DatabaseModule } from "src/database/database.module";
import { VehicleAttributesModule } from "src/vehicle-attributes/vehicle-attributes.module";
import { ProjectNotificationsModule } from "src/pantaris/project-notifications/project-notifications.module";

// "4f498158-1791-11e8-bc6e-f338a67891ec",
// 	"e75d3a66-b82b-11e9-a3e6-2f47ef382654",
// 	"f6684b08-e646-11ec-b865-ab758593cf00",

const PROJECT_IDS = [
  "4f498158-1791-11e8-bc6e-f338a67891ec",
  "e75d3a66-b82b-11e9-a3e6-2f47ef382654",
];

describe("use-case-create-missing-attributes", () => {
  let srv: UseCaseCreateMissingAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ProjectNotificationsModule,
        VehicleAttributeGroupsModule,
        VehicleAttributeTemplateModule,
        VehicleAttributesModule,
        VehicleGroupsModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [UseCaseCreateMissingAttributesService],
    })
      .setLogger(new Logger())
      .compile();

    srv = module.get<UseCaseCreateMissingAttributesService>(
      UseCaseCreateMissingAttributesService,
    );
  });

  it("creates missing vehicle attribute gruops", async () => {
    await srv.createVehicleAttributeGroups(PROJECT_IDS);
  });

  it.only("creates missing vehicle attributes", async () => {
    await srv.byProjectIds(PROJECT_IDS);
  });
});
