type PageHeaderProps = { title: string; subtitle?: string; right?: React.ReactNode };

/** Wooden board header shared by every main screen. */
export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <header className="wood safe-top mb-4 border-b-[2.5px] border-navy px-4 pb-3 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[30px] leading-tight text-navy">{title}</h1>
          {subtitle && <p className="text-sm font-semibold text-navy/80">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
