import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Database, AlertCircle } from 'lucide-react';
import { exportDatabase, importDatabase, clearDatabase } from '@/utils/database';
import { Settings, Bill } from '@/types';
import { toast } from 'sonner';

interface BackupPanelProps {
  settings: Settings;
  bills: Bill[];
  onImport: (settings: Settings, bills: Bill[]) => void;
  onClear: () => void;
}

export const BackupPanel = ({ settings, bills, onImport, onClear }: BackupPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportDatabase(settings, bills);
    toast.success('Database exported successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importDatabase(
        file,
        (importedSettings, importedBills) => {
          onImport(importedSettings, importedBills);
          toast.success(`Successfully imported ${importedBills.length} bills!`);
        },
        (error) => {
          toast.error(error);
        }
      );
    }
    // Reset input
    event.target.value = '';
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      clearDatabase();
      onClear();
      toast.success('Database cleared successfully!');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle>Database Backup & Restore</CardTitle>
          </div>
          <CardDescription>
            Export your data for backup or import from a previously saved file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Bills:</span>
              <span className="font-bold">{bills.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tractor Rate:</span>
              <span className="font-bold">Rs. {settings.ratePerAcre}/acre</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Blade Rate:</span>
              <span className="font-bold">Rs. {settings.ratePerHour}/hour</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Button onClick={handleExport} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export Database
            </Button>

            <Button onClick={handleImportClick} variant="outline" className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Import Database
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Permanently delete all bills and reset settings to defaults
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClear} variant="destructive" className="w-full gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
