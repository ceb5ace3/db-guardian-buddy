import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bill } from '@/types';
import { Eye, Printer, Trash2 } from 'lucide-react';

interface BillHistoryProps {
  bills: Bill[];
  onView: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (id: number) => void;
}

export const BillHistory = ({ bills, onView, onPrint, onDelete }: BillHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(
    (bill) =>
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.phoneNumber?.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search by customer name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {bills.length === 0 ? 'No bills saved yet' : 'No matching bills found'}
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredBills.map((bill) => (
              <Card key={bill.id} className="hover:border-primary transition-colors">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{bill.customerName}</h3>
                      {bill.phoneNumber && <p className="text-sm text-muted-foreground">{bill.phoneNumber}</p>}
                      <div className="mt-2 text-sm">
                        <span className="font-medium">
                          {bill.workType === 'tractor' ? 'Tractor' : 'Blade'}:
                        </span>{' '}
                        {bill.workType === 'tractor' ? `${bill.acreage} acres` : `${bill.hours} hours`}
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-primary">Total: Rs. {bill.total.toFixed(2)}</span>
                        {parseFloat(bill.amountPaid) > 0 && (
                          <span className="ml-3 text-destructive">Due: Rs. {bill.amountDue.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {new Date(bill.customDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => onView(bill)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="default" onClick={() => onPrint(bill)}>
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(bill.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
