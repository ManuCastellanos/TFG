import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { Surface } from "@/components/surface/Surface";
import { Text } from "@/components/text/Text";
import type { Participant } from "@/modules/course/domain/Participant";

export type ParticipantsViewProps = {
  participants: Participant[];
  loading?: boolean;
};

export const ParticipantsView = ({ participants, loading }: ParticipantsViewProps) => {
  const [query, setQuery] = useState("");

  const filtered = participants.filter((p) =>
    p.fullName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--fg-muted)" />
        <input
          type="search"
          placeholder="Buscar participante..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-(--border) bg-(--surface) py-2.5 pl-9 pr-4 text-sm text-(--fg) placeholder:text-(--fg-muted) focus:outline-none focus:ring-2 focus:ring-(--color-pr)"
        />
      </div>

      {loading && (
        <Text className="text-(--fg-muted)">Cargando participantes...</Text>
      )}

      {!loading && filtered.length === 0 && (
        <Text className="text-(--fg-muted)">
          {query ? "No se encontraron participantes." : "No hay participantes en este curso."}
        </Text>
      )}

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 px-4 py-1">
            <span className="size-9 shrink-0" />
            <span className="flex-1 text-sm font-bold text-(--fg-black) uppercase tracking-wide">
              Nombre completo
            </span>
            <span className="w-36 shrink-0 text-sm font-bold text-(--fg-black) uppercase tracking-wide text-right">
              Rol
            </span>
          </div>

          {filtered.map((participant) => (
            <Surface
              key={participant.id}
              className="flex w-full items-center gap-4 px-4 py-3"
            >
              <Avatar
                src={participant.avatarUrl}
                alt={participant.fullName}
                size="sm"
              />
              <span className="flex-1 truncate text-sm font-semibold text-(--fg)">
                {participant.fullName}
              </span>
              <span className="w-36 shrink-0 truncate text-sm text-(--fg-muted) text-right">
                {participant.roleDisplayName || participant.roleName || "—"}
              </span>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
};
