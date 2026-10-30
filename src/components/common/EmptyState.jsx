export default function EmptyState({ title = 'No puppies found', message = 'Please check back soon.' }) {
  return <div className="tp-api-state" role="status"><strong>{title}</strong><span>{message}</span></div>;
}
