import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KeyRound,
  ChevronDown,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Settings2,
  History,
} from 'lucide-react';
import {
  generateToken,
  derivePublicKey,
  previewLicenseDates,
  defaultExpiresAtLocal,
  toDatetimeLocalValue,
  DEFAULT_BUILD_CONSTRAINT,
  DEFAULT_DURATION_DAYS,
  DEFAULT_STATION_LIMIT,
  DEFAULT_SIGNATURE_VERSION,
} from '../utils/crypto.js';
import { pushTokenHistory, loadTokenHistory } from '../utils/history.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useSessionPrivateKey } from '../hooks/useSessionPrivateKey.js';
import SecurityNotice from '../components/SecurityNotice.jsx';
import ResultField from '../components/ResultField.jsx';
import CopyButton from '../components/CopyButton.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PageShell from '../components/ui/PageShell.jsx';
import SectionCard from '../components/ui/SectionCard.jsx';
import LicensePreview from '../components/ui/LicensePreview.jsx';
import ChipGroup from '../components/ui/ChipGroup.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import FieldError from '../components/ui/FieldError.jsx';

const DURATION_PRESETS = [
  { value: 7, label: '7 أيام' },
  { value: 14, label: '14 يوم' },
  { value: 30, label: '30 يوم' },
  { value: 90, label: '3 أشهر' },
  { value: 365, label: 'سنة' },
];

