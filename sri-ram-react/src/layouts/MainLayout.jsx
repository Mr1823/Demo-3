import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

// Wraps storefront pages with the ONE shared header/footer (extracted from the Home
// screen export). This fixes the nav-label drift we saw across individual Stitch
// screens — every page now uses the same Header/Footer instance instead of its own copy.
export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
