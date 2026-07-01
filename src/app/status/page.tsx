'use client';

import React, { useState } from 'react';
import { useI18n } from '@/app/i18n';
import { CheckCircle2, Clock, XCircle, Search } from 'lucide-react';

interface StatusResult {
  found: boolean;
  registrationId?: string;
  fullName?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  competition?: string;
}

export default function StatusPage() {
  const { t, dir } = useI18n();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/registration-status?q=${encodeURIComponent(q.trim())}`);
      setResult(await res.json());
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  const statusView = () => {
    if (!result) return null;
    if (!result.found) {
      return (
        <div className="mt-6 p-4 rounded-lg bg-gray-100 text-gray-600 text-center">{t('status_notfound')}</div>
      );
    }
    const map = {
      PENDING: { icon: Clock, cls: 'bg-amber-50 text-amber-800 border-amber-200', msg: t('status_pending') },
      APPROVED: { icon: CheckCircle2, cls: 'bg-green-50 text-green-800 border-green-200', msg: t('status_approved') },
      REJECTED: { icon: XCircle, cls: 'bg-red-50 text-red-800 border-red-200', msg: t('status_rejected') },
    } as const;
    const s = map[result.status || 'PENDING'];
    const Icon = s.icon;
    return (
      <div className={`mt-6 p-5 rounded-lg border ${s.cls}`}>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="font-bold text-lg">{result.fullName}</div>
            <div className="text-sm opacity-80">
              {result.registrationId}
              {result.competition ? ` · ${result.competition}` : ''}
            </div>
          </div>
        </div>
        <p className="mt-3 font-medium">{s.msg}</p>
      </div>
    );
  };

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <a href="/" className="text-indigo-600 text-sm hover:underline mb-4 inline-block">← {t('home')}</a>
        <h1 className="text-2xl font-bold text-gray-900">{t('status_title')}</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">{t('status_hint')}</p>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ARM-2026-0001"
            className="flex-1 rounded-md border border-gray-300 p-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 "
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-md font-medium hover:bg-indigo-700 disabled:bg-indigo-300 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            {loading ? t('status_checking') : t('status_check')}
          </button>
        </form>

        {statusView()}
      </div>
    </div>
  );
}
