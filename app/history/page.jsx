'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import Navbar from '../../components/Navbar';
import SentimentBadge from '../../components/SentimentBadge';
import SignalStrength from '../../components/SignalStrength';

function rowDateKey(row) {
  const d = row.analysis_date;
  if (d === null || d === undefined) {
    return '';
  }
  if (typeof d === 'string') {
    return d.slice(0, 10);
  }
  if (d instanceof Date) {
    return d.toISOString().slice(0, 10);
  }
  return String(d);
}

function displayDate(row) {
  const key = rowDateKey(row);
  return key || '—';
}

export default function History() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPair, setFilterPair] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetch('/api/analyses?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAnalyses(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const uniquePairs = useMemo(() => {
    const pairs = new Set(analyses.map((a) => a.pair));
    return ['All', ...Array.from(pairs).sort()];
  }, [analyses]);

  const filteredData = useMemo(() => {
    return analyses.filter((item) => {
      const pairMatch = filterPair === 'All' || item.pair === filterPair;
      const dateMatch =
        !filterDate || rowDateKey(item) === filterDate;
      return pairMatch && dateMatch;
    });
  }, [analyses, filterPair, filterDate]);

  const bullishCount = analyses.filter(
    (item) => String(item.sentiment).toLowerCase() === 'bullish'
  ).length;
  const bearishCount = analyses.filter(
    (item) => String(item.sentiment).toLowerCase() === 'bearish'
  ).length;

  return (
    <Navbar>
      <div className="container py-4">
        <h1 className="display-5 fw-bold mb-4">Analysis History</h1>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="filter-pair">
                  Filter by Pair
                </label>
                <select
                  id="filter-pair"
                  className="form-select"
                  value={filterPair}
                  onChange={(e) => setFilterPair(e.target.value)}
                  disabled={loading}
                >
                  {uniquePairs.map((pair) => (
                    <option key={pair} value={pair}>
                      {pair}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="filter-date">
                  Filter by Date
                </label>
                <input
                  id="filter-date"
                  type="date"
                  className="form-control"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pair</th>
                  <th>Sentiment</th>
                  <th>Signal Strength</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-secondary">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{displayDate(item)}</td>
                      <td>
                        <strong>{item.pair}</strong>
                      </td>
                      <td>
                        <SentimentBadge sentiment={item.sentiment} />
                      </td>
                      <td>
                        <SignalStrength value={item.signal_strength} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            router.push(
                              `/analysis/${item.pair.replace('/', '-')}?id=${item.id}`
                            )
                          }
                        >
                          <Eye size={16} className="me-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4"
                      style={{ color: '#94a3b8' }}
                    >
                      No analyses found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="h2 mb-0">{analyses.length}</h3>
                <small style={{ color: '#94a3b8' }}>Total Analyses</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="h2 mb-0 text-success">{bullishCount}</h3>
                <small style={{ color: '#94a3b8' }}>Bullish Signals</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="h2 mb-0 text-danger">{bearishCount}</h3>
                <small style={{ color: '#94a3b8' }}>Bearish Signals</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
