import { Controller, Post } from "@nestjs/common";
import { UseCaseCreateMissingAttributesService } from "./use-case-create-missing-attributes.service";

const PROJECT_IDS = [
  "640ce340-7a20-11ed-8e60-773162c89cbc",
  "e41611b6-7516-11ec-bacb-2f9a274baee9",
  "c58166b0-d83e-11ed-96c2-57715de454b0",
  "28756b76-7d81-11ee-ac3b-dfd7333eacbf",
  "2a35da46-3553-11eb-a861-47ddcba32632",
  "da3dcf32-3e40-11ed-9b05-b7f8dbec9ee6",
  "7ce224f0-1186-11ed-bf32-47ca68af11dc",
  "66a051ac-bfad-11eb-961f-e7d75f2b337e",
  "ca6b617e-b8c4-11ed-9a39-9324db6d0d60",
  "3d6b3fe2-20ea-11ec-b9d6-6f24028b04a3",
  "8173ac44-cee7-11e9-bef5-7324a2aed12d",
  "100b6d90-3b97-11ea-bb2f-a7dd258d6f6a",
  "c7e75d42-379c-11ea-b8df-278d95fce6a1",
  "0f8bb5ae-35df-11ea-8238-0fbf29af1fea",
];

@Controller("use-case-create-attributes")
export class CreateMissingAttributesController {
  constructor(private readonly srv: UseCaseCreateMissingAttributesService) {}

  @Post()
  createAttributes() {
    return this.srv.byProjectIds(PROJECT_IDS);
  }
}