const STATION_PRESETS = [
  { value: 3, label: '3' },
  { value: 6, label: '6' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const EXPIRY_MODES = [
  { id: 'datetime', label: 'تاريخ ووقت محدد' },
  { id: 'duration', label: 'مدة بالأيام' },
];

const INITIAL_FORM = {
  shopName: '',
  planType: 'trial',
  installationId: '',
  deviceHintsHash: '',
  expiryMode: 'datetime',
  expiresAt: defaultExpiresAtLocal(DEFAULT_DURATION_DAYS),
  durationDays: DEFAULT_DURATION_DAYS,
  stationLimit: DEFAULT_STATION_LIMIT,
  buildConstraint: DEFAULT_BUILD_CONSTRAINT,
  startsAt: '',
  issuedAt: '',
  signatureVersion: DEFAULT_SIGNATURE_VERSION,
};

function expiresAtFromDuration(startsAt, days) {
  const base = startsAt ? new Date(startsAt) : new Date();
  const end = new Date(base.getTime() + Number(days) * 24 * 60 * 60 * 1000);
  return toDatetimeLocalValue(end);
}

export default function GenerateToken({ onToast }) {
  const { privateKey, setPrivateKey, clearPrivateKey } = useSessionPrivateKey();
  const [draft, setDraft] = useLocalStorage('pj_token_draft', INITIAL_FORM);
  const [form, setForm] = useState({ ...INITIAL_FORM, ...draft });
  const [derivedPublicKey, setDerivedPublicKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [history, setHistory] = useState(loadTokenHistory);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pj_token_draft');
      if (!raw || !raw.includes('privateKey')) return;
      const parsed = JSON.parse(raw);
      if (parsed.privateKey) {
        setPrivateKey(parsed.privateKey);
        const { privateKey: _legacy, ...rest } = parsed;
        setDraft(rest);
        setForm((prev) => ({ ...rest, ...prev }));
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  useEffect(() => {
    setDraft(form);
  }, [form]);

  useEffect(() => {
    const key = privateKey.trim();
    if (!key) {
      setDerivedPublicKey('');
      setKeyError('');
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setDerivedPublicKey(await derivePublicKey(key));
        setKeyError('');
      } catch (e) {
        setDerivedPublicKey('');
        setKeyError(e.message);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [privateKey]);

  const preview = useMemo(() => {
    try {
      if (form.expiryMode === 'datetime') {
        if (!form.expiresAt) return null;
        return previewLicenseDates({
          expiresAt: form.expiresAt,
          startsAt: form.startsAt || undefined,
          issuedAt: form.issuedAt || undefined,
        });
      }
      if (!form.durationDays || Number(form.durationDays) < 1) return null;
      return previewLicenseDates({
        durationDays: form.durationDays,
        startsAt: form.startsAt || undefined,
        issuedAt: form.issuedAt || undefined,
      });
    } catch {
      return null;
    }
  }, [
    form.expiryMode,
    form.expiresAt,
    form.durationDays,
    form.startsAt,
    form.issuedAt,
  ]);

  const set = useCallback(
    (field) => (e) => {
      const value =
        e.target.type === 'number' ? e.target.valueAsNumber || '' : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!privateKey.trim()) errs.privateKey = 'المفتاح الخاص مطلوب';
    if (keyError) errs.privateKey = keyError;
    if (!form.shopName.trim()) errs.shopName = 'اسم المحل مطلوب';
    if (!form.installationId.trim()) errs.installationId = 'Installation ID مطلوب';
    if (!form.deviceHintsHash.trim()) errs.deviceHintsHash = 'Device Fingerprint مطلوب';
    if (form.expiryMode === 'datetime') {
      if (!form.expiresAt) {
        errs.expiresAt = 'تاريخ الانتهاء مطلوب';
      } else {
        const end = new Date(form.expiresAt);
        const start = form.startsAt ? new Date(form.startsAt) : new Date();
        if (Number.isNaN(end.getTime())) {
          errs.expiresAt = 'تاريخ غير صالح';
        } else if (end <= start) {
          errs.expiresAt = 'يجب أن يكون بعد تاريخ البداية';
        }
      }
    } else if (!form.durationDays || Number(form.durationDays) < 1) {
      errs.durationDays = 'يجب أن يكون أكبر من 0';
    }
    if (!form.stationLimit || Number(form.stationLimit) < 1)
      errs.stationLimit = 'يجب أن يكون أكبر من 0';
    return errs;
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      onToast('يرجى تصحيح الأخطاء أولاً', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await generateToken({
        privateKeyB64: privateKey.trim(),
        shopName: form.shopName.trim(),
        planType: form.planType,
        installationId: form.installationId.trim(),
        deviceHintsHash: form.deviceHintsHash.trim(),
        durationDays:
          form.expiryMode === 'duration' ? Number(form.durationDays) : undefined,
        expiresAt: form.expiryMode === 'datetime' ? form.expiresAt : undefined,
        stationLimit: Number(form.stationLimit),
        startsAt: form.startsAt || undefined,
        issuedAt: form.issuedAt || undefined,
        buildConstraint: form.buildConstraint.trim() || null,
        signatureVersion: Number(form.signatureVersion) || DEFAULT_SIGNATURE_VERSION,
      });
      setResult(res);
      const nextHistory = pushTokenHistory({
        shopName: res.payload.shopName,
        planType: res.payload.planType,
        stationLimit: res.payload.stationLimit,
        expiresAtUtc: res.payload.expiresAtUtc,
        token: res.token,
        publicKeyB64: res.publicKeyB64,
      });
      setHistory(nextHistory);
      onToast('تم توليد Token بنجاح!', 'success');
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } catch (err) {
      onToast(`خطأ: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [form, privateKey, keyError]);

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setDraft(INITIAL_FORM);
    clearPrivateKey();
    setResult(null);
    setErrors({});
    setDerivedPublicKey('');
    setKeyError('');
  };

  const loadFromHistory = (item) => {
    setForm((prev) => ({
      ...prev,
      shopName: item.shopName || prev.shopName,
      planType: item.planType || prev.planType,
      stationLimit: item.stationLimit || prev.stationLimit,
    }));
    onToast('تم التحميل', 'success');
  };

  return (
    <PageShell>
      <PageHeader
        icon={KeyRound}
        title="توليد Token"
        subtitle="أنشئ كود تفعيل موقّع بتوقيع Ed25519 — متوافق مع تطبيق Flutter."
      />

      <SecurityNotice>
        المفتاح الخاص يُخزَّن في جلسة المتصفح فقط (يُمسح عند إغلاق التبويب) ولا يُحفظ في
        localStorage. للإنتاج يُفضَّل التوقيع عبر{' '}
        <code className="font-mono text-xs">playtime/tool/dev_license_tool.dart</code> أو{' '}
        <code className="font-mono text-xs">DashBoard/main.py</code> على جهاز معزول.
      </SecurityNotice>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <SectionCard icon={KeyRound} title="المفتاح الخاص">
            <label className="label-text">
              المفتاح الخاص <span className="text-violet-400">*</span>
            </label>
            <textarea
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                setErrors((prev) => ({ ...prev, privateKey: undefined }));
              }}
              placeholder="PRIVATE_KEY_B64"
              rows={3}
              className={`input-field font-mono text-xs resize-none ${errors.privateKey ? 'input-field-error' : ''}`}
            />
            <FieldError msg={errors.privateKey} />
            {derivedPublicKey && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 animate-scale-in">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    المفتاح العام المشتق
                  </span>
                  <CopyButton value={derivedPublicKey} />
                </div>
                <p className="font-mono text-[11px] text-emerald-300/90 break-all leading-relaxed">
                  {derivedPublicKey}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard icon={Sparkles} title="الترخيص">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">اسم المحل *</label>
                  <input
                    className={`input-field ${errors.shopName ? 'input-field-error' : ''}`}
                    value={form.shopName}
                    onChange={set('shopName')}
                    placeholder="shopName"
                  />
                  <FieldError msg={errors.shopName} />
                </div>
                <div>
                  <label className="label-text">نوع الخطة *</label>
                  <select className="input-field cursor-pointer" value={form.planType} onChange={set('planType')}>
                    <option value="trial">trial</option>
                    <option value="subscription">subscription</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text">Installation ID *</label>
                <input
                  className={`input-field font-mono text-xs ${errors.installationId ? 'input-field-error' : ''}`}
                  value={form.installationId}
                  onChange={set('installationId')}
                  placeholder="installationId"
                />
                <FieldError msg={errors.installationId} />
              </div>

              <div>
                <label className="label-text">Device Fingerprint *</label>
                <input
                  className={`input-field font-mono text-xs ${errors.deviceHintsHash ? 'input-field-error' : ''}`}
                  value={form.deviceHintsHash}
                  onChange={set('deviceHintsHash')}
                  placeholder="deviceHintsHash"
                />
                <FieldError msg={errors.deviceHintsHash} />
              </div>

              <div>
                <label className="label-text mb-3">انتهاء الترخيص *</label>
                <SegmentedControl
                  className="w-full mb-4 flex"
                  options={EXPIRY_MODES}
                  value={form.expiryMode}
                  onChange={(id) => {
                    setField('expiryMode', id);
                    if (id === 'datetime' && !form.expiresAt) {
                      setField(
                        'expiresAt',
                        expiresAtFromDuration(form.startsAt, form.durationDays)
                      );
                    }
                  }}
                />

                {form.expiryMode === 'datetime' ? (
                  <>
                    <label className="label-text">تاريخ ووقت الانتهاء *</label>
                    <input
                      type="datetime-local"
                      className={`input-field ${errors.expiresAt ? 'input-field-error' : ''}`}
                      value={form.expiresAt}
                      onChange={set('expiresAt')}
                    />
                    <FieldError msg={errors.expiresAt} />
                    <p className="mt-2 text-[11px] text-gray-600">
                      يُحفظ بالتوقيت المحلي ويُحوَّل تلقائياً إلى UTC في التوكن
                    </p>
                    <p className="label-text mb-2 mt-4">اختصارات سريعة</p>
                    <ChipGroup
                      options={DURATION_PRESETS}
                      value={null}
                      onChange={(v) =>
                        setField('expiresAt', expiresAtFromDuration(form.startsAt, v))
                      }
                    />
                  </>
                ) : (
                  <>
                    <label className="label-text mb-2">مدة التفعيل (بالأيام)</label>
                    <ChipGroup
                      options={DURATION_PRESETS}
                      value={Number(form.durationDays)}
                      onChange={(v) => setField('durationDays', v)}
                    />
                    <input
                      type="number"
                      min={1}
                      className={`input-field mt-2 ${errors.durationDays ? 'input-field-error' : ''}`}
                      value={form.durationDays}
                      onChange={set('durationDays')}
                    />
                    <FieldError msg={errors.durationDays} />
                    <p className="mt-2 text-[11px] text-gray-600">
                      يُحسب تاريخ الانتهاء من تاريخ البداية + عدد الأيام
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="label-text mb-2">عدد المحطات</label>
                <ChipGroup
                  options={STATION_PRESETS}
                  value={Number(form.stationLimit)}
                  onChange={(v) => setField('stationLimit', v)}
                />
                <input
                  type="number"
                  min={1}
                  className={`input-field mt-2 ${errors.stationLimit ? 'input-field-error' : ''}`}
                  value={form.stationLimit}
                  onChange={set('stationLimit')}
                />
                <FieldError msg={errors.stationLimit} />
              </div>
            </div>
          </SectionCard>

          <div className="surface overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Settings2 className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-semibold text-zinc-300">إعدادات متقدمة</span>
                <span className="text-[10px] text-zinc-600 px-2 py-0.5 rounded-md bg-zinc-900/80">اختياري</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>
            {showAdvanced && (
              <div className="px-5 pb-5 pt-0 border-t border-white/[0.06] space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="label-text">تاريخ البداية</label>
                    <input type="datetime-local" className="input-field" value={form.startsAt} onChange={set('startsAt')} />
                  </div>
                  <div>
                    <label className="label-text">تاريخ الإصدار</label>
                    <input type="datetime-local" className="input-field" value={form.issuedAt} onChange={set('issuedAt')} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Build Constraint</label>
                    <input className="input-field font-mono text-xs" value={form.buildConstraint} onChange={set('buildConstraint')} />
                  </div>
                  <div>
                    <label className="label-text">Signature Version</label>
                    <input type="number" min={1} className="input-field" value={form.signatureVersion} onChange={set('signatureVersion')} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'جارٍ التوليد...' : 'توليد Token'}
            </button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </button>
          </div>
        </form>

        <div className="space-y-5">
          <LicensePreview preview={preview} form={form} derivedPublicKey={derivedPublicKey} />

          {history.length > 0 && (
            <div className="surface overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-600" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">السجل</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-white/[0.04]">
                {history.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => loadFromHistory(item)}
                    className="w-full px-4 py-3 text-right hover:bg-violet-500/[0.06] transition-colors duration-200"
                  >
                    <p className="text-xs font-medium text-zinc-300 truncate">{item.shopName}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {item.stationLimit} محطة · {item.planType}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div id="result-section" className="animate-fade-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50">تم التوليد بنجاح</h3>
              <p className="text-xs text-zinc-500 mt-0.5">انسخ Token وأرسله للعميل</p>
            </div>
            <span className="mr-auto badge-success">PT1</span>
          </div>
          <div className="surface p-6 space-y-5">
            <ResultField label="Public Key" value={result.publicKeyB64} mono badge="Ed25519" />
            <div className="border-t border-white/[0.06]" />
            <ResultField label="Token" value={result.token} mono badge="PT1" />
            <div className="border-t border-white/[0.06]" />
            <ResultField label="Payload JSON" value={result.payloadJson} multiline />
            <div className="border-t border-white/[0.06]" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                أمر تشغيل Flutter
              </p>
              <div className="flex items-start gap-2">
                <pre className="code-block flex-1 text-amber-200/90 whitespace-pre">{result.flutterCommand}</pre>
                <CopyButton value={result.flutterCommand} />
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
