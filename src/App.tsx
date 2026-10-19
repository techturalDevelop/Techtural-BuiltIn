/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import WorkspaceTools from '@/components/WorkspaceTools';
import Technology from '@/components/Technology';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ProjectsPage from '@/pages/ProjectsPage';
import EstimatorPage from '@/pages/EstimatorPage';
import TimelinePage from '@/pages/TimelinePage';
import VisualImpactPage from '@/pages/VisualImpactPage';
import MapPage from '@/pages/MapPage';
import DesignSelectorPage from '@/pages/DesignSelectorPage';
import KitHomesPage from '@/pages/KitHomesPage';
import DesignProductsPage from '@/pages/DesignProductsPage';
import ServicesPage from '@/pages/ServicesPage';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import TermsOfUsePage from '@/pages/legal/TermsOfUsePage';
import CookiePolicyPage from '@/pages/legal/CookiePolicyPage';

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <WorkspaceTools />
      <Portfolio />
      <Technology />
      <Testimonials />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary flex flex-col justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/estimator" element={<EstimatorPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/visual-impact" element={<VisualImpactPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/design-selector" element={<DesignSelectorPage />} />
              <Route path="/kit-homes" element={<KitHomesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/products" element={<DesignProductsPage />} />
              <Route path="/design-construction-products" element={<DesignProductsPage />} />
              <Route path="/tiny-homes" element={<DesignProductsPage defaultTab="tiny-homes" />} />
              <Route path="/tiny-home-concepts" element={<DesignProductsPage defaultTab="tiny-homes" />} />
              <Route path="/container-homes" element={<DesignProductsPage defaultTab="container-homes" />} />
              <Route path="/container-home-solutions" element={<DesignProductsPage defaultTab="container-homes" />} />
              <Route path="/commercial-designs" element={<DesignProductsPage defaultTab="commercial-designs" />} />
              <Route path="/education-aid-post" element={<DesignProductsPage defaultTab="education-aid-post" />} />
              <Route path="/education-aid-post-infrastructure" element={<DesignProductsPage defaultTab="education-aid-post" />} />
              <Route path="/commercial-warehouses" element={<DesignProductsPage defaultTab="commercial-warehouses" />} />
              <Route path="/commercial-warehouse-designs" element={<DesignProductsPage defaultTab="commercial-warehouses" />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </ErrorBoundary>
    </Router>
  );
}
