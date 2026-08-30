export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-1">
      {label ? <span className="block pl-1 text-[11px] text-muted-foreground">{label}</span> : null}
      <input className="field-input" {...props} />
    </div>
  );
}

export function TextareaField({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="space-y-1">
      {label ? <span className="block pl-1 text-[11px] text-muted-foreground">{label}</span> : null}
      <textarea className="field-input min-h-24 resize-y" {...props} />
    </div>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="space-y-1">
      {label ? <span className="block pl-1 text-[11px] text-muted-foreground">{label}</span> : null}
      <select className="field-input appearance-none font-medium" {...props}>
        {children}
      </select>
    </div>
  );
}
