
import React, { useEffect, useMemo, useRef } from 'react';
import PuppyCard from '../features/puppies/components/PuppyCard';
import PuppyGrid from '../features/puppies/components/PuppyGrid';
import PuppyGallery from '../features/puppies/components/PuppyGallery';
import PuppyEnquiryForm from '../features/enquiries/components/PuppyEnquiryForm';
import ContactForm from '../features/contact/components/ContactForm';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Modal from './common/Modal';

/* =========================================
   HTML + SVG ATTRIBUTE MAPPING
========================================= */

const ATTRIBUTE_MAP = {
  // HTML
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  enctype: 'encType',
  srcset: 'srcSet',
  datetime: 'dateTime',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',
  autofocus: 'autoFocus',
  playsinline: 'playsInline',
  novalidate: 'noValidate',
  fetchpriority: 'fetchPriority',
  autocomplete: 'autoComplete',
  autocapitalize: 'autoCapitalize',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  contenteditable: 'contentEditable',
  formnovalidate: 'formNoValidate',
  usemap: 'useMap',
  accesskey: 'accessKey',
  tabindex: 'tabIndex',
  srcdoc: 'srcDoc',
  formlist: 'formList',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formtarget: 'formTarget',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',

  // SVG dimensions and positioning
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
  gradientunits: 'gradientUnits',
  gradienttransform: 'gradientTransform',
  patternunits: 'patternUnits',
  patterntransform: 'patternTransform',
  patterncontentunits: 'patternContentUnits',
  markerwidth: 'markerWidth',
  markerheight: 'markerHeight',
  markerunits: 'markerUnits',
  markerstart: 'markerStart',
  markerend: 'markerEnd',
  markermid: 'markerMid',
  textlength: 'textLength',
  lengthadjust: 'lengthAdjust',
  spreadmethod: 'spreadMethod',

  // SVG clipping and masking
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  'clip-rule': 'clipRule',
  maskunits: 'maskUnits',
  maskcontentunits: 'maskContentUnits',

  // SVG fill
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',

  // SVG stroke
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'stroke-miterlimit': 'strokeMiterlimit',

  // SVG filters
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',

  // SVG other attributes
  'vector-effect': 'vectorEffect',
  'paint-order': 'paintOrder',
  'shape-rendering': 'shapeRendering',
  'text-rendering': 'textRendering',
  'image-rendering': 'imageRendering',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  'baseline-shift': 'baselineShift',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-style': 'fontStyle',
  'letter-spacing': 'letterSpacing',
  'word-spacing': 'wordSpacing',
  'writing-mode': 'writingMode',
  'text-anchor': 'textAnchor',

  // SVG namespace attributes
  'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace',
  'xml:lang': 'xmlLang',
  'xml:base': 'xmlBase',
  'xmlns:xlink': 'xmlnsXlink',

  // Other SVG camelCase attributes
  basefrequency: 'baseFrequency',
  numoctaves: 'numOctaves',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  diffuseconstant: 'diffuseConstant',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  filterunits: 'filterUnits',
  primitiveunits: 'primitiveUnits',
  targetx: 'targetX',
  targety: 'targetY',
  edgemode: 'edgeMode',
  stddeviation: 'stdDeviation',
  tablevalues: 'tableValues',
  values: 'values',
};

/* =========================================
   BOOLEAN ATTRIBUTES
========================================= */

const BOOLEAN_ATTRIBUTES = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'disablepictureinpicture',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
]);



/* =========================================
   BOOLEAN ATTRIBUTE CONVERSION
========================================= */

function normalizeBoolean(value, name) {
  if (value === '') return true;

  const normalized = String(value).toLowerCase();

  return (
    normalized === 'true' ||
    normalized === name.toLowerCase()
  );
}

/* =========================================
   CSS STRING TO REACT STYLE OBJECT
========================================= */

