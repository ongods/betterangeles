import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container, Skeleton } from './ui'
import { Shell } from './Shell'
import Home from './pages/Home'

// Home ships in the main bundle; other routes load on demand to keep the first visit light on slow connections.
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })))
const ServiceDetail = lazy(() => import('./pages/Services').then((m) => ({ default: m.ServiceDetail })))
const Government = lazy(() => import('./pages/Government').then((m) => ({ default: m.Government })))
const Barangays = lazy(() => import('./pages/Government').then((m) => ({ default: m.Barangays })))
const BarangayDetail = lazy(() => import('./pages/Government').then((m) => ({ default: m.BarangayDetail })))
const Directory = lazy(() => import('./pages/Government').then((m) => ({ default: m.Directory })))
const DirectoryDetail = lazy(() => import('./pages/Government').then((m) => ({ default: m.DirectoryDetail })))
const Transparency = lazy(() => import('./pages/Transparency').then((m) => ({ default: m.Transparency })))
const TransparencyDetail = lazy(() => import('./pages/Transparency').then((m) => ({ default: m.TransparencyDetail })))
const MapPage = lazy(() => import('./pages/MapPage'))
const About = lazy(() => import('./pages/About'))
const Culture = lazy(() => import('./pages/Culture'))
const Contact = lazy(() => import('./pages/Contact'))
const Accessibility = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Accessibility })))
const NotFound = lazy(() => import('./pages/NotFound'))

const Loading = () => <Container className="py-12"><Skeleton lines={5} /></Container>

export default function App() {
  return (
    <Shell>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:category" element={<Services />} />
          <Route path="/services/:category/:documentSlug" element={<ServiceDetail />} />
          <Route path="/government" element={<Government />} />
          <Route path="/government/barangays" element={<Barangays />} />
          <Route path="/government/barangays/:id" element={<BarangayDetail />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/directory/:type/:id" element={<DirectoryDetail />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/transparency/:id" element={<TransparencyDetail />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Shell>
  )
}
