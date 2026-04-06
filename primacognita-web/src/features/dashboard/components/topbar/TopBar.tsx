import { Bell, Mail } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { IconButton } from "@/components/button/IconButton";
import type { TopBarProps } from "./topbar.types";

export const TopBar = ({
  user,
  onMessageClick,
  onNotificationClick,
}: TopBarProps) => (
  <div className="flex items-center justify-between gap-2 py-2">
    <div className="flex items-center gap-2">
      <IconButton icon={Mail} label="Mensajes" onClick={onMessageClick} className="bg-white"/>
      <IconButton
        icon={Bell}
        label="Notificaciones"
        onClick={onNotificationClick}
        className="bg-white"
      />
    </div>

    <div className="ml-2 flex items-center gap-3.5">
      <div className=" justify-center flex flex-col items-end leading-tight">
        <span className="text-md font-bold text-(--fg)">{user.name}</span>
        <span className="text-sm  text-(--fg)">@{user.handle}</span>
      </div>
      <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
    </div>
  </div>
);
