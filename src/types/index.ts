export interface Settings {
  ratePerAcre: number;
  ratePerHour: number;
}

export interface Bill {
  id: number;
  customerName: string;
  phoneNumber: string;
  workType: 'tractor' | 'blade';
  acreage: string;
  hours: string;
  amountPaid: string;
  customDate: string;
  total: number;
  amountDue: number;
  savedDate: string;
}

export interface DatabaseBackup {
  version: string;
  exportDate: string;
  settings: Settings;
  bills: Bill[];
}
