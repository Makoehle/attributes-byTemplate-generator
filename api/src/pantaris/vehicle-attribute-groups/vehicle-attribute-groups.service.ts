import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { INJECT_PANTARIS } from "src/pantaris/pantaris.module";
import { CreateVehicleAttributeGroupDto } from "./vehicle-attribute-groups.dto";
import { FilteredSearch, Res, VehicleAttributeGroup } from "../types";

const URL = "vehicle-attribute-groups";
const SEARCH = `${URL}/search?fields=id,project`;

@Injectable()
export class VehicleAttributeGroupsService {
  private readonly logger: Logger = new Logger(
    VehicleAttributeGroupsService.name,
  );
  private readonly logSearch: Logger = new Logger(
    `${VehicleAttributeGroupsService.name}:search`,
  );
  private readonly loggerCreate: Logger = new Logger(
    `${VehicleAttributeGroupsService.name}:create`,
  );

  constructor(@Inject(INJECT_PANTARIS) private readonly api: HttpService) {}

  async create(toCreate: CreateVehicleAttributeGroupDto) {
    this.loggerCreate.verbose(toCreate);
    const { data } = await firstValueFrom(
      this.api.post<Res<VehicleAttributeGroup>>(URL, toCreate).pipe(
        catchError((error: any) => {
          throw error.response.data.error.detail;
        }),
      ),
    );
    return data;
  }

  async search(projectIds: string[], groupName: string) {
    this.logSearch.verbose({ projectIds, groupName });

    const name = { _eq: groupName };
    const _rel = {
      project: {
        id: {
          _in: projectIds,
        },
      },
    };

    const body = {
      query: {
        _and: [{ name }, { _rel }],
      },
      inlineData: true,
      limit: 1000,
    };

    const { data } = await firstValueFrom(
      this.api.post<FilteredSearch>(SEARCH, body).pipe(
        catchError((error: any) => {
          throw error.response.data.error.detail;
        }),
      ),
    );

    this.logSearch.verbose(data);

    return data;
  }
}
