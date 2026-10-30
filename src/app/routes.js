import HomePage from '../pages/HomePage.jsx';
import PuppiesCapturedPage from '../features/puppies/pages/PuppiesCapturedPage.jsx';
import HappyFamiliesPage from '../pages/HappyFamiliesPage.jsx';
import HowItWorksPage from '../pages/HowItWorksPage.jsx';
import FAQPage from '../pages/FAQPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import GoneHomePage from '../pages/GoneHomePage.jsx';
import MaltipooMaxPage from '../features/puppies/pages/profiles/MaltipooMaxPage.jsx';
import KoreanTeacupMaltipooPage from '../features/puppies/pages/profiles/KoreanTeacupMaltipooPage.jsx';
import KoreanTeacupPoodlePage from '../features/puppies/pages/profiles/KoreanTeacupPoodlePage.jsx';
import MaltipooCavapooPage from '../features/puppies/pages/profiles/MaltipooCavapooPage.jsx';
import ToyPoodlePage from '../features/puppies/pages/profiles/ToyPoodlePage.jsx';
import MaltipooFemalePage from '../features/puppies/pages/profiles/MaltipooFemalePage.jsx';
import PomeranianFemalePage from '../features/puppies/pages/profiles/PomeranianFemalePage.jsx';
import CopperPage from '../features/puppies/pages/profiles/CopperPage.jsx';
import ShihTzuFemalePage from '../features/puppies/pages/profiles/ShihTzuFemalePage.jsx';
import ShihTzuMalePage from '../features/puppies/pages/profiles/ShihTzuMalePage.jsx';
import KoreanTeacupPomeranianPage from '../features/puppies/pages/profiles/KoreanTeacupPomeranianPage.jsx';

// Canonical route table. .html aliases and trailing slashes are normalized in main.jsx.
export const pageMap = {
  '/': HomePage,
  '/puppies': PuppiesCapturedPage,
  '/happy-families': HappyFamiliesPage,
  '/how-it-works': HowItWorksPage,
  '/faq': FAQPage,
  '/contact': ContactPage,
  '/gone-home': GoneHomePage,
  '/puppies/maltipoo-max-male': MaltipooMaxPage,
  '/puppies/korean-teacup-maltipoo-female': KoreanTeacupMaltipooPage,
  '/puppies/korean-teacup-poodle-female': KoreanTeacupPoodlePage,
  '/puppies/maltipoo-cavapoo-male': MaltipooCavapooPage,
  '/puppies/toy-poodle-male-female': ToyPoodlePage,
  '/puppies/maltipoo-female-2': MaltipooFemalePage,
  '/puppies/pomeranian-female': PomeranianFemalePage,
  '/puppies/copper-male': CopperPage,
  '/puppies/shitzu-female': ShihTzuFemalePage,
  '/puppies/shitzu-male': ShihTzuMalePage,
  '/puppies/korean-teacup-pomeranian-male': KoreanTeacupPomeranianPage,
};

export const originalHtmlRoutes = Object.keys(pageMap).flatMap((route) => [
  route === '/' ? '/index.html' : `${route}.html`,
  route,
]);
