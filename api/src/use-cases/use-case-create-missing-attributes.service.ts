import { Injectable, Logger } from "@nestjs/common";
import { GROUP_NAME } from "src/constants";
import { ICreateVehicleAttribute } from "src/interfaces";
import {
  CreateVehicleAttributeGroupDto,
  VehicleAttributeGroupsService,
} from "src/pantaris";
import { ProjectNotificationsService } from "src/pantaris/project-notifications/project-notifications.service";
import { VehicleAttribute } from "src/pantaris/types";
import { VehicleGroupsService } from "src/pantaris/vehicle-groups";
import { VehicleAttributeTemplate } from "src/vehicle-attribute-template/vehicle-attribute-template.schema";
import { VehicleAttributeTemplateService } from "src/vehicle-attribute-template/vehicle-attribute-template.service";
import { VehicleAttributesService } from "src/vehicle-attributes/vehicle-attributes.service";

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

@Injectable()
export class UseCaseCreateMissingAttributesService {
  private readonly logCreateVehicleAttributeGroups = new Logger(
    `${UseCaseCreateMissingAttributesService.name}:createVehicleAttributeGroups`,
  );
  private readonly logCreateVehicleAttributes = new Logger(
    `${UseCaseCreateMissingAttributesService.name}:createVehicleAttributes`,
  );

  private templates: VehicleAttributeTemplate[];
  private tags: string[];

  constructor(
    private readonly pn: ProjectNotificationsService,
    private readonly va: VehicleAttributesService,
    private readonly vag: VehicleAttributeGroupsService,
    private readonly vat: VehicleAttributeTemplateService,
    private readonly vg: VehicleGroupsService,
  ) {}

  /**
   * Determine which attributes have to be created.
   */

  getMissing(attributes: VehicleAttribute[]) {
    const missingAttributes: VehicleAttributeTemplate[] = [];
    const existingAttributes: VehicleAttribute[] = [];

    this.templates.forEach((template) => {
      if (!attributes.length) {
        missingAttributes.push(template);
        return;
      }

      const existingAttribute = attributes.find((a) => {
        if (a.tags.includes(template.tag)) {
          return a;
        }
      });

      if (existingAttribute) {
        existingAttributes.push(existingAttribute);
      } else {
        missingAttributes.push(template);
      }
    });

    return {
      existingAttributes,
      missingAttributes,
    };
  }

  async getTemplates() {
    if (!this.templates) {
      this.templates = await this.vat.getAll();
      this.tags = this.templates.map((t) => t.tag);
    }
    return {
      tags: this.tags,
      templates: this.templates,
    };
  }

  async createVehicleAttributes(projectId: string) {
    const vehicleGroupSearchResponse = await this.vg.find(projectId);
    const vehicleGroupIds = vehicleGroupSearchResponse.data.map((d) => d.id);

    const { tags } = await this.getTemplates();
    const { data: attributes } = await this.va.search([projectId], tags);

    const { missingAttributes } = this.getMissing(attributes);

    const attributesCreated = await Promise.all(
      missingAttributes.map((a) => {
        const toBeCreated: ICreateVehicleAttribute = {
          name: a.name,
          tags: [a.tag],
          project: {
            id: projectId,
          },
        };
        return this.va.create(toBeCreated);
      }),
    );

    const { data } = await this.vag.search([projectId], GROUP_NAME);
    const [existingGroup] = data;
    const groupId = existingGroup.id;

    await Promise.all(
      attributesCreated.map((a) => {
        const edit: Partial<VehicleAttribute> = {
          id: a.data.id,
          group: {
            id: groupId,
          },
        };
        return this.va.edit(edit);
      }),
    );

    this.logCreateVehicleAttributes.log(
      `Assigning ${attributesCreated.length} attributes to ${vehicleGroupIds.length} vehicle groups`,
    );

    for (let i = 0; i < attributesCreated.length; i++) {
      for (let j = 0; j < vehicleGroupIds.length; j++) {
        this.logCreateVehicleAttributes.log(
          `Assigning vehicle group ${j}/${vehicleGroupIds.length} to ${attributesCreated[i].data.name}`,
        );
        await this.vg.addAttribToGroup(
          vehicleGroupIds[j],
          attributesCreated[i].data.id,
        );
        await sleep(500);
      }
    }

    await this.pn.create(projectId);

    this.logCreateVehicleAttributes.log({
      projectId,
      amount: attributesCreated.length,
    });
  }

  async createVehicleAttributesByProjectIds(projectIds: string[]) {
    for (const projectId of projectIds) {
      await this.createVehicleAttributes(projectId);
    }
    return projectIds;
  }

  /**
   * Create, if not exists, the required attribute group.
   */

  async createVehicleAttributeGroups(projectIds: string[]) {
    const response = await this.vag.search(projectIds, GROUP_NAME);
    const found = response.data.map((d) => d.project.id);
    const missing = projectIds.filter((p) => !found.includes(p));
    this.logCreateVehicleAttributeGroups.log({ missing });

    await Promise.all(
      missing.map(async (projectId) => {
        const toBeCreated: CreateVehicleAttributeGroupDto = {
          name: GROUP_NAME,
          project: {
            id: projectId,
          },
        };
        return this.vag.create(toBeCreated);
      }),
    );
  }

  /**
   * Create missing attribute groups by project ids.
   */

  async byProjectIds(projectIds: string[]) {
    await this.createVehicleAttributeGroups(projectIds);
    return await this.createVehicleAttributesByProjectIds(projectIds);
  }
}
