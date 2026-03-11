import { Bell, Mail } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { IconButton } from "@/components/button/IconButton";
import type { TopBarProps } from "./topbar.types";

export const TopBar = ({
  user,
  onMessageClick,
  onNotificationClick,
}: TopBarProps) => (
  <div className="flex items-center justify-end gap-2 py-2">
    <IconButton icon={Mail} label="Mensajes" onClick={onMessageClick} />
    <IconButton icon={Bell} label="Notificaciones" onClick={onNotificationClick} />

    <div className="ml-2 flex items-center gap-3">
      <div className="flex flex-col items-end leading-tight">
        <span className="text-sm font-semibold text-(--fg)">{user.name}</span>
        <span className="text-xs text-(--fg-muted)">@{user.handle}</span>
      </div>
      <Avatar src={user.avatarUrl} alt={user.name} size="md" />
    </div>
  </div>
);