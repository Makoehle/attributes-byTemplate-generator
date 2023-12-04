import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { VehicleAttributeGroupsService } from "src/pantaris";
import { INJECT_PANTARIS } from "src/pantaris/pantaris.module";

@Injectable()
export class ProjectService {
  private readonly logSearchVehicleAttributeGroups = new Logger(
    `${ProjectService.name}:searchVehicleAttributeGroups`,
  );

  constructor(
    @Inject(INJECT_PANTARIS) private readonly api: HttpService,
    private readonly vag: VehicleAttributeGroupsService,
  ) {}

  async searchByOrg(orgId: string) {
    const body = {
      query: {
        _and: [
          { deletedAt: { _eq: null } },
          {
            type: {
              _eq: "PRODUCTIVE",
            },
          },
          {
            _rel: {
              organizations: {
                "organization.id": {
                  _eq: orgId,
                },
              },
            },
          },
        ],
      },
      limit: 1000,
    };

    const response = await firstValueFrom(
      this.api.post("projects/search", body).pipe(
        catchError((error: any) => {
          console.error(error);
          throw error.response.data.error.detail;
        }),
      ),
    );

    return response.data.data.map((d) => d.id);
  }

  async searchByProjectIds(projectIds: string[], groupName: string) {
    this.logSearchVehicleAttributeGroups.debug({ projectIds, groupName });
    const response = await this.vag.search(projectIds, groupName);
    this.logSearchVehicleAttributeGroups.debug(response);

    const foundIds = response.data.map((d) => d.project.id);
    this.logSearchVehicleAttributeGroups.verbose({ foundIds });

    const requiresCreate = projectIds.filter((p) => !foundIds.includes(p));
    this.logSearchVehicleAttributeGroups.verbose({ requiresCreate });
  }
}
