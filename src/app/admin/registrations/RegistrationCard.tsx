'use client';

import { useState, useTransition } from 'react';
import { approveRegistration, rejectRegistration } from './actions';
import { optimizeImage } from '@/lib/img';

export default function RegistrationCard({ reg }: { reg: any }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>(reg.status);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleApprove = () => {
    startTransition(async () => {
      try {
        const res = await approveRegistration(reg._id);
        setStatus('APPROVED');
        setMessage(res.emailed ? 'Approved — confirmation email sent.' : 'Approved — email logged (SMTP not configured).');
      } catch (e: any) {
        setMessage(e.message || 'Failed to approve.');
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      try {
        const res = await rejectRegistration(reg._id);
        setStatus('REJECTED');
        setMessage(res.emailed ? 'Rejected — email sent.' : 'Rejected — email logged (SMTP not configured).');
      } catch (e: any) {
        setMessage(e.message || 'Failed to reject.');
      }
    });
  };

  const badge =
    status === 'APPROVED'
      ? 'bg-green-100 text-green-800'
      : status === 'REJECTED'
      ? 'bg-red-100 text-red-800'
      : 'bg-amber-100 text-amber-800';

  const docs = [
    { label: 'Payment Receipt', url: reg.paymentScreenshotUrl, highlight: true },
    { label: 'Profile Picture', url: reg.profilePictureUrl },
  ].filter((d) => d.url);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {reg.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizeImage(reg.profilePictureUrl, 96)} alt={reg.fullName} loading="lazy" decoding="async" className="w-12 h-12 rounded-full object-cover border" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200" />
          )}
          <div>
            <h3 className="font-bold text-gray-900">{reg.fullName}</h3>
            <p className="text-xs text-gray-500">{reg.registrationId}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge}`}>{status}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mt-4">
        <p><span className="font-medium text-gray-800">Email:</span> {reg.email}</p>
        <p><span className="font-medium text-gray-800">Phone:</span> {reg.phone}</p>
        <p><span className="font-medium text-gray-800">Weight:</span> {reg.weight} kg</p>
        <p><span className="font-medium text-gray-800">Hand:</span> {reg.hand}</p>
        <p><span className="font-medium text-gray-800">Age:</span> {reg.age}</p>
        <p><span className="font-medium text-gray-800">City:</span> {reg.city}</p>
        {reg.clubName ? <p className="col-span-2"><span className="font-medium text-gray-800">Club:</span> {reg.clubName}</p> : null}
      </div>

      <div className="mt-3 rounded-md bg-indigo-50 border border-indigo-100 p-3 text-sm">
        <p className="font-semibold text-indigo-800 mb-1">Payment account details</p>
        <p className="text-gray-700"><span className="font-medium">Account #:</span> {reg.paymentAccountNumber || '—'}</p>
        <p className="text-gray-700"><span className="font-medium">Account name:</span> {reg.paymentAccountName || '—'}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {docs.map((d) => (
          <button
            key={d.label}
            onClick={() => setPreview(d.url)}
            className={`text-xs px-2 py-1 rounded border ${
              d.highlight ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-gray-200 text-gray-600'
            } hover:bg-gray-100`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-gray-700 mt-3 font-medium">{message}</p>}

      {status === 'PENDING' && (
        <div className="flex gap-3 mt-4 border-t pt-4">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-medium hover:bg-green-700 disabled:bg-green-300"
          >
            {isPending ? 'Working…' : 'Approve & Notify'}
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded font-medium hover:bg-red-700 disabled:bg-red-300"
          >
            Reject
          </button>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimizeImage(preview, 1200)} alt="document" decoding="async" className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl" />
        </div>
      )}
    </div>
  );
}
