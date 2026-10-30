import React from 'react';

/** Shared route layout. It intentionally adds no DOM wrapper beyond the original site-root. */
export default function MainLayout({ children, pageKey }) {
  return <div className="site-root" key={pageKey}>{children}</div>;
}
