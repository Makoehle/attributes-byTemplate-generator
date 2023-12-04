import { Controller, Param, Post } from "@nestjs/common";
import { OrgService } from "./organization.service";

@Controller("organizations")
export class OrgController {
  constructor(private readonly srv: OrgService) {}

  @Post(":orgId/attributes")
  createAttributes(@Param("orgId") orgId: string) {
    return this.srv.createAttributes(orgId);
  }
}
