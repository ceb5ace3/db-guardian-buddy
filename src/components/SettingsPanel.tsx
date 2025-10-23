import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from '@/types';
import { CheckCircle } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
}

export const SettingsPanel = ({ settings, onUpdate }: SettingsPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="ratePerAcre">Tractor Work Rate (per Acre)</Label>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground">Rs.</span>
            <Input
              id="ratePerAcre"
              type="number"
              value={settings.ratePerAcre}
              onChange={(e) => onUpdate({ ...settings, ratePerAcre: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="ratePerHour">Blade Work Rate (per Hour)</Label>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground">Rs.</span>
            <Input
              id="ratePerHour"
              type="number"
              value={settings.ratePerHour}
              onChange={(e) => onUpdate({ ...settings, ratePerHour: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <p className="text-sm text-success">Settings are saved automatically</p>
        </div>
      </CardContent>
    </Card>
  );
};
