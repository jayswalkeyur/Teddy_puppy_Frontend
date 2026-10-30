import React from 'react';

/**
 * Separate contact form component; keeps its distinct field contract and captured
 * letter-form styling rather than sharing the puppy-enquiry schema.
 */
export default function ContactForm({ children, ...formProps }) {
  return <form {...formProps} data-form-feature="contact">{children}</form>;
}
