import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings } from '@/types';

interface BillData {
  customerName: string;
  phoneNumber: string;
  workType: 'tractor' | 'blade';
  acreage: string;
  hours: string;
  amountPaid: string;
  customDate: string;
}

interface BillingFormProps {
  billData: BillData;
  setBillData: (data: BillData) => void;
  settings: Settings;
  onSaveAndPrint: () => void;
  onReset: () => void;
}

export const BillingForm = ({ billData, setBillData, settings, onSaveAndPrint, onReset }: BillingFormProps) => {
  const calculateTotal = () => {
    if (billData.workType === 'tractor' && billData.acreage) {
      return parseFloat(billData.acreage) * settings.ratePerAcre;
    } else if (billData.workType === 'blade' && billData.hours) {
      return parseFloat(billData.hours) * settings.ratePerHour;
    }
    return 0;
  };

  const calculateDue = () => {
    const total = calculateTotal();
    const paid = parseFloat(billData.amountPaid) || 0;
    return total - paid;
  };

  const total = calculateTotal();
  const amountDue = calculateDue();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={billData.customerName}
            onChange={(e) => setBillData({ ...billData, customerName: e.target.value })}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={billData.phoneNumber}
            onChange={(e) => setBillData({ ...billData, phoneNumber: e.target.value })}
            placeholder="+94XXXXXXXXX"
          />
        </div>

        <div>
          <Label htmlFor="workType">Work Type</Label>
          <Select
            value={billData.workType}
            onValueChange={(value: 'tractor' | 'blade') => setBillData({ ...billData, workType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tractor">Tractor (4WD) - Per Acre</SelectItem>
              <SelectItem value="blade">Blade - Per Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {billData.workType === 'tractor' ? (
          <div>
            <Label htmlFor="acreage">Acreage *</Label>
            <Input
              id="acreage"
              type="number"
              step="0.01"
              value={billData.acreage}
              onChange={(e) => setBillData({ ...billData, acreage: e.target.value })}
              placeholder="Enter acreage"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              value={billData.hours}
              onChange={(e) => setBillData({ ...billData, hours: e.target.value })}
              placeholder="Enter hours"
            />
          </div>
        )}

        <div>
          <Label htmlFor="amountPaid">Amount Paid (Optional)</Label>
          <Input
            id="amountPaid"
            type="number"
            step="0.01"
            value={billData.amountPaid}
            onChange={(e) => setBillData({ ...billData, amountPaid: e.target.value })}
            placeholder="Enter amount paid"
          />
        </div>

        <div>
          <Label htmlFor="customDate">Date & Time</Label>
          <Input
            id="customDate"
            type="datetime-local"
            value={billData.customDate}
            onChange={(e) => setBillData({ ...billData, customDate: e.target.value })}
          />
        </div>

        <div className="bg-secondary p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary">Rs. {total.toFixed(2)}</span>
          </div>
          {billData.amountPaid && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span>Amount Paid:</span>
                <span>Rs. {parseFloat(billData.amountPaid).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Amount Due:</span>
                <span className={amountDue > 0 ? 'text-destructive' : 'text-success'}>
                  Rs. {amountDue.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={onSaveAndPrint} className="flex-1" disabled={!billData.customerName || total === 0}>
            Save & Print
          </Button>
          <Button onClick={onReset} variant="outline">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
