import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { ICreateVehicleAttribute } from "src/interfaces";
import { INJECT_PANTARIS } from "src/pantaris/pantaris.module";
import { Res, SearchResponse, VehicleAttribute } from "src/pantaris/types";

@Injectable()
export class VehicleAttributesService {
  private readonly logger: Logger = new Logger(VehicleAttributesService.name);
  private readonly logEdit: Logger = new Logger(
    `${VehicleAttributesService.name}:edit`,
  );
  private readonly logCreate = new Logger(
    `${VehicleAttributesService.name}:create`,
  );

  constructor(@Inject(INJECT_PANTARIS) private readonly api: HttpService) {}

  async edit(toEdit: Partial<VehicleAttribute>) {
    this.logEdit.debug(toEdit);

    const url = `vehicle-attributes/${toEdit.id}`;
    const { data } = await firstValueFrom(
      this.api.patch<Res<VehicleAttribute>>(url, toEdit).pipe(
        catchError((error: any) => {
          throw error.response.data.error.detail;
        }),
      ),
    );

    return data;
  }

  async create(newAttribute: ICreateVehicleAttribute) {
    this.logCreate.debug(newAttribute);
    const { data } = await firstValueFrom(
      this.api
        .post<Res<VehicleAttribute>>("vehicle-attributes", newAttribute)
        .pipe(
          catchError((error: any) => {
            throw error.response.data.error.detail;
          }),
        ),
    );
    return data;
  }

  async search(projectIds: string[], tags: string[]) {
    const _or = [];

    tags.forEach((tag) =>
      _or.push({
        tags: { _any: [tag] },
      }),
    );

    const body = {
      query: {
        _and: [
          { _or },
          {
            _rel: {
              project: {
                id: {
                  _in: projectIds,
                },
              },
            },
          },
        ],
      },
      limit: 1000,
      inlineData: true,
    };

    const { data } = await firstValueFrom(
      this.api
        .post<SearchResponse<VehicleAttribute>>(
          "vehicle-attributes/search",
          body,
        )
        .pipe(
          catchError((error: any) => {
            console.error(error);
            throw error.response.data.error.detail;
          }),
        ),
    );

    return data;
  }
}
