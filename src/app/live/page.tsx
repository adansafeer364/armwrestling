'use client';

import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { optimizeImage } from '@/lib/img';
import { useI18n } from '@/app/i18n';

interface Player {
  id: string;
  name: string;
  photo?: string;
  weight?: number;
  city?: string;
}
interface LiveMatch {
  id: string;
  status: string;
  round: number;
  category: string;
  score: string;
  winnerId: string | null;
  player1: Player | null;
  player2: Player | null;
}

function Face({ player, state }: { player: Player | null; state: 'idle' | 'won' | 'lost' }) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-col items-center text-center transition-all duration-500 ${state === 'lost' ? 'opacity-40 grayscale' : ''}`}>
      <div className="relative">
        {player?.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizeImage(player.photo, 448)}
            alt={player.name}
            decoding="async"
            className={`w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full object-cover border-4 sm:border-8 ${
              state === 'won' ? 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.6)]' : 'border-white/20'
            }`}
          />
        ) : (
          <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs">No photo</div>
        )}
        {state === 'won' && (
          <span className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
            <Trophy className="h-7 w-7" />
          </span>
        )}
      </div>
      <div className="mt-3 sm:mt-4 text-lg sm:text-2xl md:text-4xl font-black text-white max-w-[7rem] sm:max-w-[12rem] truncate">{player?.name || 'TBD'}</div>
      {player?.weight ? <div className="text-white/50 mt-1 text-xs sm:text-base">{player.weight}kg{player.city ? ` · ${player.city}` : ''}</div> : null}
      {state === 'won' && <div className="mt-2 text-green-400 font-black text-lg sm:text-2xl uppercase tracking-widest">{t('won')}</div>}
      {state === 'lost' && <div className="mt-2 text-red-400 font-bold text-base sm:text-xl uppercase tracking-widest">{t('lost')}</div>}
    </div>
  );
}

export default function LivePage() {
  const { t, dir } = useI18n();
  const [match, setMatch] = useState<LiveMatch | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const poll = () => {
      fetch('/api/live')
        .then((r) => r.json())
        .then((d) => { if (active) { setMatch(d.match); setLoaded(true); } })
        .catch(() => { if (active) setLoaded(true); });
    };
    poll();
    const t = setInterval(poll, 3000);
    return () => { active = false; clearInterval(t); };
  }, []);

  const done = match?.status === 'COMPLETED';
  const p1State: 'idle' | 'won' | 'lost' = done ? (match!.winnerId === match!.player1?.id ? 'won' : 'lost') : 'idle';
  const p2State: 'idle' | 'won' | 'lost' = done ? (match!.winnerId === match!.player2?.id ? 'won' : 'lost') : 'idle';

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <header className="py-5 px-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-sm">{t('live')}</span>
        </div>
        <a href="/" className="text-white/50 hover:text-white text-sm">← {t('home')}</a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!loaded ? (
          <p className="text-white/40">Connecting…</p>
        ) : !match ? (
          <div className="text-center">
            <h1 className="text-3xl font-black">{t('no_live_match')}</h1>
            <p className="text-white/50 mt-2">Matches will appear here as the referee runs them.</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl text-center">
            <div className="text-brand-primary font-bold uppercase tracking-widest text-sm">
              {match.category} · {t('round')} {match.round}
            </div>
            <div className="mt-2 text-white/60 uppercase tracking-wider text-sm">
              {match.status === 'IN_PROGRESS' ? t('match_in_progress') : done ? t('result') : t('up_next')}
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-4 md:gap-8">
              <Face player={match.player1} state={p1State} />
              <div className="text-2xl sm:text-4xl md:text-6xl font-black text-white/30">VS</div>
              <Face player={match.player2} state={p2State} />
            </div>

            {match.score && <div className="mt-10 text-white/60 text-xl">Score: {match.score}</div>}
          </div>
        )}
      </main>
    </div>
  );
}
