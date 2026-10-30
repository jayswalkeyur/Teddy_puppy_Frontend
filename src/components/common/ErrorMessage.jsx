export default function ErrorMessage({ message, onRetry }) {
  return <div className="tp-api-state tp-api-state--error" role="alert"><span>{message || 'Something went wrong.'}</span>{onRetry && <button type="button" className="tp-api-state__retry" onClick={onRetry}>Try again</button>}</div>;
}
