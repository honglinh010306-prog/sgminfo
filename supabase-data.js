/* Shared Supabase data access for the public site and admin dashboard. */
(function () {
  'use strict';

  const KEYS = ['creators', 'events', 'partners', 'content', 'activity'];
  const PREFIX = 'sgm_';
  const config = window.SUPABASE_CONFIG || {};
  const configured = Boolean(
    config.url && config.anonKey &&
    !config.url.includes('https://nccdkkqmzpuwqqjguxtt.supabase.co') &&
    !config.anonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jY2Rra3FtenB1d3Fxamd1eHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjQ1NjAsImV4cCI6MjEwNDIwMDU2MH0.EzWYyhigsFFa9JaQAHWLezfxWlfzHziX1JlHV06LU2g')
  );
  const client = configured && window.supabase
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  const readCache = key => JSON.parse(localStorage.getItem(PREFIX + key) || 'null');
  const writeCache = (key, value) => localStorage.setItem(PREFIX + key, JSON.stringify(value));

  const api = {
    configured,
    client,
    async ready() {
      if (!client) return;
      const { data, error } = await client.from('site_data').select('key, value');
      if (error) throw error;
      data.forEach(row => {
        if (KEYS.includes(row.key)) writeCache(row.key, row.value);
      });
    },
    get(key) {
      return readCache(key);
    },
    has(key) {
      return localStorage.getItem(PREFIX + key) !== null;
    },
    async save(key, value) {
      writeCache(key, value);
      if (!client) return;
      const { error } = await client
        .from('site_data')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async signIn(email, password) {
      if (!client) throw new Error('Supabase chưa được cấu hình.');
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signOut() {
      if (client) await client.auth.signOut();
    },
    async getSession() {
      if (!client) return null;
      const { data } = await client.auth.getSession();
      return data.session;
    },
    async track(page, type) {
      if (!client) return;
      const { error } = await client.rpc('record_site_stat', {
        page_name: page || null,
        click_type: type || null,
      });
      if (error) console.warn('Không thể ghi nhận thống kê:', error.message);
    },
    async getStats() {
      if (!client) return readCache('stats') || {};
      const { data, error } = await client.from('site_stats').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return data || {};
    },
    async resetStats() {
      if (!client) { writeCache('stats', {}); return; }
      const { error } = await client.rpc('reset_site_stats');
      if (error) throw error;
    },
  };

  window.SGMData = api;
})();
