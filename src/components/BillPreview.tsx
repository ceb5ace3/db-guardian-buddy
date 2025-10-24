import { Card, CardContent } from '@/components/ui/card';
import { Settings } from '@/types';

interface BillPreviewProps {
  customerName: string;
  phoneNumber: string;
  workType: 'tractor' | 'blade';
  acreage: string;
  hours: string;
  amountPaid: string;
  customDate: string;
  settings: Settings;
  total: number;
  amountDue: number;
}

export const BillPreview = ({
  customerName,
  phoneNumber,
  workType,
  acreage,
  hours,
  amountPaid,
  customDate,
  settings,
  total,
  amountDue,
}: BillPreviewProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <Card className="print:hidden">
      <CardContent className="pt-6">
        <div className="max-w-[300px] mx-auto bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg border-2 border-dashed font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-400">
            <h2 className="text-xl font-bold">ABEYSINGHE</h2>
            <p className="text-xs mt-1">Tractor Services (4WD) &</p>
            <p className="text-xs">Blade</p>
            <p className="text-xs mt-1">සියලුම ට්‍රැක්ටර් වැඩ කටයුතු (4WD)</p>
            <p className="text-xs mt-1">+94 74 014 9500</p>
          </div>

          {/* Customer */}
          <div className="mb-3">
            <div className="flex justify-between">
              <span className="font-semibold">නම:</span>
              <span>{customerName || '___________'}</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between">
              <span className="font-semibold">Number:</span>
              <span>{phoneNumber || '___________'}</span>
            </div>
          </div>

          {/* Work Type & Details */}
          <div className="mb-3 pb-3 border-b border-dashed border-gray-400">
            <div className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">Work Type:</span>
                <span>{workType === 'tractor' ? 'Tractor (4WD)' : 'Blade'}</span>
              </div>
            </div>

            {workType === 'tractor' ? (
              <>
                <div className="flex justify-between">
                  <span>අක්කර:</span>
                  <span>{acreage || '0'} </span>
                </div>
                <div className="flex justify-between">
                  <span>අක්කරයකට</span>
                  <span>මිල:</span>
                  <span>රු.</span>
                  <span>{settings.ratePerAcre.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>පැය:</span>
                  <span>{hours || '0'} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>පැයකට</span>
                  <span>මිල:</span>
                  <span>රු.</span>
                  <span>{settings.ratePerHour.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Total */}
          <div className="mb-3 pb-3 border-b border-dashed border-gray-400">
            <div className="flex justify-between items-center">
              <span className="font-bold">මුළු මිල: රු.</span>
              <span className="text-lg font-bold">{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          {amountPaid && parseFloat(amountPaid) > 0 && (
            <div className="mb-3 pb-3 border-b border-dashed border-gray-400">
              <div className="flex justify-between">
                <span>ගෙවූ මිල:</span>
                <span>Rs. {parseFloat(amountPaid).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">ගෙවීමට ඇති</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">මුදල:</span>
                <span className="text-lg font-bold">{amountDue.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="mb-4 pb-4 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>දිනය:</span>
              <span>{formatDate(customDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>වේලාව:</span>
              <span>{formatTime(customDate)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs">
            <p className="mb-2">Thank you for your business!</p>
            <p className="font-semibold">POS System by</p>
            <p className="font-semibold">Imesh S Abeysinghe</p>
            <p>+94 77 002 5374</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
