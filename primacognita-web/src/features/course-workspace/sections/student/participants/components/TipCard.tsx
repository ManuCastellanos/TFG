export function TipCard() {
  return (
    <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5">
      <div className="text-2xl mb-2">🤝</div>
      <h4 className="font-extrabold text-(--fg) mb-1 text-sm">Sé buen compañero</h4>
      <p className="text-xs text-(--fg-muted) leading-relaxed">
        Ayudar a los demás te hace ganar la insignia "Compañerismo".
      </p>
    </div>
  );
}
