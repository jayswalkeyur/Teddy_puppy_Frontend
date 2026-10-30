import React from 'react';

/**
 * Reusable adapter for the original TeddyPups puppy links/cards.
 * It preserves the captured anchor markup and lets the page data bridge attach
 * live status metadata without replacing the original DOM.
 */
export default function PuppyCard({ children, ...anchorProps }) {
  const match = String(anchorProps.href || '').match(/^\/puppies\/([^/?#]+)/i);
  return (
    <a
      {...anchorProps}
      data-puppy-card="true"
      data-puppy-slug={match?.[1] || undefined}
    >
      {children}
    </a>
  );
}
