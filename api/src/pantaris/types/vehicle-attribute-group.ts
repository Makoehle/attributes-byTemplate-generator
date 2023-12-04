import { SearchResponse } from "./search-response";

export type VehicleAttributeGroup = {
  id: string;
  project: {
    _relType: "projects";
    id: string;
  };
  name: string;
  attributes: [];
  createdBy: {
    _relType: "users";
    id: string;
  };

  /** 2023-11-28T10:04:59.624Z */
  createdAt: string;

  /** 2023-11-28T10:04:59.624Z */
  updatedAt: string;
};

export type IdAndProject = Pick<VehicleAttributeGroup, "id" | "project">;

export type FilteredSearch = SearchResponse<IdAndProject>;
