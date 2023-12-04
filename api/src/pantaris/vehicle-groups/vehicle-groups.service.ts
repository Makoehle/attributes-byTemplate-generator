import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { INJECT_PANTARIS } from "../pantaris.module";
import { Res, SearchResponse, VehicleAttributeVehicleGroup } from "../types";

const VG_SEARCH = "vehicle-groups/search";
const VAVG = "vehicle-attribute-vehicle-groups";

@Injectable()
export class VehicleGroupsService {
  constructor(@Inject(INJECT_PANTARIS) private readonly api: HttpService) {}

  /**
   * Is going to find all vehicle-groups for a given project id.
   */

  async find(projectId: string) {
    const body = {
      query: {
        "project.id": {
          _eq: projectId,
        },
      },
      limit: 1000,
    };
    const { data } = await firstValueFrom(
      this.api.post<SearchResponse>(VG_SEARCH, body).pipe(
        catchError((error: any) => {
          throw error.response.data.error.detail;
        }),
      ),
    );
    return data;
  }

  /**
   * Add a vehicle-attribute to a vehicle-group.
   */

  async addAttribToGroup(
    vehicleGroupId: string,
    attributeId: string,
    isPinned = false,
  ) {
    const body = {
      group: {
        id: vehicleGroupId,
      },
      attribute: {
        id: attributeId,
      },
      isPinned,
    };
    const response = await firstValueFrom(
      this.api.post<Res<VehicleAttributeVehicleGroup>>(VAVG, body),
    );

    return response.data;
  }
}
