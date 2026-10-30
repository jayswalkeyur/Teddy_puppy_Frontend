import React from 'react';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import EmptyState from '../../../components/common/EmptyState';

/**
 * The captured page stays mounted in the same React position while request
 * state changes, preserving scroll observers, animations and gallery state.
 */
export default function PuppiesPage({ Page, puppies, status, error, onRetry }) {
  return (
    <>
      <Page puppies={puppies} />
      {status === 'loading' && <Loader label="Refreshing available puppies…" />}
      {status === 'failed' && <ErrorMessage message={`${error} The original captured listings remain visible while you retry.`} onRetry={onRetry} />}
      {status === 'succeeded' && puppies.length === 0 && (
        <EmptyState
          title="No live puppy records were returned"
          message="The saved page content is still shown above; please contact our team for current availability."
        />
      )}
    </>
  );
}
