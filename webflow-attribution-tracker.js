(function () {
  const STORE_KEY = "wf_attrib_v1";
  const TTL_DAYS = 90;
  const ATTR_KEYS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid"];
  const META_KEYS = ["landing_page","referrer","initial_referrer"];
  const FIELDS = [...ATTR_KEYS, ...META_KEYS];
  function nowMs() { return Date.now(); }
  function daysToMs(d) { return d * 24 * 60 * 60 * 1000; }
  function safeParse(json) {
    try { return JSON.parse(json); } catch (e) { return null; }
  }
  function getStore() {
    const raw = window.localStorage.getItem(STORE_KEY);
    const obj = raw ? safeParse(raw) : null;
    if (!obj || !obj._ts) return null;
    if (nowMs() - obj._ts > daysToMs(TTL_DAYS)) return null;
    return obj;
  }
  function setStore(obj) {
    obj._ts = nowMs();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(obj));
  }
  function getIncomingAttribution() {
    const out = {};
    const qs = new URLSearchParams(window.location.search);
    for (const k of ATTR_KEYS) {
      if (qs.has(k)) out[k] = qs.get(k);
    }
    return out;
  }
  function hasAnyAttribution(obj) {
    return ATTR_KEYS.some(k => obj[k] && String(obj[k]).trim() !== "");
  }
  const existing = getStore() || {};
  const incoming = getIncomingAttribution();
  if (!existing.initial_referrer) existing.initial_referrer = document.referrer || "";
  existing.referrer = document.referrer || existing.referrer || "";
  if (hasAnyAttribution(incoming)) {
    for (const k of ATTR_KEYS) {
      if (incoming[k] && String(incoming[k]).trim() !== "") existing[k] = incoming[k];
    }
    existing.landing_page = window.location.href;
  } else {
    if (!existing.landing_page) existing.landing_page = window.location.href;
  }
  setStore(existing);
  function fillForms() {
    const data = getStore();
    if (!data) return;
    document.querySelectorAll("form").forEach(form => {
      FIELDS.forEach(name => {
        const val = data[name];
        if (val === undefined || val === null || String(val).trim() === "") return;
        let el = form.querySelector(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
        if (!el) el = form.querySelector(`input#${name}, textarea#${name}, select#${name}`);
        if (!el) return;
        if (!el.value) el.value = String(val);
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillForms);
  } else {
    fillForms();
  }
  const obs = new MutationObserver(fillForms);
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
