import Image from "next/image";
import { homeComparison } from "../../data/homeComparison";

function CheckIcon() {
  return (
    <span className="comparison-icon comparison-icon-yes" aria-label="Yes">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 12.5l4 4L18 8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="comparison-icon comparison-icon-no" aria-label="No">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function StatusIcon({ value }: { value: boolean }) {
  return value ? <CheckIcon /> : <CrossIcon />;
}

export default function ComparisonSection() {
  return (
    <section className="comparison-section">
      <div className="comparison-inner">
        <h2 className="comparison-title">{homeComparison.title}</h2>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Features</th>
                <th scope="col">
                  <span className="comparison-brand">
                    <Image
                      src="/fluent-logo.png"
                      alt={homeComparison.brandName}
                      width={120}
                      height={36}
                      className="comparison-brand-logo"
                    />
                  </span>
                </th>
                <th scope="col">{homeComparison.competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {homeComparison.rows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>
                    <StatusIcon value={row.fluentAuf} />
                  </td>
                  <td>
                    <StatusIcon value={row.others} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
