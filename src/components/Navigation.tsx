import { FileText, History, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'billing' | 'history' | 'settings' | 'backup';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  historyCount: number;
}

export const Navigation = ({ activeTab, onTabChange, historyCount }: NavigationProps) => {
  const tabs = [
    { id: 'billing' as Tab, label: 'Billing', icon: FileText },
    { id: 'history' as Tab, label: `History (${historyCount})`, icon: History },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
    { id: 'backup' as Tab, label: 'Backup', icon: Database },
  ];

  return (
    <nav className="bg-card border-b print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 min-w-[120px] rounded-none h-14 gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
