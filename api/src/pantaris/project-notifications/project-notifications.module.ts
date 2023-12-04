import { Module } from "@nestjs/common";
import { ProjectNotificationsService } from "./project-notifications.service";
import { PantarisApiModule } from "../pantaris.module";

@Module({
  imports: [PantarisApiModule],
  exports: [ProjectNotificationsService],
  providers: [ProjectNotificationsService],
})
export class ProjectNotificationsModule {}
