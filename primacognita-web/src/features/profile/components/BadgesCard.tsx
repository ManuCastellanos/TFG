import type { ProfileBadge } from '@/modules/profile/domain/Profile';

type BadgesCardProps = {
  badges: ProfileBadge[];
  total: number;
};

const BADGE_EMOJIS = ['🏆', '⭐', '🎖️', '🥇', '🌟', '🎯'];

export function BadgesCard({ badges, total }: BadgesCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-(--border) p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-extrabold text-(--fg)">Insignias recientes</h4>
        {total > 0 && (
          <span className="text-xs font-extrabold text-emerald-700">{total} total</span>
        )}
      </div>
      {badges.length === 0 ? (
        <p className="text-sm text-(--fg-muted)">Aún no has ganado insignias.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {badges.map((b, i) => (
            <div key={b.id} className="text-center p-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="text-3xl">{BADGE_EMOJIS[i % BADGE_EMOJIS.length]}</div>
              <div className="text-[10px] font-extrabold text-(--fg) mt-1 leading-tight line-clamp-2">{b.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
