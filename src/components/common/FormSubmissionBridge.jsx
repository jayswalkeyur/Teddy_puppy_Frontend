import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks.js';
import { submitPuppyEnquiry } from '../../features/enquiries/enquiriesSlice.js';
import { submitContactMessage } from '../../features/contact/contactSlice.js';

function normalizePath(pathname) {
  return (pathname || '/').replace(/\/+/g, '/').replace(/\.html$/i, '').replace(/\/+$/, '') || '/';
}

function setFormNotice(form, message, type = 'info') {
  let notice = form.querySelector('[data-form-status]');
  if (!notice) {
    notice = document.createElement('p');
    notice.setAttribute('data-form-status', 'true');
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notice.className = 'tp-form-status';
    form.appendChild(notice);
  }
  notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
  notice.dataset.status = type;
  notice.textContent = message;
}

export default function FormSubmissionBridge() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onSubmit = async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const puppyEnquiry = Boolean(form.querySelector('input[name="puppyId"][type="hidden"]'));
      const contactMessage = Boolean(form.querySelector('select[name="puppyId"]')) ||
        (normalizePath(window.location.pathname) === '/contact' && Boolean(form.querySelector('input[name="name"]')));
      if (!puppyEnquiry && !contactMessage) return;

      event.preventDefault();
      if (form.dataset.submitting === 'true') return;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      // These are optional in the backend schema but sent consistently by both forms.
      payload.email = String(payload.email || '').trim();
      payload.area = String(payload.area || '').trim();
      payload.message = String(payload.message || '').trim();
      payload.website = String(payload.website || '');

      const submitControl = form.querySelector('button[type="submit"], input[type="submit"]');
      const wasDisabled = submitControl?.disabled ?? false;
      form.dataset.submitting = 'true';
      if (submitControl) submitControl.disabled = true;
      form.setAttribute('aria-busy', 'true');
      setFormNotice(form, 'Sending your message…');

      try {
        if (puppyEnquiry) {
          await dispatch(submitPuppyEnquiry(payload)).unwrap();
          setFormNotice(form, 'Thank you! Your puppy enquiry has been received. Our team will be in touch soon.', 'success');
        } else {
          await dispatch(submitContactMessage(payload)).unwrap();
          setFormNotice(form, 'Thank you! Your message has been received. Our team will be in touch soon.', 'success');
        }
        form.reset();
      } catch (error) {
        setFormNotice(form, typeof error === 'string' ? error : 'We could not send your message. Please check your details and try again.', 'error');
      } finally {
        delete form.dataset.submitting;
        form.removeAttribute('aria-busy');
        if (submitControl) submitControl.disabled = wasDisabled;
      }
    };

    document.addEventListener('submit', onSubmit);
    return () => document.removeEventListener('submit', onSubmit);
  }, [dispatch]);

  return null;
}
