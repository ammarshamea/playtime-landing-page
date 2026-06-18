import React, { useState } from 'react';
import {
  ScanSearch,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Layers,
  Monitor,
  RotateCcw,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';
import { decodeToken, verifyTokenSignature } from '../utils/crypto.js';
import ResultField from '../components/ResultField.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PageShell from '../components/ui/PageShell.jsx';
import SectionCard from '../components/ui/SectionCard.jsx';
import FieldError from '../components/ui/FieldError.jsx';

function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    return new Date(isoStr).toLocaleString('ar-SA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return isoStr;
  }
}

function isExpired(expiresAtUtc) {
  return expiresAtUtc ? new Date(expiresAtUtc) < new Date() : false;
}

function daysLeft(expiresAtUtc) {
  if (!expiresAtUtc) return null;
  return Math.ceil((new Date(expiresAtUtc) - new Date()) / (1000 * 60 * 60 * 24));
}

function TimelineBar({ starts, expires, now = new Date() }) {
  const start = new Date(starts).getTime();
  const end = new Date(expires).getTime();
  const t = now.getTime();
  const total = end - start;
  const progress = total > 0 ? Math.min(100, Math.max(0, ((t - start) / total) * 100)) : 0;
  const expired = t > end;

  return (
    <div className="mt-4">
      <div className="h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-spring ${
            expired ? 'bg-red-500' : 'bg-gradient-to-l from-violet-500 to-indigo-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
        <span>البداية</span>
        <span className="tabular-nums">{expired ? 'منتهي' : `${Math.round(progress)}%`}</span>
        <span>الانتهاء</span>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = 'text-zinc-200' }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-white/[0.04] last:border-0">
      <div className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-white/[0.04] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-zinc-600" />
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-[11px] text-zinc-600 mb-0.5">{label}</p>
        <p className={`text-sm font-medium break-all ${valueClass}`}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function DecodeToken({ onToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [signatureValid, setSignatureValid] = useState(null);
  const [error, setError] = useState('');

  const handleDecode = async (e) => {
    e.preventDefault();
    const raw = tokenInput.trim();
    if (!raw) {
      setError('يرجى إدخال Token أولاً');
      return;
    }

    setLoading(true);
    setResult(null);
    setSignatureValid(null);
    setError('');

    try {
      const decoded = decodeToken(raw);
      setResult(decoded);
      onToast('تم فك التوكن بنجاح', 'success');

      if (publicKeyInput.trim()) {
        setVerifying(true);
        try {
          const { valid } = await verifyTokenSignature(raw, publicKeyInput.trim());
          setSignatureValid(valid);
          onToast(valid ? 'التوقيع صحيح' : 'التوقيع غير صحيح', valid ? 'success' : 'error');
        } catch (ve) {
          setSignatureValid(false);
          onToast(ve.message, 'error');
        } finally {
          setVerifying(false);
        }
      }
    } catch (err) {
      setError(err.message);
      onToast(`خطأ: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOnly = async () => {
    if (!tokenInput.trim() || !publicKeyInput.trim()) {
      onToast('أدخل Token والمفتاح العام', 'error');
      return;
    }
    setVerifying(true);
    try {
      const { valid } = await verifyTokenSignature(tokenInput.trim(), publicKeyInput.trim());
      setSignatureValid(valid);
      onToast(valid ? 'التوقيع صحيح' : 'التوقيع غير صحيح', valid ? 'success' : 'error');
    } catch (e) {
      setSignatureValid(false);
      onToast(e.message, 'error');
    } finally {
      setVerifying(false);
    }
  };

  const payload = result?.payload;
  const expired = payload ? isExpired(payload.expiresAtUtc) : false;
  const remaining = payload ? daysLeft(payload.expiresAtUtc) : null;

  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        icon={ScanSearch}
        title="قراءة Token"
        subtitle="فك تشفير وتحليل محتوى Token — التحقق من التوقيع اختياري."
      />

      <form onSubmit={handleDecode} className="space-y-4">
        <SectionCard title="Token" accent="violet">
          <label className="label-text">الصق Token هنا</label>
          <textarea
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.target.value);
              setError('');
            }}
            placeholder="PT1.eyJzaG9wTmFtZSI6..."
            rows={4}
            className={`input-field font-mono text-xs resize-none ${error ? 'input-field-error' : ''}`}
          />
          <FieldError msg={error} />
        </SectionCard>

        <SectionCard icon={ShieldCheck} title="التحقق من التوقيع" accent="indigo" subtitle="اختياري">
          <label className="label-text">المفتاح العام</label>
          <input
            className="input-field font-mono text-xs"
            value={publicKeyInput}
            onChange={(e) => setPublicKeyInput(e.target.value)}
            placeholder="PUBLIC_KEY_B64"
          />
          <button
            type="button"
            onClick={handleVerifyOnly}
            disabled={verifying || !tokenInput.trim() || !publicKeyInput.trim()}
            className="btn-secondary mt-3 text-xs"
          >
            {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            تحقق من التوقيع
          </button>
        </SectionCard>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading || !tokenInput.trim()} className="btn-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
            {loading ? 'جارٍ القراءة…' : 'قراءة Token'}
          </button>
          {tokenInput && (
            <button
              type="button"
              onClick={() => {
                setTokenInput('');
                setResult(null);
                setSignatureValid(null);
                setError('');
              }}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              مسح
            </button>
          )}
        </div>
      </form>

      {signatureValid !== null && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 animate-scale-in ${
            signatureValid
              ? 'bg-emerald-500/[0.06] border-emerald-500/25'
              : 'bg-red-500/[0.06] border-red-500/25'
          }`}
        >
          {signatureValid ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          ) : (
            <ShieldX className="w-6 h-6 text-red-400 flex-shrink-0" />
          )}
          <p className={`text-sm font-semibold ${signatureValid ? 'text-emerald-300' : 'text-red-300'}`}>
            {signatureValid ? 'التوقيع صحيح' : 'التوقيع غير صالح'}
          </p>
        </div>
      )}

      {result && payload && (
        <div className="space-y-5 animate-fade-up">
          <div
            className={`p-5 rounded-2xl border flex items-center gap-4 ${
              expired
                ? 'bg-red-500/[0.04] border-red-500/20'
                : 'bg-emerald-500/[0.04] border-emerald-500/20'
            }`}
          >
            {expired ? (
              <AlertCircle className="w-9 h-9 text-red-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-9 h-9 text-emerald-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-lg font-bold ${expired ? 'text-red-300' : 'text-emerald-300'}`}>
                {expired ? 'Token منتهي' : 'Token نشط'}
              </p>
              {remaining !== null && (
                <p className="text-sm text-zinc-500 mt-1">
                  {expired ? `انتهى منذ ${Math.abs(remaining)} يوم` : `متبقٍ ${remaining} يوم`}
                </p>
              )}
              <TimelineBar starts={payload.startsAtUtc} expires={payload.expiresAtUtc} />
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase flex-shrink-0 ${
                payload.planType === 'subscription'
                  ? 'badge-violet'
                  : 'badge-warning'
              }`}
            >
              {payload.planType}
            </span>
          </div>

          <div className="surface px-5">
            <InfoRow icon={Hash} label="اسم المحل" value={payload.shopName} />
            <InfoRow icon={Layers} label="نوع الخطة" value={payload.planType} />
            <InfoRow icon={Calendar} label="تاريخ البداية" value={formatDate(payload.startsAtUtc)} />
            <InfoRow
              icon={Calendar}
              label="تاريخ الانتهاء"
              value={formatDate(payload.expiresAtUtc)}
              valueClass={expired ? 'text-red-400' : 'text-emerald-400'}
            />
            <InfoRow icon={Calendar} label="تاريخ الإصدار" value={formatDate(payload.issuedAtUtc)} />
            <InfoRow
              icon={Hash}
              label="Installation ID"
              value={payload.installationId}
              valueClass="font-mono text-xs text-zinc-400"
            />
            <InfoRow
              icon={Monitor}
              label="Device Fingerprint"
              value={payload.deviceHintsHash}
              valueClass="font-mono text-xs text-zinc-400"
            />
            <InfoRow icon={Monitor} label="عدد المحطات" value={`${payload.stationLimit} محطة`} />
            <InfoRow
              icon={Hash}
              label="Build Constraint"
              value={payload.buildConstraint ?? '—'}
              valueClass="font-mono text-xs text-zinc-400"
            />
          </div>

          <div className="surface p-5 space-y-4">
            <ResultField label="التوقيع" value={result.signatureB64} mono badge="Ed25519" />
            <ResultField label="Payload JSON" value={result.payloadJson} multiline />
          </div>
        </div>
      )}
    </PageShell>
  );
}
