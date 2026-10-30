import React from 'react';

/** Shared list/grid adapter; the original tag, classes and responsive styles are preserved. */
export default function PuppyGrid({ children, as: Element = 'ul', ...props }) {
  return <Element {...props} data-puppy-grid="true">{children}</Element>;
}
