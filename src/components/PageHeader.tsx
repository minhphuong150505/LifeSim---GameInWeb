type PageHeaderProps = { title: string; subtitle?: string; right?: React.ReactNode };

export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <header className="safe-top flex items-start justify-between gap-3 px-4 pb-3">
      <div>
        <h1 className="text-[28px] font-bold text-navy">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
