type VehicleRelation = {
  _relType: "vehicles";
  _relId: string;
  id: string;
};

export type VehicleAttribute = {
  id: string;
  project: {
    _relType: "projects";
    id: string;
  };
  name: string;
  type: string;
  valueEnum: null;
  valueUnit: string;
  valueMin: null;
  valueMax: null;
  isPinned: false;
  tags: string[];
  group: null | {
    id: string;
  };
  groupSortIndex: number;
  vehicleGroups: [];
  vehicles: VehicleRelation[];
  createdBy: {
    _relType: "users";
    id: string;
  };
  createdAt: string;
  updatedAt: string;
};
