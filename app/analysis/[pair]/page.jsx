'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import SentimentBadge from '../../../components/SentimentBadge';
import SignalStrength from '../../../components/SignalStrength';
import ImpactBadge from '../../../components/ImpactBadge';

function formatHeaderDate(createdAt, analysisDate) {
  if (createdAt) {
    try {
      const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch {
      /* fall through */
    }
  }
  if (analysisDate) {
    if (typeof analysisDate === 'string') {
      return analysisDate;
    }
    if (analysisDate instanceof Date) {
      return analysisDate.toLocaleDateString();
    }
  }
  return '';
}

function formatNewsTime(value) {
  if (value === null || value === undefined) {
    return '';
  }
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
      return '';
    }
    return d.toLocaleString();
  } catch {
    return '';
  }
}

function AnalysisResultContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pairParam = params?.pair;
  const pairSegment =
    typeof pairParam === 'string' ? decodeURIComponent(pairParam) : 'EUR-USD';
  const id = searchParams.get('id');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pairSymbol = pairSegment.replace('-', '/');

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let detailUrl;
        if (id) {
          detailUrl = `/api/analyses/${id}`;
        } else {
          const listRes = await fetch(
            `/api/analyses?pair=${encodeURIComponent(pairSymbol)}&limit=1`
          );
          const listJson = await listRes.json();
          if (!listJson.success || !listJson.data?.[0]) {
            throw new Error('Analysis not found');
          }
          detailUrl = `/api/analyses/${listJson.data[0].id}`;
        }

        const res = await fetch(detailUrl);
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || 'Failed to load analysis');
        }

        const analysis = json.data;
        if (!analysis) {
          throw new Error('Analysis not found');
        }

        setData(analysis);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load analysis';
        setError(message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pairSegment, id]);

  const getSentimentIcon = () => {
    const s = String(data?.sentiment || 'neutral').toLowerCase();
    switch (s) {
      case 'bullish':
        return <TrendingUp size={48} className="text-success" />;
      case 'bearish':
        return <TrendingDown size={48} className="text-danger" />;
      default:
        return <Minus size={48} className="text-secondary" />;
    }
  };

  if (loading) {
    return (
      <Navbar>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-secondary">Загрузка анализа...</p>
        </div>
      </Navbar>
    );
  }

  if (error || !data) {
    return (
      <Navbar>
        <div className="container py-5 text-center">
          <p className="text-secondary">
            Анализ не найден. Вернитесь на главную и запустите анализ.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => router.push('/')}
          >
            На главную
          </button>
        </div>
      </Navbar>
    );
  }

  const events = Array.isArray(data.key_events) ? data.key_events : [];
  const news = Array.isArray(data.news) ? data.news : [];
  const headerDate = formatHeaderDate(data.created_at, data.analysis_date);

  return (
    <Navbar>
      <div className="container py-4">
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0 mb-3"
            onClick={() => router.push('/')}
          >
            <ArrowLeft size={20} className="me-2" />
            Back to Dashboard
          </button>
          <h1 className="display-5 fw-bold mb-2">{data.pair} — Analysis</h1>
          {headerDate ? (
            <p style={{ color: '#94a3b8' }}>{headerDate}</p>
          ) : null}
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3">{getSentimentIcon()}</div>
                <div className="mb-2">
                  <SentimentBadge sentiment={data.sentiment} />
                </div>
                <small style={{ color: '#94a3b8' }}>Sentiment</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <SignalStrength value={data.signal_strength} large />
                <h3 className="h5 mb-0">{data.signal_strength}/5</h3>
                <small style={{ color: '#94a3b8' }}>Signal Strength</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="h6 mb-2">{data.base_currency}</h3>
                <p className="small mb-0" style={{ color: '#94a3b8' }}>
                  {data.base_summary}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="h6 mb-2">{data.quote_currency}</h3>
                <p className="small mb-0" style={{ color: '#94a3b8' }}>
                  {data.quote_summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="h4 mb-3">Key Events Today</h2>
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Currency</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-secondary py-4 text-center">
                        No events for this analysis.
                      </td>
                    </tr>
                  ) : (
                    events.map((event, index) => (
                      <tr key={`${event.time}-${event.event}-${index}`}>
                        <td>{event.time}</td>
                        <td>{event.event}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {event.currency}
                          </span>
                        </td>
                        <td>
                          <ImpactBadge impact={event.impact} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="h4 mb-3">Fundamental Recommendation</h2>
          <div className="card">
            <div
              className="card-body"
              style={{ fontSize: '15px', lineHeight: '1.6', color: '#cbd5e1' }}
            >
              {data.recommendation}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="h4 mb-3">News Feed</h2>
          <div className="row g-3">
            {news.length === 0 ? (
              <p className="text-secondary">No news items for this analysis.</p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-secondary">{item.source}</span>
                        <small style={{ color: '#94a3b8' }}>
                          {formatNewsTime(item.published_at)}
                        </small>
                      </div>
                      <h3 className="h6 mb-2">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {item.headline}
                          </a>
                        ) : (
                          item.headline
                        )}
                      </h3>
                      <p className="small mb-0" style={{ color: '#94a3b8' }}>
                        {item.summary}
                      </p>
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

export default function AnalysisResult() {
  return (
    <Suspense
      fallback={
        <Navbar>
          <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-secondary">Загрузка анализа...</p>
          </div>
        </Navbar>
      }
    >
      <AnalysisResultContent />
    </Suspense>
  );
}
