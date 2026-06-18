import React, { useState } from 'react';
import {
  Key,
  RefreshCw,
  Loader2,
  Shield,
  Terminal,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { generateKeyPair, DEFAULT_BUILD_CONSTRAINT } from '../utils/crypto.js';
import ResultField from '../components/ResultField.jsx';
import CopyButton from '../components/CopyButton.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PageShell from '../components/ui/PageShell.jsx';
import SectionCard from '../components/ui/SectionCard.jsx';
import SecurityNotice from '../components/SecurityNotice.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function GenerateKeys({ onToast }) {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const [showPrivate, setShowPrivate] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateKeyPair();
      setKeys(result);
      setShowPrivate(false);
      onToast('تم توليد المفاتيح', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const flutterCommand = keys
    ? `flutter run --dart-define=LICENSE_PUBLIC_KEY_B64=${keys.publicKeyB64} --dart-define=APP_BUILD=${DEFAULT_BUILD_CONSTRAINT}`
    : '';

  const envFile = keys
    ? `PRIVATE_KEY_B64=${keys.privateKeyB64}\nPUBLIC_KEY_B64=${keys.publicKeyB64}\n`
    : '';

  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        icon={Key}
        title="توليد المفاتيح"
        subtitle="أنشئ زوج مفاتيح Ed25519 جديد للتوقيع والتحقق في التطبيق."
      />

      <SecurityNotice>
        احفظ المفتاح الخاص في مكان آمن خارج المتصفح. لا ترفع ملف keys.env إلى Git.
        للتوزيع استخدم المفتاح العام فقط داخل التطبيق.
      </SecurityNotice>

      <button onClick={handleGenerate} disabled={loading} className="btn-primary">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        {loading ? 'جارٍ التوليد…' : keys ? 'إعادة التوليد' : 'توليد مفاتيح جديدة'}
      </button>

      {!keys && !loading && (
        <EmptyState
          icon={Key}
          title="لا توجد مفاتيح بعد"
          description="اضغط الزر أعلاه لإنشاء زوج مفاتيح Ed25519"
        />
      )}

      {keys && (
        <div className="space-y-4">
          <SectionCard icon={Shield} title="المفتاح الخاص" accent="red" subtitle="سري — لا تشاركه">
            <div className="flex items-center justify-end gap-2 mb-3">
              <button
                type="button"
                onClick={() => setShowPrivate((v) => !v)}
                className="btn-ghost p-2"
              >
                {showPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <CopyButton value={keys.privateKeyB64} />
            </div>
            <p className="code-block min-h-[3rem] select-all">
              {showPrivate ? keys.privateKeyB64 : '•'.repeat(56)}
            </p>
          </SectionCard>

          <SectionCard icon={Key} title="المفتاح العام" accent="emerald" subtitle="يُضاف للتطبيق">
            <ResultField label="Public Key" value={keys.publicKeyB64} mono badge="Ed25519" />
          </SectionCard>

          <SectionCard icon={Terminal} title="أمر Flutter" accent="zinc">
            <div className="flex items-start gap-2">
              <pre className="code-block flex-1 text-amber-200/90 whitespace-pre">{flutterCommand}</pre>
              <CopyButton value={flutterCommand} />
            </div>
          </SectionCard>

          <button
            type="button"
            onClick={() => {
              downloadText('keys.env', envFile);
              onToast('تم التنزيل', 'success');
            }}
            className="btn-secondary w-full justify-center"
          >
            <Download className="w-4 h-4" />
            تنزيل keys.env
          </button>
        </div>
      )}
    </PageShell>
  );
}
