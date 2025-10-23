import { Bill, Settings } from '@/types';

interface PrintPreviewProps {
  bill: Bill | null;
  settings: Settings;
}

export const PrintPreview = ({ bill, settings }: PrintPreviewProps) => {
  if (!bill) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div id="printArea" className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printArea, #printArea * {
            visibility: visible;
          }
          #printArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
          }
        }
      `}</style>
      <div>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #000' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>ABEYSINGHE</div>
          <div style={{ fontSize: '10px' }}>Tractor Services (4WD) &</div>
          <div style={{ fontSize: '10px' }}>Blade</div>
          <div style={{ fontSize: '10px', marginTop: '3px' }}>බයේසිංහ ට්‍රැක්ටර් සේවා (4WD)</div>
          <div style={{ fontSize: '10px', marginTop: '3px' }}>+94 74 014 9500</div>
        </div>

        {/* Customer */}
        <div style={{ marginBottom: '8px' }}>
          <div><strong>Customer:</strong> {bill.customerName}</div>
          {bill.phoneNumber && <div style={{ fontSize: '10px', marginTop: '2px' }}>{bill.phoneNumber}</div>}
        </div>

        {/* Work Details */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #000' }}>
          <div><strong>Work Type:</strong> {bill.workType === 'tractor' ? 'Tractor (4WD)' : 'Blade'}</div>
          {bill.workType === 'tractor' ? (
            <>
              <div style={{ marginTop: '3px' }}>අක්කරය: {bill.acreage} acres</div>
              <div>අක්කරයකට Rs.</div>
              <div>මිල: {settings.ratePerAcre.toFixed(2)}</div>
            </>
          ) : (
            <>
              <div style={{ marginTop: '3px' }}>පැය: {bill.hours} hours</div>
              <div>පැයකට Rs.</div>
              <div>මිල: {settings.ratePerHour.toFixed(2)}</div>
            </>
          )}
        </div>

        {/* Total */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>මුළු මිල: රු.</strong>
            <strong style={{ fontSize: '16px' }}>{bill.total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Payment */}
        {parseFloat(bill.amountPaid) > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #000' }}>
            <div>ගෙවූ මිල: Rs. {parseFloat(bill.amountPaid).toFixed(2)}</div>
            <div style={{ marginTop: '5px' }}>
              <strong>ගෙවීමට ඇති රු.</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>මිල:</strong>
              <strong style={{ fontSize: '16px' }}>{bill.amountDue.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #000' }}>
          <div>දිනය: {formatDate(bill.customDate)}</div>
          <div>වේලාව: {formatTime(bill.customDate)}</div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '10px' }}>
          <div style={{ marginBottom: '5px' }}>Thank you for your business!</div>
          <div style={{ fontWeight: 'bold' }}>POS System by</div>
          <div style={{ fontWeight: 'bold' }}>Imesh S Abeysinghe</div>
          <div>+94 77 002 5374</div>
        </div>
      </div>
    </div>
  );
};
