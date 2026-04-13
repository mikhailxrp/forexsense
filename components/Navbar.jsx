'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3 } from 'lucide-react';

export default function Navbar({ children }) {
  const pathname = usePathname();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <BarChart3 size={28} className="me-2" />
            <span className="fw-bold fs-4">ForexSense</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            aria-expanded={isNavExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  href="/"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                  href="/history"
                >
                  History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">{children}</main>

      <footer className="py-4 mt-5" style={{ borderTop: '1px solid #30363d' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-muted small mb-0">
                &copy; 2026 ForexSense. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted small mb-0">
                Fundamental analysis for informed trading decisions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
