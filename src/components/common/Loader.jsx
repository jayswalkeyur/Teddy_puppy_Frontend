export default function Loader({ label = 'Loading…' }) {
  return <div className="tp-api-state" role="status" aria-live="polite"><span className="tp-api-state__spinner" aria-hidden="true" />{label}</div>;
}
