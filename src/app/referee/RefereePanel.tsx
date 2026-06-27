'use client';

import { useMemo, useState, useTransition } from 'react';
import { generateRound, startMatch, declareWinner, swapCompetitor } from './actions';
import { Trophy, Shuffle, Play } from 'lucide-react';
import { optimizeImage } from '@/lib/img';

interface Competitor {
  _id: string;
  fullName: string;
  profilePictureUrl?: string;
  weight?: number;
  city?: string;
}
interface Category {
  _id: string;
  name: string;
  arm: string;
  minWeightKg: number;
  maxWeightKg: number;
  participantIds: string[];
}

export default function RefereePanel({
  categories,
  competitors,
  matches,
}: {
  categories: Category[];
  competitors: Record<string, Competitor>;
  matches: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string>(categories[0]?._id || '');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const selected = categories.find((c) => c._id === selectedId);
  const catMatches = useMemo(
    () => matches.filter((m) => m.categoryId === selectedId),
    [matches, selectedId]
  );

  const rounds = useMemo(() => {
    const map = new Map<number, any[]>();
    for (const m of catMatches) {
      if (!map.has(m.round)) map.set(m.round, []);
      map.get(m.round)!.push(m);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [catMatches]);

  const maxRound = rounds.length ? rounds[rounds.length - 1][0] : 0;
  const currentRoundMatches = maxRound ? catMatches.filter((m) => m.round === maxRound) : [];
  const currentRoundDecided =
    currentRoundMatches.length > 0 &&
    currentRoundMatches.every((m) => m.status === 'COMPLETED' || m.status === 'BYE');
  const currentWinners = currentRoundMatches.map((m) => m.winnerId).filter(Boolean);
  const champion = maxRound && currentRoundDecided && currentWinners.length === 1 ? currentWinners[0] : null;

  const name = (id?: string) => (id && competitors[id] ? competitors[id].fullName : 'TBD');

  const run = (fn: () => Promise<any>, okMsg?: string) => {
    setError('');
    setInfo('');
    startTransition(async () => {
      try {
        const res = await fn();
        if (okMsg) setInfo(typeof res === 'object' && res?.round ? `Round ${res.round} created (${res.matchesCreated} match(es)).` : okMsg);
      } catch (e: any) {
        setError(e.message || 'Something went wrong.');
      }
    });
  };

  const pendingInRound = currentRoundMatches.filter(
    (m) => m.status !== 'COMPLETED' && m.status !== 'BYE'
  ).length;
  const isComplete = maxRound > 0 && currentRoundDecided && currentWinners.length === 1;
  const canGenerate =
    !!selected &&
    !isComplete &&
    (catMatches.length === 0 || (currentRoundDecided && currentWinners.length > 1));
  const generateLabel = catMatches.length === 0 ? 'Start Matches (Round 1)' : `Generate Round ${maxRound + 1}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Category sidebar */}
      <aside className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-3 h-fit">
        <h3 className="text-sm font-bold text-gray-700 px-2 mb-2 uppercase tracking-wide">Weight Categories</h3>
        <div className="space-y-1">
          {categories.map((c) => {
            const cm = matches.filter((m) => m.categoryId === c._id);
            const done = cm.length > 0 && cm.filter((m) => m.round === Math.max(...cm.map((x) => x.round))).every((m) => m.status === 'COMPLETED' || m.status === 'BYE');
            return (
              <button
                key={c._id}
                onClick={() => { setSelectedId(c._id); setError(''); setInfo(''); }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedId === c._id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{c.name}</div>
                <div className={`text-xs ${selectedId === c._id ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {c.participantIds.length} athlete(s){cm.length ? (done ? ' • round done' : ' • in progress') : ''}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main area */}
      <section className="lg:col-span-3 space-y-4">
        {selected && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500">
                  {selected.minWeightKg}–{selected.maxWeightKg === 999 ? '∞' : selected.maxWeightKg}kg ·{' '}
                  {selected.participantIds.length} approved athlete(s)
                </p>
              </div>
              {isComplete ? (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md font-semibold">
                  <Trophy size={18} /> Category Complete
                </span>
              ) : (
                <button
                  onClick={() => run(() => generateRound(selected._id), 'Round generated.')}
                  disabled={isPending || !canGenerate}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Shuffle size={18} /> {generateLabel}
                </button>
              )}
            </div>

            {error && <div className="mt-3 bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
            {info && <div className="mt-3 bg-green-50 text-green-700 p-3 rounded text-sm font-medium">{info}</div>}

            {catMatches.length === 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Click <span className="font-medium">Start Matches</span> to shuffle these athletes and pair them randomly.
              </p>
            )}

            {!isComplete && catMatches.length > 0 && pendingInRound > 0 && (
              <p className="mt-3 text-sm text-amber-600">
                Declare the winner of all <span className="font-semibold">{pendingInRound}</span> remaining match(es) in Round{' '}
                {maxRound} to unlock <span className="font-semibold">{generateLabel}</span>.
              </p>
            )}
          </div>
        )}

        {/* Champion banner */}
        {champion && (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-lg p-6 text-center text-white">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <p className="uppercase tracking-widest text-sm font-semibold">Category Champion</p>
            <div className="flex flex-col items-center mt-3">
              {competitors[champion]?.profilePictureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizeImage(competitors[champion].profilePictureUrl, 192)} alt={name(champion)} loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
              )}
              <div className="text-2xl font-black mt-3">{name(champion)} 🏆</div>
            </div>
          </div>
        )}

        {/* Rounds */}
        {rounds.map(([round, roundMatches]) => (
          <div key={round} className={round === maxRound ? '' : 'opacity-70'}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
              Round {round}{round === maxRound && !currentRoundDecided ? ' · live' : ''}
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {roundMatches.map((m) => (
                <MatchView
                  key={m._id}
                  match={m}
                  competitors={competitors}
                  category={selected!}
                  isPending={isPending}
                  onStart={() => run(() => startMatch(m._id), 'Match started.')}
                  onDeclare={(winnerId, score) => run(() => declareWinner(m._id, winnerId, score), 'Winner recorded!')}
                  onSwap={(slot, regId) => run(() => swapCompetitor(m._id, slot, regId), 'Player swapped.')}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function PlayerFace({ c, dim, win }: { c?: Competitor; dim?: boolean; win?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center transition ${dim ? 'opacity-40' : ''}`}>
      <div className="relative">
        {c?.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizeImage(c.profilePictureUrl, 192)}
            alt={c.fullName}
            loading="lazy"
            decoding="async"
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 ${win ? 'border-green-500' : 'border-gray-200'}`}
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No photo
          </div>
        )}
        {win && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow">
            <Trophy size={16} />
          </span>
        )}
      </div>
      <div className="mt-2 font-bold text-gray-900 text-sm md:text-base max-w-[10rem] truncate">{c?.fullName || 'TBD'}</div>
      {c?.weight ? <div className="text-xs text-gray-400">{c.weight}kg{c.city ? ` · ${c.city}` : ''}</div> : null}
      {win && <div className="text-green-600 font-black text-xs uppercase tracking-wider mt-1">Winner</div>}
    </div>
  );
}

function MatchView({
  match,
  competitors,
  category,
  isPending,
  onStart,
  onDeclare,
  onSwap,
}: {
  match: any;
  competitors: Record<string, Competitor>;
  category: Category;
  isPending: boolean;
  onStart: () => void;
  onDeclare: (winnerId: string, score?: string) => void;
  onSwap: (slot: 'competitor1Id' | 'competitor2Id', regId: string) => void;
}) {
  const [score, setScore] = useState(match.score || '');
  const [swapSlot, setSwapSlot] = useState<'competitor1Id' | 'competitor2Id' | null>(null);

  const c1 = match.competitor1Id ? competitors[match.competitor1Id] : undefined;
  const c2 = match.competitor2Id ? competitors[match.competitor2Id] : undefined;
  const done = match.status === 'COMPLETED' || match.status === 'BYE';
  const winnerId = match.winnerId;

  const swapOptions = category.participantIds.filter(
    (id) => id !== match.competitor1Id && id !== match.competitor2Id && competitors[id]
  );

  if (match.status === 'BYE') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase">Match {match.matchNumber} · BYE</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Auto-advance</span>
        </div>
        <div className="flex justify-center mt-3">
          <PlayerFace c={c1} win />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${done ? 'border-green-200' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase">Match {match.matchNumber}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            match.status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-700'
              : done
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {match.status === 'IN_PROGRESS' ? 'LIVE' : done ? 'FINISHED' : 'READY'}
        </span>
      </div>

      {/* VS row with photos */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <PlayerFace c={c1} dim={done && winnerId !== match.competitor1Id} win={done && winnerId === match.competitor1Id} />
        <div className="text-gray-300 font-black text-lg">VS</div>
        <PlayerFace c={c2} dim={done && winnerId !== match.competitor2Id} win={done && winnerId === match.competitor2Id} />
      </div>

      {match.score && <div className="text-center text-sm text-gray-500 mt-2">Score: {match.score}</div>}

      {!done && (
        <div className="mt-4 border-t pt-4 space-y-3">
          {/* Swap absent player */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Player absent?</span>
            <button
              onClick={() => setSwapSlot(swapSlot === 'competitor1Id' ? null : 'competitor1Id')}
              className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Swap P1
            </button>
            <button
              onClick={() => setSwapSlot(swapSlot === 'competitor2Id' ? null : 'competitor2Id')}
              className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Swap P2
            </button>
          </div>
          {swapSlot && (
            <select
              defaultValue=""
              disabled={isPending}
              onChange={(e) => { if (e.target.value) { onSwap(swapSlot, e.target.value); setSwapSlot(null); } }}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">
                {swapOptions.length ? `Replace ${swapSlot === 'competitor1Id' ? 'Player 1' : 'Player 2'} with…` : 'No other athletes available'}
              </option>
              {swapOptions.map((id) => (
                <option key={id} value={id}>{competitors[id].fullName}</option>
              ))}
            </select>
          )}

          {/* Score (optional) */}
          <input
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Final score (optional, e.g. 3-0)"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />

          {/* Actions */}
          {match.status !== 'IN_PROGRESS' && (
            <button
              onClick={onStart}
              disabled={isPending || !c1 || !c2}
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded font-medium hover:bg-gray-900 disabled:bg-gray-300"
            >
              <Play size={16} /> Start Match
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => match.competitor1Id && onDeclare(match.competitor1Id, score || undefined)}
              disabled={isPending || !c1}
              className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-green-300 text-sm"
            >
              {c1?.fullName?.split(' ')[0] || 'P1'} Wins
            </button>
            <button
              onClick={() => match.competitor2Id && onDeclare(match.competitor2Id, score || undefined)}
              disabled={isPending || !c2}
              className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-green-300 text-sm"
            >
              {c2?.fullName?.split(' ')[0] || 'P2'} Wins
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
