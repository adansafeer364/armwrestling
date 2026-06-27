'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/app/i18n';
import { PAYMENT_ACCOUNTS } from '@/lib/payment';

interface Competition {
  _id: string;
  title: string;
  location: string;
  startDate: string;
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const { t, dir } = useI18n();
  const preselected = searchParams.get('tournament') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competitionId, setCompetitionId] = useState<string>(preselected);
  const [loadingComps, setLoadingComps] = useState(true);
  const [hand, setHand] = useState('');

  useEffect(() => {
    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => {
        const comps: Competition[] = d.competitions || [];
        setCompetitions(comps);
        // Keep preselected if valid, otherwise default to the first competition.
        if (preselected && comps.some((c) => c._id === preselected)) {
          setCompetitionId(preselected);
        } else if (comps.length === 1) {
          setCompetitionId(comps[0]._id);
        }
      })
      .catch(() => setCompetitions([]))
      .finally(() => setLoadingComps(false));
  }, [preselected]);

  const lockedComp = competitions.find((c) => c._id === preselected);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    if (!competitionId) {
      setError('Please select the competition you are registering for.');
      return;
    }
    formData.set('tournamentId', competitionId);

    if (!hand) {
      setError('Please select your competing hand (Right, Left or Both).');
      return;
    }
    formData.set('hand', hand);

    const paymentScreenshot = formData.get('paymentScreenshot') as File;
    if (!paymentScreenshot || paymentScreenshot.size === 0) {
      setError('Payment screenshot is strictly required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to register');

      setSuccess(
        `Registration submitted! Your ID is: ${data.registrationId}. ` +
          `Your application is now pending admin approval — you will receive a confirmation email once your payment is verified.`
      );
      (e.target as HTMLFormElement).reset();
      setHand('');
      if (!preselected) setCompetitionId('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">{t('reg_title')}</h2>
          {lockedComp ? (
            <p className="text-center text-indigo-600 font-medium mb-6">
              {t('reg_for')}: {lockedComp.title}
            </p>
          ) : (
            <p className="text-center text-gray-500 mb-6">{t('reg_select_hint')}</p>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Competition selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('competition')}</label>
              {preselected && lockedComp ? (
                <input
                  type="text"
                  value={lockedComp.title}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm p-2 border text-gray-700"
                />
              ) : loadingComps ? (
                <p className="mt-1 text-sm text-gray-400">{t('loading_comps')}</p>
              ) : competitions.length === 0 ? (
                <p className="mt-1 text-sm text-red-500">{t('no_comps')}</p>
              ) : (
                <select
                  required
                  value={competitionId}
                  onChange={(e) => setCompetitionId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="">{t('select_competition')}</option>
                  {competitions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.location})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('full_name')}</label>
                <input required type="text" name="fullName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('father_name')}</label>
                <input required type="text" name="fatherName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                <input required type="tel" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
                <input required type="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('age')}</label>
                <input required type="number" name="age" min="10" max="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('city')}</label>
                <input required type="text" name="city" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('club')}</label>
                <input type="text" name="clubName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('weight')}</label>
                <input required type="number" step="0.1" name="weight" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              {/* Your Pic — placed right before Competing Hand */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('your_pic')} <span className="text-red-500">*{t('required')}</span>
                </label>
                <input required type="file" name="profilePicture" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hand')} <span className="text-red-500">*{t('required')}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {([
                    { v: 'Right', label: t('right') },
                    { v: 'Left', label: t('left') },
                    { v: 'Both', label: t('both') },
                  ] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt.v}
                      onClick={() => setHand(opt.v)}
                      aria-pressed={hand === opt.v}
                      className={`px-6 py-2.5 rounded-lg border-2 font-semibold transition-colors ${
                        hand === opt.v
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-600 hover:border-indigo-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('profile_payment')}</h3>

              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800 mb-3">{t('send_fee_to')}</p>
                <div className="flex flex-wrap gap-3">
                  {PAYMENT_ACCOUNTS.map((acc) => (
                    <div key={acc.method} className="bg-white border border-green-200 rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-green-700">{acc.method}</span>
                        <span className="font-mono font-semibold text-gray-900" dir="ltr">{acc.number}</span>
                      </div>
                      {acc.name && <div className="text-xs text-gray-500 mt-0.5">{acc.name}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('payment_screenshot')} <span className="text-red-500">*{t('required')}</span>
                  </label>
                  <input required type="file" name="paymentScreenshot" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('account_number')} <span className="text-red-500">*{t('required')}</span>
                  </label>
                  <input required type="text" name="paymentAccountNumber" placeholder="e.g. 0300-1234567 / IBAN" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('account_name')} <span className="text-red-500">*{t('required')}</span>
                  </label>
                  <input required type="text" name="paymentAccountName" placeholder="Name on the paying account" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? t('submitting') : t('submit_reg')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
