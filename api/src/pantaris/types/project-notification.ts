export type ProjectNotification = {
  id: string;
  project: {
    _relType: "projects";
    id: string;
  };
  enabled: true;
  title: string;
  message: string;
  type: "INFO";
  source: "PROJECT";
  createdAt: string;
  updatedAt: string;
};
