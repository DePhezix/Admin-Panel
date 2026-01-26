export interface editSessionFormType {
  workerName: string;
  equipmentName: string;
  active: boolean;
  activityId?: string;
}

export interface createSessionFormType extends editSessionFormType {
  organization: string;
  activityName: string;
}
