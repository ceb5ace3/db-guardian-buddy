import { Bill, Settings } from '@/types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

async function printReceipt() {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    window.print();
    return;
  }

  const printContent = document.getElementById('printArea');
  if (!printContent) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: monospace; padding: 20px; max-width: 80mm; margin: 0 auto; }
          /* Add all your print styles here */
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
      </body>
    </html>
  `;

  // Create data URL
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Open in system browser (which has print functionality)
  await Browser.open({ url });
}

// Export this function
export { printReceipt };

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
          <div style={{ fontSize: '10px', marginTop: '3px' }}>සියලුම ට්‍රැක්ටර් වැඩ කටයුතු (4WD)</div>
          <div style={{ fontSize: '10px', marginTop: '3px' }}>+94 74 014 9500</div>
        </div>

        {/* Customer */}
        <div style={{ marginBottom: '8px' }}>
          <div><strong>නම:</strong> {bill.customerName}</div>
          <div><strong>දු.අං.:</strong> {bill.phoneNumber}</div>
        </div>

        {/* Work Details */}
        <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #000' }}>
          <div><strong>Work Type:</strong> {bill.workType === 'tractor' ? 'Tractor (4WD)' : 'Blade'}</div>
          {bill.workType === 'tractor' ? (
            <>
              <div style={{ marginTop: '3px' }}>අක්කර: {bill.acreage} යි</div>
              <div>අක්කරයකට මිල:</div>
              <div>රු. {settings.ratePerAcre.toFixed(2)}</div>
            </>
          ) : (
            <>
              <div style={{ marginTop: '3px' }}>පැය: {bill.hours} hours</div>
              <div>පැයකට මිල:</div>
              <div>රු. {settings.ratePerHour.toFixed(2)}</div>
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
            <div>ගෙවූ මිල: රු. {parseFloat(bill.amountPaid).toFixed(2)}</div>
            <div style={{ marginTop: '5px' }}>
              <strong>ගෙවීමට ඇති මුදල</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>රු.</strong>
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
