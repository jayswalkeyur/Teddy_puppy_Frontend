import React from 'react';

/** Shared gallery list adapter; the existing gallery controls remain delegated by the page shell. */
export default function PuppyGallery({ children, ...props }) {
  return <ul {...props} data-puppy-gallery="true">{children}</ul>;
}
