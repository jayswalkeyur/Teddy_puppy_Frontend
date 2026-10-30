import React from 'react';
import CapturedPage from '../../../components/CapturedPage';

/** Shared profile renderer for the eleven captured puppy routes. */
export default function PuppyProfile({ markup, route, puppy, puppies }) {
  return <CapturedPage markup={markup} route={route} puppy={puppy} puppies={puppies} />;
}
