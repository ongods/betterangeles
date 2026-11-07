import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NotFound from './pages/NotFound';

const About = lazy(() => import('./pages/About'));
const Directory = lazy(() => import('./pages/Directory'));
const Transparency = lazy(() => import('./pages/Transparency'));
const Culture = lazy(() => import('./pages/Culture'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <ScrollToTop />
            <div id="page-content" tabIndex={-1} className="flex-grow">
              <Suspense
                fallback={
                  <p role="status" className="container mx-auto p-8">
                    Loading page…
                  </p>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/transparency" element={<Transparency />} />
                  <Route path="/culture" element={<Culture />} />
                  <Route
                    path="/contact"
                    element={
                      <Document
                        categoryType="government"
                        categoryOverride="city-guide"
                        slugOverride="contact"
                      />
                    }
                  />
                  <Route
                    path="/accessibility"
                    element={
                      <Document
                        categoryType="government"
                        categoryOverride="city-guide"
                        slugOverride="accessibility"
                      />
                    }
                  />
                  <Route path="/search" element={<Services />} />
                  <Route path="/services/:category" element={<Services />} />
                  <Route path="/services" element={<Services />} />
                  <Route
                    path="/services/:category/:documentSlug"
                    element={<Document categoryType="service" />}
                  />
                  <Route
                    path="/government/:category"
                    element={<Government />}
                  />
                  <Route path="/government" element={<Government />} />
                  <Route
                    path="/government/:category/:documentSlug"
                    element={<Document categoryType="government" />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
