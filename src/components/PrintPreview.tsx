import { Bill, Settings } from '@/types';

interface PrintPreviewProps {
  bill: Bill | null;
  settings: Settings;
}

export const PrintPreview = ({ bill, settings }: PrintPreviewProps) => {
  if (!bill) return null;

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
          }
        }
      `}</style>
      <div style={{ fontSize: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>TRACTOR WORK</div>
          <div>Abeysinghe</div>
          <div>+94740149500</div>
          <div style={{ borderBottom: '1px dashed #000', margin: '5px 0' }}></div>
        </div>

        <div>
          <div><strong>Customer:</strong> {bill.customerName}</div>
          {bill.phoneNumber && <div><strong>Phone:</strong> {bill.phoneNumber}</div>}
          <div><strong>Date:</strong> {new Date(bill.customDate).toLocaleString()}</div>
          <div style={{ borderBottom: '1px dashed #000', margin: '5px 0' }}></div>
        </div>

        <div>
          <div><strong>Work Type:</strong> {bill.workType === 'tractor' ? 'Tractor (4WD)' : 'Blade'}</div>
          {bill.workType === 'tractor' ? (
            <>
              <div><strong>Acreage:</strong> {bill.acreage} acres</div>
              <div><strong>Rate:</strong> Rs. {settings.ratePerAcre}/acre</div>
            </>
          ) : (
            <>
              <div><strong>Hours:</strong> {bill.hours} hours</div>
              <div><strong>Rate:</strong> Rs. {settings.ratePerHour}/hour</div>
            </>
          )}
          <div style={{ borderBottom: '1px dashed #000', margin: '5px 0' }}></div>
        </div>

        <div>
          <div style={{ fontSize: '14px' }}><strong>Total:</strong> Rs. {bill.total.toFixed(2)}</div>
          {parseFloat(bill.amountPaid) > 0 && (
            <>
              <div><strong>Paid:</strong> Rs. {parseFloat(bill.amountPaid).toFixed(2)}</div>
              <div style={{ fontSize: '14px' }}><strong>Due:</strong> Rs. {bill.amountDue.toFixed(2)}</div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px' }}>
          <div>Thank you for your business!</div>
        </div>
      </div>
    </div>
  );
};
