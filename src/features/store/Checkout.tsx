import { motion } from 'framer-motion';
import { useState } from 'react';
import { BandageIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { formatVnd, type BandagePack } from '../../data/packs';
import { cn } from '../../lib/cn';
import { playSound } from '../../lib/sound';
import { useWalletStore } from '../../store/wallet';

const METHODS = [
  { id: 'momo', label: 'Ví MoMo', color: '#a50064' },
  { id: 'zalopay', label: 'ZaloPay', color: '#0068ff' },
  { id: 'card', label: 'Thẻ ATM / Visa', color: '#3b2d26' },
  { id: 'store', label: 'App Store / Google Play', color: '#3d7a2c' },
] as const;

type Step = 'choose' | 'paying' | 'done';

/**
 * Checkout for a bandage pack bought with real money. The demo has no payment provider:
 * "Thanh toán" simulates a successful payment and credits the bandages.
 */
export function Checkout({ pack, onClose }: { pack: BandagePack | null; onClose: () => void }) {
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('momo');
  const [step, setStep] = useState<Step>('choose');

  const close = () => {
    if (step === 'paying') return;
    setStep('choose');
    onClose();
  };

  const pay = () => {
    if (!pack) return;
    setStep('paying');
    window.setTimeout(() => {
      useWalletStore.getState().earn(pack.amount);
      playSound('win');
      setStep('done');
    }, 1200);
  };

  return (
    <Modal
      open={pack !== null}
      onClose={step === 'paying' ? undefined : close}
      title={step === 'done' ? 'Mua thành công!' : 'Thanh toán'}
      tone={step === 'done' ? 'green' : 'navy'}
      sparkle={step === 'done'}
    >
      {pack && (
        <div className="flex flex-col gap-3">
          <div className="ink-border flex items-center gap-3 rounded-2xl bg-[#fff1c2] p-2.5">
            <BandageIcon size={44} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl leading-tight text-navy">{pack.name}</p>
              <p className="text-sm text-muted">+{pack.amount.toLocaleString('vi-VN')} băng gạc</p>
            </div>
            <p className="font-display text-2xl text-primary-dark">{formatVnd(pack.price)}</p>
          </div>

          {step === 'done' ? (
            <>
              <motion.p
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-1 font-display text-3xl text-success-dark"
              >
                +{pack.amount.toLocaleString('vi-VN')} <BandageIcon size={34} />
              </motion.p>
              <Button size="lg" variant="green" block onClick={close}>
                Tuyệt vời!
              </Button>
            </>
          ) : (
            <>
              <fieldset disabled={step === 'paying'}>
                <legend className="mb-1 font-display text-base text-navy">
                  Phương thức thanh toán
                </legend>
                <div className="grid grid-cols-2 gap-1.5">
                  {METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        'ink-border flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-[14px] font-semibold text-navy',
                        method === m.id ? 'bg-accent shadow-pop' : 'bg-paper',
                      )}
                    >
                      <input
                        type="radio"
                        name="pay-method"
                        className="sr-only"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                      />
                      <span
                        aria-hidden
                        className="h-4 w-4 shrink-0 rounded-full border-2 border-navy"
                        style={{ backgroundColor: method === m.id ? m.color : 'transparent' }}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Button size="lg" block disabled={step === 'paying'} onClick={pay}>
                {step === 'paying' ? 'Đang xử lý…' : `Thanh toán ${formatVnd(pack.price)}`}
              </Button>
              <p className="-mt-1 text-center text-[11px] leading-snug text-muted">
                Bản demo: không trừ tiền thật. Gói băng gạc không phải gói Premium – vẫn có quảng
                cáo.
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
