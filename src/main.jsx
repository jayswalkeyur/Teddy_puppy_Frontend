import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { pageMap } from './app/routes.js';
import { store } from './app/store.js';
import { useAppDispatch, useAppSelector } from './app/hooks.js';
import { fetchPuppies, fetchPuppyBySlug } from './features/puppies/puppiesSlice.js';
import PuppiesPage from './features/puppies/pages/PuppiesPage.jsx';
import PuppyNotFound from './features/puppies/components/PuppyNotFound.jsx';
import ErrorMessage from './components/common/ErrorMessage.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import FormSubmissionBridge from './components/common/FormSubmissionBridge.jsx';
import PageInteractionBridge from './components/common/PageInteractionBridge.jsx';
import './style.css';

function normalizePath(pathname) {
  let path = pathname || '/';
  try { path = decodeURIComponent(path); } catch { /* Keep the raw path when malformed. */ }
  path = path.replace(/\/+/g, '/');
  if (path === '/' || path.toLowerCase() === '/index.html') return '/';
  path = path.replace(/\/+$/, '').replace(/\.html$/i, '');
  return path.toLowerCase() || '/';
}

function getSlug(path) {
  return path.startsWith('/puppies/') ? path.slice('/puppies/'.length) : null;
}

function App() {
  const dispatch = useAppDispatch();
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const puppiesState = useAppSelector((state) => state.puppies);
  const Page = pageMap[path] || pageMap[path + '/'];
  const slug = getSlug(path);

  useEffect(() => {
    const update = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  useEffect(() => {
    if (path === '/' || path === '/puppies') dispatch(fetchPuppies({ page: 1, limit: 50, sort: 'createdAt', order: 'desc' }));
    if (slug) dispatch(fetchPuppyBySlug(slug));
  }, [dispatch, path, slug]);

  useEffect(() => {
    document.title = path === '/' ? 'TeddyPups' : `${path.split('/').pop().replace(/-/g, ' ')} | TeddyPups`;
  }, [path]);

  const puppy = slug ? puppiesState.details[slug] : null;
  const pagePuppies = puppiesState.list;

  if (slug && puppiesState.detailsHttpStatus[slug] === 404) {
    return <><PageInteractionBridge path={path} /><PuppyNotFound /></>;
  }

  if (!Page) {
    return (
      <>
        <PageInteractionBridge path={path} />
        <main className="tp-not-found">
          <h1>Page not found</h1>
          <p>This page is not included in the supplied website capture.</p>
          <a href="/">Return to home</a>
        </main>
      </>
    );
  }

  return (
    <>
      <PageInteractionBridge path={path} />
      <FormSubmissionBridge />
      <MainLayout pageKey={path}>
        {path === '/puppies' ? (
          <PuppiesPage
            Page={Page}
            puppies={pagePuppies}
            status={puppiesState.listStatus}
            error={puppiesState.listError}
            onRetry={() => dispatch(fetchPuppies({ page: 1, limit: 50, sort: 'createdAt', order: 'desc' }))}
          />
        ) : (
          <Page puppy={puppy} puppies={pagePuppies} />
        )}
        {slug && puppiesState.detailsStatus[slug] === 'failed' && (
          <ErrorMessage
            message="Live puppy details could not be refreshed. The saved profile information remains visible."
            onRetry={() => dispatch(fetchPuppyBySlug(slug))}
          />
        )}
      </MainLayout>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}><App /></Provider>
  </React.StrictMode>
);
