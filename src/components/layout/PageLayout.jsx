/**
 * PageLayout - Standard page structure with header, title, and content area.
 */
export function PageLayout({ title, children, headerAction }) {
  return (
    <div className="space-y-6">
      {(title || headerAction) && (
        <div className="flex items-center justify-between">
          {title && (
            <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
          )}
          <div className="ml-auto">{headerAction}</div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
