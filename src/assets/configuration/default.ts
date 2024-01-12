/** Lease Default value */
export enum DefaultValue {
  test1 = 1,
  test2 = 2,
}

/** Default disabled values */
export const disableControls = [
  { group: 'pageHeader', control: 'createdDate' },
  { group: 'pageHeader', control: 'versionNo' },
  { group: 'pageHeader', control: 'status' },
  { group: 'pageDetail', control: 'operationalActivity' },
  { group: 'pageDetail', control: 'revisonEndDate' },
];
