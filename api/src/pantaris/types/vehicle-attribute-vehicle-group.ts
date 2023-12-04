export type VehicleAttributeVehicleGroup = {
  id: string;
  attribute: {
    _relType: "vehicle-attributes";
    id: string;
  };
  group: {
    _relType: "vehicle-groups";
    id: string;
  };
  isPinned: boolean;
  createdBy: {
    _relType: "users";
    id: string;
  };
  createdAt: string;
  updatedAt: string;
};
