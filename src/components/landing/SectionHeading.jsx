// One centered title/subtitle block shared by every landing content section
// (saving examples, calculator hub, FAQ) so they keep the same rhythm and
// type scale instead of each rolling its own.
export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-8 text-center lg:mb-10">
      <h2 className="font-heading text-xl font-bold text-emerald-950 sm:text-2xl lg:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-xl text-sm text-emerald-900/70 lg:text-base">
          {subtitle}
        </p>
      )}
    </div>
  )
}
