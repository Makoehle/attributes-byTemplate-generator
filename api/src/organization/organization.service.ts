import { Injectable, Logger } from "@nestjs/common";
import { GROUP_NAME } from "src/constants";
import { ICreateVehicleAttribute } from "src/interfaces";
import { VehicleAttributeGroupsService } from "src/pantaris";
import { ProjectNotificationsService } from "src/pantaris/project-notifications/project-notifications.service";
import type {
  Res,
  VehicleAttribute,
  VehicleAttributeVehicleGroup,
} from "src/pantaris/types";
import { VehicleGroupsService } from "src/pantaris/vehicle-groups";
import { ProjectService } from "src/project/project.service";
import { VehicleAttributeTemplate } from "src/vehicle-attribute-template/vehicle-attribute-template.schema";
import { VehicleAttributeTemplateService } from "src/vehicle-attribute-template/vehicle-attribute-template.service";
import { VehicleAttributesService } from "src/vehicle-attributes/vehicle-attributes.service";

@Injectable()
export class OrgService {
  private readonly logCreateAttributesByProjectId: Logger = new Logger(
    `${OrgService.name}:createAttributesByProjectId`,
  );
  private readonly logCreateVehicleAttributeGroup: Logger = new Logger(
    `${OrgService.name}:createVehicleAttributeGroup`,
  );
  private readonly logCreateAttributes: Logger = new Logger(
    `${OrgService.name}:createAttributes`,
  );

  constructor(
    private readonly projects: ProjectService,
    private readonly va: VehicleAttributesService,
    private readonly vag: VehicleAttributeGroupsService,
    private readonly vat: VehicleAttributeTemplateService,
    private readonly pn: ProjectNotificationsService,
    private readonly vg: VehicleGroupsService,
  ) {}

  async createVehicleAttributeGroup(projectId: string) {
    this.logCreateVehicleAttributeGroup.verbose({ projectId });
    const { data } = await this.vag.create({
      name: GROUP_NAME,
      project: { id: projectId },
    });
    return data;
  }

  async createAttributesByProjectId(
    projectId: string,
    templates: VehicleAttributeTemplate[],
  ) {
    this.logCreateAttributesByProjectId.log({
      projectId,
    });

    const tags = templates.map((t) => t.tag);
    const { data: attributes } = await this.va.search([projectId], tags);

    if (attributes.length === tags.length) {
      this.logCreateAttributesByProjectId.log(
        `Attributes appear all to exist for ${projectId}`,
      );
      return undefined;
    }

    let groupId;

    const { data } = await this.vag.search([projectId], GROUP_NAME);
    const [existingGroup] = data;

    if (!existingGroup) {
      groupId = (await this.createVehicleAttributeGroup(projectId)).id;
      // disable interaction for remove
    } else {
      groupId = existingGroup.id;
      this.logCreateAttributesByProjectId.debug({
        existingGroupId: existingGroup,
      });
    }
    const missingAttributes: VehicleAttributeTemplate[] = [];
    const existingAttributes: VehicleAttribute[] = [];

    templates.forEach((template) => {
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

    const promises: Promise<null | Res<VehicleAttribute>>[] = [];
    missingAttributes.forEach((a) => {
      const toBeCreated: ICreateVehicleAttribute = {
        name: a.name,
        tags: [a.tag],
        project: {
          id: projectId,
        },
      };
      promises.push(this.va.create(toBeCreated));
    });

    const attributesCreated = await Promise.all(promises);

    const toEditAttributeGroup: Promise<Res<VehicleAttribute>>[] = [];
    attributesCreated.forEach((r) => {
      const edit: Partial<VehicleAttribute> = {
        id: r.data.id,
        group: {
          id: groupId,
        },
      };
      toEditAttributeGroup.push(this.va.edit(edit));
    });

    const vehicleGroupSearchResponse = await this.vg.find(projectId);
    const vehicleGroupIds = vehicleGroupSearchResponse.data.map((d) => d.id);

    const toAddToVehicleGroups: Promise<Res<VehicleAttributeVehicleGroup>>[] =
      [];
    attributesCreated.forEach((a) => {
      vehicleGroupIds.forEach((vehicleGroupId) => {
        toAddToVehicleGroups.push(
          this.vg.addAttribToGroup(vehicleGroupId, a.data.id),
        );
      });
    });

    await this.pn.create(projectId);

    return attributesCreated;
  }

  async createAttributes(orgId: string) {
    const projectIds = <string[]>await this.projects.searchByOrg(orgId);
    const templates = await this.vat.getAll();

    this.logCreateAttributes.log({
      orgId,
    });

    this.logCreateAttributes.debug({
      projectIds,
    });

    this.logCreateAttributes.verbose({
      templates,
    });

    const promises: Promise<any>[] = [];
    projectIds.forEach((id) => {
      promises.push(this.createAttributesByProjectId(id, templates));
    });

    const result = await Promise.all(promises);

    return result;
  }
}
