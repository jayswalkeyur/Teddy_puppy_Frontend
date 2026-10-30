import React from 'react';

/** Shared header adapter retaining the exact captured header markup and classes. */
export default function Header({ children, ...props }) {
  return <header {...props}>{children}</header>;
}
