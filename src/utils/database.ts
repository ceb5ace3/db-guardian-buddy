import { DatabaseBackup, Bill, Settings } from '@/types';

const DATABASE_VERSION = '1.0.0';

export const exportDatabase = (settings: Settings, bills: Bill[]): void => {
  const backup: DatabaseBackup = {
    version: DATABASE_VERSION,
    exportDate: new Date().toISOString(),
    settings,
    bills,
  };

  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `tractor-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importDatabase = (
  file: File,
  onSuccess: (settings: Settings, bills: Bill[]) => void,
  onError: (message: string) => void
): void => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const backup: DatabaseBackup = JSON.parse(content);
      
      if (!backup.version || !backup.settings || !backup.bills) {
        throw new Error('Invalid backup file format');
      }
      
      onSuccess(backup.settings, backup.bills);
    } catch (error) {
      onError('Failed to import database. Please check the file format.');
    }
  };
  
  reader.onerror = () => {
    onError('Failed to read the file.');
  };
  
  reader.readAsText(file);
};

export const clearDatabase = (): void => {
  localStorage.removeItem('tractorPosSettings');
  localStorage.removeItem('tractorBillHistory');
};
