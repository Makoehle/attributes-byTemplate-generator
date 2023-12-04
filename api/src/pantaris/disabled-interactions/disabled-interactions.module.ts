import { Module } from "@nestjs/common";
import { DisabledInteractionsService } from "./disabled-interactions.service";

@Module({
  providers: [DisabledInteractionsService],
})
export class DisabledInteractionsModule {}
