import { Tractor } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  billCount: number;
}

export const Header = ({ billCount }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg print:hidden">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tractor className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Tractor Work POS</h1>
              <p className="text-sm opacity-90">Abeysinghe - +94740149500</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-90">✓ Offline Mode</p>
              <p className="text-xs opacity-75">{billCount} Bills Saved</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
