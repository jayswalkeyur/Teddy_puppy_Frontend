import React from 'react';

/** Shared native-dialog adapter; native showModal/close behavior remains unchanged. */
export default function Modal({ children, ...props }) {
  return <dialog {...props}>{children}</dialog>;
}
