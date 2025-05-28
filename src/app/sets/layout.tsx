export default function SetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-2">
      {children}
    </div>
  );
}