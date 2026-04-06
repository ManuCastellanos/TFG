import {
  LayoutDashboard,
  User,
  Calendar as CalendarIcon,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./components/sidebar/Sidebar";
import { TopBar } from "./components/topbar/TopBar";
import { CoursesList } from "../courses/CoursesList";
import { ScheduleSection } from "./components/schedule/ScheduleSection";
import { CalendarWidget } from "./components/widgets/CalendarWidget";
import { QuickStatsRow } from "./components/widgets/QuickStatsRow";

import { useDashboard } from "./hooks/useDashboard";

import type { NavItemConfig } from "@/components/navItem/navItem.types";
import { Card } from "@/components/card/Card";

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "schedule", label: "Schedule", icon: CalendarIcon, path: "/schedule" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  { id: "logout", label: "Log out", icon: LogOut, path: "/logout" },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const {
    user,
    courses,
    scheduleItems,
    calendarViewModel,
    goPrevCalendar,
    goNextCalendar,
  } = useDashboard();

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar
        navItems={NAV_ITEMS}
        activePath={pathname}
        onNavigate={(path) => navigate({ to: path })}
      />

      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
        <Card className="bg-(--panel) h-full flex-1">
        <CoursesList
          courses={courses}
          onCourseClick={(id) =>
            navigate({ to: "/courses/$id", params: { id } })
          }
          onViewAll={() => navigate({ to: "/courses" })}
          />
        </Card>
      </main>

      <div className="flex w-85 shrink-0 flex-col gap-4 overflow-y-auto bg-(--panel) p-6">
        <TopBar
          user={{
            name: user?.firstName ?? "",
            handle: user?.username ?? "",
            avatarUrl: user?.avatarUrl ?? null,
          }}
        />
        <CalendarWidget
          viewModel={calendarViewModel}
          onPrev={goPrevCalendar}
          onNext={goNextCalendar}
        />
        <QuickStatsRow stats={[]} />
        
        <ScheduleSection
          items={scheduleItems}
          onItemClick={(id) =>
            navigate({ to: "/schedule/$id", params: { id } })
          }
          onViewAll={() => navigate({ to: "/schedule" })}
        />
        
      </div>
    </div>
  );
};

export default Dashboard;