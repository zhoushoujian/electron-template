import Loadable from 'react-loadable';
import React from 'react';
import Loading from './components/loading';

export default function MyLoadable(opts) {
  // eslint-disable-next-line new-cap
  return Loadable(
    Object.assign(
      {
        loading: LoadingFunc,
        delay: 200,
        timeout: 10000,
      },
      opts,
    ),
  );
}

function LoadingFunc({ error, retry, timedOut, pastDelay }) {
  if (error) {
    return (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (pastDelay) {
    return <Loading text='Loading' />;
  } else {
    return null;
  }
}
