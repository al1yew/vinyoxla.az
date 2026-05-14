export function SectionHeader({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
      {text ? <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{text}</p> : null}
    </div>
  );
}
