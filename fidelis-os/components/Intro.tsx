type Props = {
  /** Set in ink, ahead of the lead. */
  title: React.ReactNode;
  /** Set in gray after the title. */
  lead?: React.ReactNode;
  /** Right-hand column, 6 units. */
  side?: React.ReactNode;
  /** More content under the headline, in the left 16 units. */
  children?: React.ReactNode;
};

/** Page intro on the unit grid: headline left, side column right. */
export function Intro({ title, lead, side, children }: Props) {
  return (
    <section className="g24 intro">
      <div className="i-text">
        <h1>
          <span className="nm">{title}</span>
          {lead ? <> {lead}</> : null}
        </h1>
        {children}
      </div>
      {side ? <aside className="i-side">{side}</aside> : null}
    </section>
  );
}