function cssTextToObject(value = '') {
  const result = {};

  if (!value) return result;

  const declarations = [];
  let current = '';
  let depth = 0;
  let quote = '';

  for (const character of value) {
    if (quote) {
      current += character;

      if (character === quote) quote = '';

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    }

    if (character === '(') depth++;
    if (character === ')') depth = Math.max(0, depth - 1);

    if (character === ';' && depth === 0) {
      declarations.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  if (current.trim()) {
    declarations.push(current);
  }

  declarations.forEach((declaration) => {
    const colon = declaration.indexOf(':');

    if (colon < 0) return;

    const rawName = declaration.slice(0, colon).trim();
    const rawValue = declaration.slice(colon + 1).trim();

    if (!rawName || !rawValue) return;

    const name = rawName.startsWith('--')
      ? rawName
      : rawName.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );

    // React does not accept !important in inline style values.
    const cleanValue = rawValue.replace(/\s*!important\s*$/i, '');

    result[name] = cleanValue;
  });

  return result;
}

/* =========================================
   ASSET PATH NORMALIZATION
========================================= */

function normalizeAsset(value) {
  if (!value) return value;

  if (/^(?:[a-z]+:|\/\/|#|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) return value;

  const clean = value.replace(/^(?:\.\.\/)+/, '');

  if (/^(?:assets|images|fonts|css)\//i.test(clean)) {
    return `/${clean}`;
  }

  return value;
}

/* =========================================
   LINK NORMALIZATION
========================================= */

function normalizeLink(value, route) {
  if (
    !value ||
    /^(?:[a-z]+:|\/\/|#|javascript:)/i.test(value)
  ) {
    return value;
  }

  const isParentRelative = value.startsWith('../');

  const base = route.startsWith('/puppies/')
    ? '/puppies/'
    : '/';

  const raw = value.replace(/^(?:\.\.\/)+/, '');

  const path = isParentRelative
    ? `/${raw}`
    : raw.startsWith('/')
      ? raw
      : `${base}${raw}`;

  if (
    path.endsWith('/index.html') ||
    path === '/index.html'
  ) {
    return '/';
  }

  const aliases = {
    'puppies.html': '/puppies',
    'happy-families.html': '/happy-families',
    'how-it-works.html': '/how-it-works',
    'faq.html': '/faq',
    'contact.html': '/contact',
    'gone-home.html': '/gone-home',
  };

  const clean = path.replace(/^\/+/, '');

  if (aliases[clean]) return aliases[clean];

  return `/${clean.replace(/\.html$/, '')}`.replace(/\/+/g, '/');
}

/* =========================================
   SRCSET NORMALIZATION
========================================= */

function normalizeSrcSet(value) {
  if (!value) return value;

  // Keep data URLs intact.
  if (value.includes('data:')) return value;

  return value
    .split(',')
    .map((part) => {
      const bits = part.trim().split(/\s+/);

      bits[0] = normalizeAsset(bits[0]);

      return bits.join(' ');
    })
    .join(', ');
}


/* =========================================
   RESTORE NEXT.JS STREAMED SUSPENSE CONTENT
========================================= */

function restoreStreamedContent(documentNode) {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;

    const template = documentNode.querySelector(
      'template[id^="B:"]'
    );

    if (!template) break;

    const match = template.id.match(/^B:(.+)$/);

    if (!match) {
      template.remove();
      continue;
    }

    const streamedContent = documentNode.getElementById(
      `S:${match[1]}`
    );

    // If the streamed content is unavailable,
    // leave the fallback intact.
    if (!streamedContent) {
      console.warn(
        `Missing streamed content for boundary ${template.id}`
      );
      break;
    }

    const parent = template.parentNode;

    if (!parent) break;

    // Insert the actual puppy profile content
    // exactly where the loading placeholder exists.
    while (streamedContent.firstChild) {
      parent.insertBefore(
        streamedContent.firstChild,
        template
      );
    }

    // Remove the original placeholder.
    const fallback = template.nextElementSibling;

    if (fallback?.getAttribute('aria-busy') === 'true') {
      fallback.remove();
    }

    template.remove();

    // Remove the hidden streamed-content container.
    streamedContent.remove();
  }

  return documentNode;
}


/* =========================================
   HTML NODE TO REACT NODE
========================================= */

function toReactNode(node, key, route, context = {}) {
  // Text node
  if (node.nodeType === 3) {
    return node.nodeValue;
  }

  // Ignore comments and unsupported nodes
  if (node.nodeType !== 1) {
    return null;
  }

  const tag = node.tagName.toLowerCase();

  // Do not render scripts
  if (tag === 'script') {
    return null;
  }

  const props = { key };

  for (const attr of Array.from(node.attributes)) {
    const lower = attr.name.toLowerCase();

    let name = ATTRIBUTE_MAP[lower] || attr.name;
    let value = attr.value;

    // Inline CSS
    if (lower === 'style') {
      value = cssTextToObject(value);
    }

    // Images and media
    if (lower === 'src' || lower === 'poster') {
      value = normalizeAsset(value);
    }

    // Responsive images
    if (lower === 'srcset') {
      value = normalizeSrcSet(value);
    }

    // Links
    if (lower === 'href') {
      value = normalizeLink(value, route);
    }

    // Boolean HTML attributes
    if (BOOLEAN_ATTRIBUTES.has(lower)) {
      value = normalizeBoolean(value, lower);
    }

    // Never copy inline JavaScript event attributes.
    if (lower.startsWith('on')) {
      continue;
    }

    props[name] = value;
  }

  // Form controls
  if (
    ['input', 'select', 'textarea'].includes(tag) &&
    props.value !== undefined
  ) {
    props.defaultValue = props.value;
    delete props.value;
  }

  if (tag === 'input' && props.checked !== undefined) {
    props.defaultChecked = props.checked;
    delete props.checked;
  }

  if (tag === 'option' && props.selected !== undefined) {
    props.defaultSelected = props.selected;
    delete props.selected;
  }

  // Textarea
  if (tag === 'textarea') {
    props.defaultValue = node.textContent || '';
  }

  // Convert children recursively
  let children = [];

  if (tag !== 'textarea') {
    children = Array.from(node.childNodes)
      .map((child, index) =>
        toReactNode(child, `${key}.${index}`, route, context)
      )
      .filter((child) => child !== null);
  }

  // Shared site chrome and native dialogs retain the original captured DOM.
  if (tag === 'header') return <Header key={key} {...props}>{children}</Header>;
  if (tag === 'footer') return <Footer key={key} {...props}>{children}</Footer>;
  if (tag === 'dialog') return <Modal key={key} {...props}>{children}</Modal>;

  // Keep the two different captured form contracts as separate feature components.
  if (tag === 'form' && node.querySelector('input[name="puppyId"][type="hidden"]')) {
    return <PuppyEnquiryForm key={key} {...props}>{children}</PuppyEnquiryForm>;
  }
  if (tag === 'form' && node.querySelector('select[name="puppyId"]')) {
    return <ContactForm key={key} {...props}>{children}</ContactForm>;
  }

  // Repeated puppy listing cards are rendered through one reusable component.
  if (tag === 'a' && (Array.isArray(props.className) ? props.className : String(props.className || '').split(/\s+/)).some((name) => ['tp-sketch', 'tp-lineup__pup', 'tp-door__link'].includes(name))) {
    return <PuppyCard key={key} {...props}>{children}</PuppyCard>;
  }

  // The captured page's original gallery/list DOM is retained, but shared
  // feature components own the repeated structural elements.
  if (tag === 'ul' && String(props['aria-label'] || '').startsWith('All photos')) {
    return <PuppyGallery key={key} {...props}>{children}</PuppyGallery>;
  }
  const listClasses = Array.isArray(props.className) ? props.className : String(props.className || '').split(/\s+/);
  if ((tag === 'ul' && ['tp-sketches', 'tp-lineup'].some((name) => listClasses.includes(name))) ||
      (tag === 'ol' && listClasses.includes('tp-meet__track'))) {
    return <PuppyGrid key={key} as={tag} {...props}>{children}</PuppyGrid>;
  }

  return React.createElement(tag, props, ...children);
}

/* =========================================
   CAPTURED PAGE COMPONENT
========================================= */

export default function CapturedPage({
  markup = '',
  route = '/',
  puppy = null,
  puppies = [],
}) {
  const rootRef = useRef(null);

  // Parse the captured markup only when its source page changes. API updates
  // are applied in-place below so scroll observers and CSS animations are not reset.
  const content = useMemo(() => {
    if (typeof window === 'undefined' || !markup || typeof markup !== 'string') return null;

    try {
      const documentNode = new DOMParser().parseFromString(markup, 'text/html');
      restoreStreamedContent(documentNode);
      return Array.from(documentNode.body.childNodes).map(
        (node, index) => toReactNode(node, String(index), route, {})
      );
    } catch (error) {
      console.error(`Failed to render captured page: ${route}`, error);
      return null;
    }
  }, [markup, route]);

  useEffect(() => {
    const rootNode = rootRef.current;
    if (!rootNode) return;

    // The backend public UUID is the same identifier used by the captured form.
    if (puppy?.publicId) {
      rootNode.querySelectorAll('form input[name="puppyId"][type="hidden"]').forEach((input) => {
        input.value = puppy.publicId;
        input.setAttribute('value', puppy.publicId);
      });
    }

    // Use backend-owned identity fields where the captured layout has matching slots.
    if (puppy?.name) {
      const profileName = rootNode.querySelector('.tp-tag h1');
      if (profileName) profileName.textContent = puppy.name;
      rootNode.querySelectorAll('.tp-sketch__name, .tp-door__name').forEach((node) => {
        node.textContent = puppy.name;
      });
    }
    if (puppy?.breed) {
      const profileBreed = rootNode.querySelector('.tp-tag > p');
      if (profileBreed) profileBreed.textContent = puppy.breed;
    }
    if (puppy?.gender && puppy.gender !== 'unknown') {
      const definitionRows = Array.from(rootNode.querySelectorAll('.tp-tag dl dt'));
      const genderLabel = definitionRows.find((node) => node.textContent.trim().toLowerCase() === 'boy or girl');
      const genderValue = genderLabel?.nextElementSibling;
      if (genderValue) {
        genderValue.textContent = puppy.gender === 'male' ? 'Boy'
          : puppy.gender === 'female' ? 'Girl' : 'Boy & girl';
      }
    }

    // Backend availability can change while preserving the original badge element.
    if (puppy?.status) {
      const chip = rootNode.querySelector('.tp-tag .chip');
      if (chip) {
        chip.textContent = puppy.status === 'available' ? 'Available'
          : puppy.status === 'reserved' ? 'Reserved'
          : puppy.status === 'sold' ? 'Gone home' : 'Unavailable';
      }
      rootNode.querySelectorAll('.tp-storypage').forEach((node) => {
        node.setAttribute('data-puppy-status', puppy.status);
      });
    }

    const puppiesBySlug = Object.fromEntries((puppies || []).map((item) => [item.slug, item]));
    rootNode.querySelectorAll('a[data-puppy-card="true"]').forEach((card) => {
      const record = puppiesBySlug[card.dataset.puppySlug];
      if (!record?.status) return;

      card.setAttribute('data-puppy-status', record.status);
      if (record.name) {
        const nameNode = card.querySelector('.tp-sketch__name, .tp-door__name');
        if (nameNode) nameNode.textContent = record.name;
      }
      const sticker = card.querySelector('.tp-sketch__sticker, .tp-door__tag');
      if (sticker) {
        sticker.textContent = record.status === 'available' ? 'Available'
          : record.status === 'reserved' ? 'Reserved'
          : record.status === 'sold' ? 'Gone home' : 'Unavailable';
      }
    });
  }, [puppy, puppies]);

  return (
    <div ref={rootRef} className="original-page-body">
      {content}
    </div>
  );
}
