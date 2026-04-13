'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import SentimentBadge from '../components/SentimentBadge';
import SignalStrength from '../components/SignalStrength';

function formatTimestamp(value) {
  if (value === null || value === undefined) {
    return '';
  }
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
      return String(value);
    }
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}

export default function Dashboard() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/instruments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setInstruments(data.data);
          setLoadError(false);
        } else {
          setLoadError(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/analyses?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRecentAnalyses(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (instruments.length === 0) return;
    setSelectedPair((prev) =>
      instruments.some((i) => i.symbol === prev)
        ? prev
        : instruments[0].symbol
    );
  }, [instruments]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pair: selectedPair })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      router.push(
        `/analysis/${selectedPair.replace('/', '-')}?id=${data.data.id}`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Navbar>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4">Currency Pair Analysis</h1>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <select
                className="form-select form-select-lg mb-3"
                value={loading || loadError ? '' : selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                disabled={loading || loadError}
              >
                {loading && (
                  <option value="" disabled>
                    Loading...
                  </option>
                )}
                {!loading && loadError && (
                  <option value="" disabled>
                    Error loading pairs
                  </option>
                )}
                {!loading &&
                  !loadError &&
                  instruments.map((i) => (
                    <option key={i.id} value={i.symbol}>
                      {i.symbol}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-lg px-5"
                onClick={handleAnalyze}
                disabled={
                  loading || loadError || instruments.length === 0 || analyzing
                }
              >
                {analyzing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h4 mb-4">Recent Analyses</h2>
          <div className="row g-4">
            {recentAnalyses.length === 0 ? (
              <p className="text-secondary">No analyses yet. Run one above.</p>
            ) : (
              recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100"
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(
                          `/analysis/${analysis.pair.replace('/', '-')}?id=${analysis.id}`
                        );
                      }
                    }}
                    onClick={() =>
                      router.push(
                        `/analysis/${analysis.pair.replace('/', '-')}?id=${analysis.id}`
                      )
                    }
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className="h5 mb-0">{analysis.pair}</h3>
                        <SentimentBadge sentiment={analysis.sentiment} />
                      </div>

                      <div className="mb-3">
                        <small
                          className="d-block mb-1"
                          style={{ color: '#94a3b8' }}
                        >
                          Signal Strength
                        </small>
                        <SignalStrength value={analysis.signal_strength} />
                      </div>

                      <small style={{ color: '#94a3b8' }}>
                        {formatTimestamp(analysis.created_at)}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
}
