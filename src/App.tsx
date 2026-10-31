/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import WorkspaceTools from '@/components/WorkspaceTools';
import Technology from '@/components/Technology';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import OfflineIndicator from '@/components/OfflineIndicator';
import MaintenanceNotice from '@/components/MaintenanceNotice';
import { MAINTENANCE_CONFIG, isMaintenanceBypassed, setMaintenanceBypass } from '@/config/maintenanceConfig';
import { Eye, Lock } from 'lucide-react';
import ProjectsPage from '@/pages/ProjectsPage';
import EstimatorPage from '@/pages/EstimatorPage';
import TimelinePage from '@/pages/TimelinePage';
// Visual Impact and Map temporarily hidden until functions are updated
// import VisualImpactPage from '@/pages/VisualImpactPage';
// import MapPage from '@/pages/MapPage';
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
      {/* Testimonials temporarily hidden until content is updated */}
      <Contact />
    </>
  );
}

export default function App() {
  const [isBypassed, setIsBypassed] = useState(() => isMaintenanceBypassed());

  const handleExitPreview = () => {
    setMaintenanceBypass(false);
    setIsBypassed(false);
  };

  // If Maintenance Mode is enabled and user is not in admin preview bypass
  if (MAINTENANCE_CONFIG.enabled && !isBypassed) {
    return (
      <ErrorBoundary>
        <MaintenanceNotice onBypass={() => setIsBypassed(true)} />
        <OfflineIndicator />
      </ErrorBoundary>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        {MAINTENANCE_CONFIG.enabled && isBypassed && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 shadow-md">
            <div className="flex items-center gap-2">
              <Eye size={15} className="shrink-0" />
              <span>Admin Preview Active — Website is currently displaying the Maintenance Notice to all public visitors.</span>
            </div>
            <button
              onClick={handleExitPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 text-amber-300 hover:text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Lock size={12} />
              <span>Exit Preview &amp; Re-lock Notice</span>
            </button>
          </div>
        )}
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary flex flex-col justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/estimator" element={<EstimatorPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              {/* Visual Impact and Project Map temporarily hidden until functions are updated */}
              <Route path="/visual-impact" element={<Navigate to="/" replace />} />
              <Route path="/map" element={<Navigate to="/projects" replace />} />
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
          <OfflineIndicator />
        </div>
      </ErrorBoundary>
    </Router>
  );
}
