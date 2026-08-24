import Link from "next/link";

type SidebarProps = {
  active?: "brain" | "topics" | "saves" | "resources";
};

export default function Sidebar({
  active = "brain",
}: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/10 px-5 py-6 lg:flex lg:flex-col">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-2"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
          🧠
        </div>

        <span className="text-lg font-semibold tracking-tight">
          Second Brain
        </span>
      </Link>

      {/* Navigation */}
      <nav className="mt-10 space-y-2">
        <SidebarLink
          href="/dashboard"
          icon="🏠"
          label="Brain"
          active={active === "brain"}
        />

        <SidebarLink
          href="/topics"
          icon="📚"
          label="Topics"
          active={active === "topics"}
        />

        <SidebarLink
          href="/dashboard"
          icon="🔖"
          label="Saves"
          active={active === "saves"}
        />

        <SidebarLink
          href="/resources"
          icon="📖"
          label="Resources"
          active={active === "resources"}
        />
      </nav>

      {/* Brain status */}
      <div className="mt-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium">
            Your Brain
          </p>

          <p className="mt-1 text-xs leading-5 text-white/40">
            Your saved content becomes organized knowledge.
          </p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-white/60" />
          </div>

          <p className="mt-2 text-xs text-white/30">
            68% organized
          </p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{icon}</span>

      <span>{label}</span>
    </Link>
  );
}