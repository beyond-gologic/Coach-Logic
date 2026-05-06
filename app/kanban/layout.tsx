import GlobalNav from "@/components/layout/GlobalNav";

export default function KanbanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <GlobalNav />
      <main className="flex-1 overflow-hidden bg-[#F9FAFB]">{children}</main>
    </div>
  );
}
