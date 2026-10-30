import React from 'react';

/**
 * Renders the captured puppy-enquiry form unchanged. Submission is handled by
 * the app-level bridge so the original fields, browser validation and CSS stay intact.
 */
export default function PuppyEnquiryForm({ children, ...formProps }) {
  return <form {...formProps} data-form-feature="puppy-enquiry">{children}</form>;
}
