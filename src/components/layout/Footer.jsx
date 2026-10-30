import React from 'react';

/** Shared footer adapter retaining the exact captured footer markup and classes. */
export default function Footer({ children, ...props }) {
  return <footer {...props}>{children}</footer>;
}
