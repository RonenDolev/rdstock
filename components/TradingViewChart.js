'use client';
import { useEffect } from 'react';

export default function TradingViewChart({ symbol }) {
  useEffect(() => {
    if (!window.TradingView) return;

    new window.TradingView.widget({
      container_id: 'tv_chart_container',
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      details: true,
    });
  }, [symbol]);

  return <div id="tv_chart_container" style={{ height: '500px' }} />;
}
