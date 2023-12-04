import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { INJECT_PANTARIS } from "../pantaris.module";
import { firstValueFrom, catchError } from "rxjs";
import { ProjectNotification, Res } from "../types";

const TITLE = "Neue Attributsgruppe 'Werkstattinformationen' verfügbar";
const MSG = `
Unsere Werkstätten benötigen für sämtliche Arbeiten an unseren Versuchsträgern zusätzliche Informationen. Diese Infos wollen wir ab sofort über Pantaris bereitstellen.
Bitte pflegt die neuen Attribute in der Gruppe „Werkstattinformationen“.
`;
const URL = "project-notifications";

@Injectable()
export class ProjectNotificationsService {
  private readonly logCreate: Logger = new Logger(
    `${ProjectNotificationsService.name}:create`,
  );

  constructor(@Inject(INJECT_PANTARIS) private readonly api: HttpService) {}

  async create(projectId: string) {
    const toCreate = {
      project: {
        id: projectId,
      },
      enabled: true,
      title: TITLE,
      message: MSG,
      type: "INFO",
      source: "PROJECT",
    };

    const response = await firstValueFrom(
      this.api.post<Res<ProjectNotification>>(URL, toCreate).pipe(
        catchError((error: any) => {
          throw error.response.data.error.detail;
        }),
      ),
    );

    const { data } = response;

    return data;
  }
}
