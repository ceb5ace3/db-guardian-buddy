import { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { BillingForm } from '@/components/BillingForm';
import { BillHistory } from '@/components/BillHistory';
import { SettingsPanel } from '@/components/SettingsPanel';
import { BackupPanel } from '@/components/BackupPanel';
import { PrintPreview } from '@/components/PrintPreview';
import { BillPreview } from '@/components/BillPreview';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Bill, Settings } from '@/types';
import { toast } from 'sonner';

type Tab = 'billing' | 'history' | 'settings' | 'backup';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('billing');
  const [settings, setSettings] = useLocalStorage<Settings>('tractorPosSettings', {
    ratePerAcre: 5000,
    ratePerHour: 3000,
  });
  const [billHistory, setBillHistory] = useLocalStorage<Bill[]>('tractorBillHistory', []);
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const [billData, setBillData] = useState({
    customerName: '',
    phoneNumber: '',
    workType: 'tractor' as 'tractor' | 'blade',
    acreage: '',
    hours: '',
    amountPaid: '',
    customDate: new Date().toISOString().slice(0, 16),
  });

  const calculateTotal = (bill = billData) => {
    if (bill.workType === 'tractor' && bill.acreage) {
      return parseFloat(bill.acreage) * settings.ratePerAcre;
    } else if (bill.workType === 'blade' && bill.hours) {
      return parseFloat(bill.hours) * settings.ratePerHour;
    }
    return 0;
  };

  const calculateDue = (bill: any = billData) => {
    const total = (bill as Bill).total !== undefined ? (bill as Bill).total : calculateTotal(bill);
    const paid = parseFloat(bill.amountPaid) || 0;
    return total - paid;
  };

  const saveBillToHistory = () => {
    const total = calculateTotal();
    if (!billData.customerName || total === 0) {
      toast.error('Please fill in customer name and work details');
      return null;
    }

    const newBill: Bill = {
      id: Date.now(),
      ...billData,
      total: total,
      amountDue: calculateDue(),
      savedDate: new Date().toISOString(),
    };

    setBillHistory([newBill, ...billHistory]);
    toast.success('Bill saved successfully!');
    return newBill;
  };

  const handleSaveAndPrint = () => {
    const bill = saveBillToHistory();
    if (bill) {
      setViewingBill(bill);
      setTimeout(() => {
        window.print();
        // Reset after print dialog closes (give user time to print)
        setTimeout(() => {
          resetForm();
        }, 1000);
      }, 300);
    }
  };

  const handlePrint = (bill: Bill) => {
    setViewingBill(bill);
    setTimeout(() => window.print(), 100);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      setBillHistory(billHistory.filter((bill) => bill.id !== id));
      if (viewingBill && viewingBill.id === id) {
        setViewingBill(null);
      }
      toast.success('Bill deleted successfully!');
    }
  };

  const handleView = (bill: Bill) => {
    setViewingBill(bill);
    setActiveTab('billing');
  };

  const resetForm = () => {
    setBillData({
      customerName: '',
      phoneNumber: '',
      workType: 'tractor',
      acreage: '',
      hours: '',
      amountPaid: '',
      customDate: new Date().toISOString().slice(0, 16),
    });
    setViewingBill(null);
  };

  const handleImport = (importedSettings: Settings, importedBills: Bill[]) => {
    setSettings(importedSettings);
    setBillHistory(importedBills);
  };

  const handleClear = () => {
    setSettings({ ratePerAcre: 5000, ratePerHour: 3000 });
    setBillHistory([]);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header billCount={billHistory.length} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} historyCount={billHistory.length} />
      
      <main className="container mx-auto px-4 py-6">
        {viewingBill && activeTab === 'billing' && (
          <div className="mb-4 bg-info/10 border border-info/20 rounded-lg p-4 flex justify-between items-center print:hidden">
            <span className="text-info">
              📄 Viewing saved bill for <strong>{viewingBill.customerName}</strong>
            </span>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition-colors"
            >
              Create New Bill
            </button>
          </div>
        )}

        {activeTab === 'billing' && !viewingBill && (
          <div className="grid lg:grid-cols-2 gap-6">
            <BillingForm
              billData={billData}
              setBillData={setBillData}
              settings={settings}
              onSaveAndPrint={handleSaveAndPrint}
              onReset={resetForm}
            />
            <div className="lg:sticky lg:top-6 h-fit">
              <h2 className="text-xl font-bold mb-4 print:hidden">Live Preview</h2>
              <BillPreview
                customerName={billData.customerName}
                phoneNumber={billData.phoneNumber}
                workType={billData.workType}
                acreage={billData.acreage}
                hours={billData.hours}
                amountPaid={billData.amountPaid}
                customDate={billData.customDate}
                settings={settings}
                total={calculateTotal()}
                amountDue={calculateDue()}
              />
            </div>
          </div>
        )}

        {activeTab === 'billing' && viewingBill && (
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Bill Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Customer:</span>{' '}
                  <span className="font-semibold">{viewingBill.customerName}</span>
                </div>
                {viewingBill.phoneNumber && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    <span className="font-semibold">{viewingBill.phoneNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Work Type:</span>{' '}
                  <span className="font-semibold">
                    {viewingBill.workType === 'tractor' ? 'Tractor (4WD)' : 'Blade'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>{' '}
                  <span className="font-semibold">
                    {viewingBill.workType === 'tractor'
                      ? `${viewingBill.acreage} acres`
                      : `${viewingBill.hours} hours`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{' '}
                  <span className="font-semibold">{new Date(viewingBill.customDate).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="text-2xl font-bold text-primary">
                    Total: Rs. {viewingBill.total.toFixed(2)}
                  </div>
                  {parseFloat(viewingBill.amountPaid) > 0 && (
                    <div className="mt-2">
                      <div>Paid: Rs. {parseFloat(viewingBill.amountPaid).toFixed(2)}</div>
                      <div className="text-xl font-bold text-destructive">
                        Due: Rs. {viewingBill.amountDue.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <BillHistory
            bills={billHistory}
            onView={handleView}
            onPrint={handlePrint}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'settings' && <SettingsPanel settings={settings} onUpdate={setSettings} />}

        {activeTab === 'backup' && (
          <BackupPanel
            settings={settings}
            bills={billHistory}
            onImport={handleImport}
            onClear={handleClear}
          />
        )}
      </main>

      <PrintPreview bill={viewingBill} settings={settings} />
    </div>
  );
};

export default Index;
