import { useEffect, useMemo, useState } from 'react';
import { apiRequest, API_BASE_URL } from './api.js';

const INDUSTRIES = ['Textile', 'Steel', 'Wood', 'Other'];
const MATERIALS_BY_INDUSTRY = {
  Textile: ['cotton', 'cotton fabric'],
  Steel: ['steel', 'steel rods'],
  Wood: ['wood', 'timber'],
  Other: []
};

const initialRequirement = {
  industry: 'Textile',
  material: 'cotton',
  quantity: '500',
  maxBudget: '200',
  minQuality: '8',
  maxDeliveryDays: '10',
  location: 'Jaipur'
};

const initialSupplierOffer = {
  name: '',
  companyName: '',
  industry: 'Textile',
  materials: 'cotton, cotton fabric',
  pricePerUnit: '180',
  qualityScore: '9',
  deliveryDays: '3',
  rating: '4.5',
  availableQuantity: '1000',
  location: 'Jaipur'
};

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 4.5 4.5"/></>,
    package: <><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="m3.8 7.7 8.2 4.5 8.2-4.5M12 12.2V21M7.8 5.2l8.4 4.5"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><rect x="7" y="11" width="3" height="5" rx=".7"/><rect x="12" y="7" width="3" height="9" rx=".7"/><rect x="17" y="4" width="3" height="12" rx=".7"/></>,
    shield: <><path d="M12 3 20 6v5.5c0 4.8-3.2 7.8-8 9.5-4.8-1.7-8-4.7-8-9.5V6l8-3Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 16.5h.01"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}

function Brand({ inverse = false, compact = false }) {
  return <div className={`brand ${inverse ? 'brand-inverse' : ''} ${compact ? 'brand-compact' : ''}`}>
    <div className="brand-mark"><span>V</span><i /></div>
    <div className="brand-copy"><strong>VENORA</strong>{!compact && <small>SMART PROCUREMENT</small>}</div>
  </div>;
}

function Field({ label, hint, children, className = '' }) {
  return <label className={`field ${className}`}>
    <span className="field-label">{label}</span>
    {children}
    {hint && <span className="field-hint">{hint}</span>}
  </label>;
}

function TextInput(props) {
  return <input className="text-input" {...props} />;
}

function SelectInput({ children, ...props }) {
  return <select className="text-input select-input" {...props}>{children}</select>;
}

function StatusDot({ status }) {
  return <span className={`status-dot ${status === 'online' ? 'online' : 'offline'}`} />;
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('vendor');
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', industry: 'Other' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    apiRequest('/api/health').then(() => setHealth('online')).catch(() => setHealth('offline'));
  }, []);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = mode === 'register'
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password, role, location: form.location.trim(), industry: form.industry }
        : { email: form.email.trim(), password: form.password, role };
      const response = await apiRequest(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, { method: 'POST', body: payload });
      if (!response.token || !response.user) throw new Error('The backend response did not include a login token and user.');
      onAuthenticated(response);
    } catch (requestError) {
      setError(requestError.message || 'Could not complete the request.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-story">
      <div className="story-top"><Brand inverse /></div>
      <div className="story-content">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-star">✳</span> SOURCING, REIMAGINED</div>
        <h1>Better suppliers.<br /><em>Smarter decisions.</em></h1>
        <p className="story-lede">One connected workspace to bring your procurement requirements and the right suppliers together.</p>
        <div className="story-points">
          <div><span className="story-point-icon"><Icon name="search" size={17} /></span><span><strong>Discover with context</strong><small>Find suppliers aligned to your needs.</small></span></div>
          <div><span className="story-point-icon"><Icon name="chart" size={17} /></span><span><strong>Compare with clarity</strong><small>Understand price, quality and delivery.</small></span></div>
          <div><span className="story-point-icon"><Icon name="shield" size={17} /></span><span><strong>Choose with confidence</strong><small>See transparent, rule-based match scores.</small></span></div>
        </div>
      </div>
      <div className="story-footer"><span>VENORA MVP · DEMONSTRATION BUILD</span><span>PROCUREMENT, MADE CLEAR.</span></div>
      <div className="story-orb orb-one" /><div className="story-orb orb-two" />
    </section>

    <section className="auth-panel-wrap">
      <div className="auth-panel-top"><Brand compact /><div className="api-status"><StatusDot status={health} />{health === 'online' ? 'Backend connected' : health === 'offline' ? 'Backend not reachable' : 'Checking backend…'}</div></div>
      <div className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-heading"><div className="auth-kicker">YOUR PROCUREMENT WORKSPACE</div><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Sign in to continue to your VENORA workspace.' : 'Choose your role and get started with VENORA.'}</p></div>
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button>
          </div>
          <form onSubmit={submit} className="auth-form">
            {mode === 'register' && <Field label="Full name"><TextInput autoComplete="name" placeholder="e.g. Aditi Sharma" value={form.name} onChange={e => update('name', e.target.value)} required minLength={2} /></Field>}
            <Field label="Account role">
              <div className="role-switch">
                <button type="button" className={role === 'vendor' ? 'selected' : ''} onClick={() => setRole('vendor')}><span className="role-symbol"><Icon name="layers" size={18} /></span><span><strong>Vendor</strong><small>Source materials</small></span>{role === 'vendor' && <span className="role-check"><Icon name="check" size={13} /></span>}</button>
                <button type="button" className={role === 'supplier' ? 'selected' : ''} onClick={() => setRole('supplier')}><span className="role-symbol"><Icon name="package" size={18} /></span><span><strong>Supplier</strong><small>List offerings</small></span>{role === 'supplier' && <span className="role-check"><Icon name="check" size={13} /></span>}</button>
              </div>
            </Field>
            <Field label="Email address"><TextInput type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} required /></Field>
            <Field label="Password" hint={mode === 'register' ? 'Use at least 8 characters.' : undefined}><TextInput type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'login' ? 'Enter your password' : 'Create a secure password'} value={form.password} onChange={e => update('password', e.target.value)} required minLength={mode === 'register' ? 8 : undefined} /></Field>
            {mode === 'register' && <div className="form-grid-two">
              <Field label="Location"><TextInput placeholder="e.g. Jaipur" value={form.location} onChange={e => update('location', e.target.value)} /></Field>
              <Field label="Industry"><SelectInput value={form.industry} onChange={e => update('industry', e.target.value)}>{INDUSTRIES.map(industry => <option key={industry}>{industry}</option>)}</SelectInput></Field>
            </div>}
            {error && <div className="alert alert-error"><Icon name="alert" size={17} /><span>{error}</span></div>}
            {health === 'offline' && <div className="alert alert-warn"><Icon name="alert" size={17} /><span>The API is not reachable yet. Start the backend at <code>localhost:5000</code>, then retry.</span></div>}
            <button className="btn btn-primary btn-wide auth-submit" disabled={busy} type="submit">{busy ? <><span className="spinner" /> Working…</> : <>{mode === 'login' ? 'Sign in to VENORA' : 'Create account'} <Icon name="arrow" size={17} /></>}</button>
          </form>
          <div className="auth-bottom-note"><span className="lock-dot"><Icon name="shield" size={14} /></span> Demo credentials are managed by your connected backend.</div>
        </div>
        <div className="auth-legal">By continuing, you agree to use VENORA as a project demonstration prototype.</div>
      </div>
    </section>
  </main>;
}

function AppHeader({ user, health, onLogout }) {
  const initials = (user?.name || 'V').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return <header className="topbar">
    <div className="topbar-brand"><Brand compact /></div>
    <div className="topbar-right"><div className="topbar-service"><StatusDot status={health} /><span>{health === 'online' ? 'API connected' : health === 'offline' ? 'API offline' : 'Checking API'}</span></div><div className="topbar-user"><div className="avatar">{initials}</div><div className="topbar-user-copy"><strong>{user?.name || 'VENORA user'}</strong><span>{user?.role === 'supplier' ? 'Supplier workspace' : 'Vendor workspace'}</span></div></div><button className="icon-button logout-button" title="Sign out" aria-label="Sign out" onClick={onLogout}><Icon name="logout" size={18} /></button></div>
  </header>;
}

function Sidebar({ role, active, onNavigate, user }) {
  const menu = role === 'supplier'
    ? [{ key: 'overview', icon: 'grid', label: 'Overview' }, { key: 'catalogue', icon: 'package', label: 'Supplier directory' }]
    : [{ key: 'overview', icon: 'grid', label: 'Overview' }, { key: 'matching', icon: 'search', label: 'Find suppliers' }, { key: 'catalogue', icon: 'package', label: 'Supplier directory' }];
  return <aside className="sidebar">
    <div className="sidebar-section-label">WORKSPACE</div>
    <nav className="side-nav">{menu.map(item => <button key={item.key} className={`side-nav-item ${active === item.key ? 'active' : ''}`} onClick={() => onNavigate(item.key)}><Icon name={item.icon} size={18} /><span>{item.label}</span>{active === item.key && <span className="nav-active-bar" />}</button>)}</nav>
    <div className="sidebar-divider" />
    <div className="sidebar-section-label">YOUR ROLE</div>
    <div className="role-summary"><div className="role-summary-icon"><Icon name={role === 'supplier' ? 'package' : 'layers'} size={18} /></div><div><strong>{role === 'supplier' ? 'Supplier' : 'Vendor'}</strong><span>{role === 'supplier' ? 'List and manage offerings' : 'Find a suitable supplier'}</span></div></div>
    <div className="sidebar-bottom"><div className="sidebar-help-icon">?</div><div><strong>Prototype workspace</strong><p>Built for the VENORA 20% demonstration.</p></div></div>
  </aside>;
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="section-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

function MetricCard({ icon, eyebrow, value, caption, tone = '' }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><span className="metric-icon"><Icon name={icon} size={19} /></span><span className="metric-eyebrow">{eyebrow}</span></div><div className="metric-value">{value}</div><div className="metric-caption">{caption}</div></div>;
}

function VendorDashboard({ token, user, onNavigate }) {
  const [form, setForm] = useState(initialRequirement);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [match, setMatch] = useState(null);
  const [catalogueCount, setCatalogueCount] = useState('—');
  const [sortBy, setSortBy] = useState('ranked');
  const [submittedRequirement, setSubmittedRequirement] = useState(null);

  useEffect(() => {
    let active = true;
    apiRequest('/api/suppliers').then(data => { if (active) setCatalogueCount(Number.isFinite(data.count) ? data.count : (data.suppliers || []).length); }).catch(() => { if (active) setCatalogueCount('—'); });
    return () => { active = false; };
  }, []);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const suggestedMaterials = MATERIALS_BY_INDUSTRY[form.industry] || [];

  async function searchMatches(event) {
    event.preventDefault();
    setError('');
    setMatch(null);
    setBusy(true);
    const payload = {
      industry: form.industry,
      material: form.material.trim().toLowerCase(),
      quantity: Number(form.quantity),
      maxBudget: Number(form.maxBudget),
      minQuality: Number(form.minQuality),
      maxDeliveryDays: Number(form.maxDeliveryDays),
      location: form.location.trim()
    };
    if (!payload.material || !payload.location || !Number.isFinite(payload.quantity) || payload.quantity <= 0 || !Number.isFinite(payload.maxBudget) || payload.maxBudget <= 0 || !Number.isFinite(payload.minQuality) || payload.minQuality < 0 || payload.minQuality > 10 || !Number.isFinite(payload.maxDeliveryDays) || payload.maxDeliveryDays <= 0) {
      setError('Please enter a material, location, positive quantity and price cap, quality from 0–10, and a positive delivery limit.');
      setBusy(false);
      return;
    }
    try {
      const response = await apiRequest('/api/matching', { method: 'POST', token, body: payload });
      setMatch(response);
      setSubmittedRequirement(payload);
      setSortBy('ranked');
      setTimeout(() => document.getElementById('matching-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (requestError) {
      setError(requestError.message || 'Supplier matching failed.');
    } finally {
      setBusy(false);
    }
  }

  const sortedRecommendations = useMemo(() => {
    const recommendations = [...(match?.recommendations || [])];
    switch (sortBy) {
      case 'price': return recommendations.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
      case 'quality': return recommendations.sort((a, b) => b.qualityScore - a.qualityScore);
      case 'delivery': return recommendations.sort((a, b) => a.deliveryDays - b.deliveryDays);
      default: return recommendations.sort((a, b) => Number(b.meetsPreferredQuality) - Number(a.meetsPreferredQuality) || b.compatibilityScore - a.compatibilityScore);
    }
  }, [match, sortBy]);

  return <div className="page-content">
    <PageHeading eyebrow="VENDOR WORKSPACE" title={`Good to see you, ${(user?.name || 'Vendor').split(' ')[0]}.`} description="Turn your procurement requirement into a shortlist you can compare with confidence." action={<span className="demo-status-pill"><span /> DEMO ENVIRONMENT</span>} />
    <div className="metric-grid">
      <MetricCard icon="search" eyebrow="MATCHING ENGINE" value="Top 3" caption="Eligible supplier recommendations" />
      <MetricCard icon="package" eyebrow="SUPPLIER CATALOGUE" value={catalogueCount} caption="Active listings returned by backend" tone="metric-blue" />
      <MetricCard icon="chart" eyebrow="SCORING MODEL" value="4 signals" caption="Price · Quality · Delivery · Rating" tone="metric-green" />
    </div>

    <section className="work-section" id="matching-form">
      <div className="section-title-row"><div><div className="section-eyebrow">01 / YOUR REQUIREMENT</div><h2>What are you looking for?</h2><p>Enter your material needs. VENORA sends these criteria to the connected matching API.</p></div><div className="section-step">STEP 01 <span>/</span> 02</div></div>
      <div className="requirement-layout">
        <form className="requirement-form" onSubmit={searchMatches}>
          <div className="form-grid-two">
            <Field label="Industry"><SelectInput value={form.industry} onChange={e => { const industry = e.target.value; setForm(prev => ({ ...prev, industry, material: (MATERIALS_BY_INDUSTRY[industry] || []).includes(prev.material) ? prev.material : ((MATERIALS_BY_INDUSTRY[industry] || [])[0] || '') })); }}><option value="Textile">Textile</option><option value="Steel">Steel</option><option value="Wood">Wood</option><option value="Other">Other</option></SelectInput></Field>
            <Field label="Material / product" hint="Must match a catalogue material tag."><TextInput list="material-options" placeholder="e.g. cotton" value={form.material} onChange={e => update('material', e.target.value)} required /><datalist id="material-options">{suggestedMaterials.map(material => <option value={material} key={material} />)}</datalist></Field>
          </div>
          {suggestedMaterials.length > 0 && <div className="suggestion-row"><span>Try a catalogue tag:</span>{suggestedMaterials.map(item => <button type="button" className={`suggestion-chip ${form.material === item ? 'selected' : ''}`} key={item} onClick={() => update('material', item)}>{item}</button>)}</div>}
          <div className="field-divider" />
          <div className="form-grid-three">
            <Field label="Required quantity"><div className="input-with-suffix"><TextInput type="number" min="0.01" step="any" value={form.quantity} onChange={e => update('quantity', e.target.value)} required /><span>units</span></div></Field>
            <Field label="Max price per unit" hint="Backend field: maxBudget"><div className="input-with-prefix"><span>₹</span><TextInput type="number" min="0.01" step="any" value={form.maxBudget} onChange={e => update('maxBudget', e.target.value)} required /></div></Field>
            <Field label="Preferred quality score" hint="0–10; helps ranking when met"><div className="input-with-suffix"><TextInput type="number" min="0" max="10" step="0.5" value={form.minQuality} onChange={e => update('minQuality', e.target.value)} required /><span>/ 10</span></div></Field>
          </div>
          <div className="form-grid-two form-grid-last">
            <Field label="Preferred max delivery time" hint="Improves score; not a hard filter yet"><div className="input-with-suffix"><TextInput type="number" min="1" step="1" value={form.maxDeliveryDays} onChange={e => update('maxDeliveryDays', e.target.value)} required /><span>days</span></div></Field>
            <Field label="Delivery location"><div className="input-with-prefix"><span className="prefix-icon"><Icon name="pin" size={16} /></span><TextInput placeholder="City or region" value={form.location} onChange={e => update('location', e.target.value)} required /></div></Field>
          </div>
          <div className="field-divider" />
          <div className="submit-row"><div className="form-footnote"><Icon name="shield" size={16} /><span>Only eligible suppliers under your maximum unit-price cap are returned.</span></div><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? <><span className="spinner" /> Finding matches…</> : <>Find suppliers <Icon name="arrow" size={17} /></>}</button></div>
          {error && <div className="alert alert-error form-alert"><Icon name="alert" size={17} /><span>{error}</span></div>}
        </form>
        <aside className="matching-info-panel"><div className="matching-illustration"><div className="illustration-ring ring-a"/><div className="illustration-ring ring-b"/><div className="illustration-core"><Icon name="layers" size={31}/></div><span className="float-token token-one"><Icon name="check" size={13}/></span><span className="float-token token-two"><Icon name="star" size={14}/></span><span className="float-token token-three"><Icon name="package" size={14}/></span></div><div className="info-panel-copy"><div className="section-eyebrow">HOW IT WORKS</div><h3>From requirement<br />to shortlist.</h3><p>The backend checks eligibility first, then ranks suppliers using its weighted scoring model.</p></div><div className="scoring-list"><div><span className="scoring-dot dot-price"/>Price <strong>35%</strong></div><div><span className="scoring-dot dot-quality"/>Quality <strong>35%</strong></div><div><span className="scoring-dot dot-delivery"/>Delivery <strong>20%</strong></div><div><span className="scoring-dot dot-rating"/>Supplier rating <strong>10%</strong></div></div><div className="location-note"><Icon name="pin" size={15}/><span>Location is collected and displayed by this prototype, but the current backend does not use it as a hard filter or scoring weight.</span></div></aside>
      </div>
    </section>

    <section className="results-section" id="matching-results">
      <div className="section-title-row"><div><div className="section-eyebrow">02 / MATCHING RESULTS</div><h2>Your supplier shortlist</h2><p>{match ? `Backend returned ${match.count ?? (match.recommendations || []).length} recommendation(s) for your requirement.` : 'Your results will appear here after you submit a requirement.'}</p></div>{match?.recommendations?.length > 0 && <div className="sort-control"><label htmlFor="sort-matches">SORT BY</label><SelectInput id="sort-matches" value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="ranked">Best compatibility</option><option value="price">Lowest price</option><option value="quality">Highest quality</option><option value="delivery">Fastest delivery</option></SelectInput></div>}</div>
      {!match && <div className="results-placeholder"><div className="placeholder-icon"><Icon name="chart" size={24}/></div><div><strong>Your matches will show up here</strong><p>Complete the requirement form and run supplier matching to see the API-backed results.</p></div><span className="placeholder-number">01</span></div>}
      {match && (!sortedRecommendations.length ? <div className="no-results-card"><div className="no-results-icon"><Icon name="search" size={23}/></div><h3>No eligible suppliers found</h3><p>{match.message || 'No supplier met the selected filters.'}</p><div className="no-results-tip">Try a material tag from the catalogue, increase the maximum unit price, or reduce the required quantity.</div><button className="btn btn-secondary" onClick={() => document.getElementById('matching-form')?.scrollIntoView({ behavior: 'smooth' })}>Adjust requirement <Icon name="arrow" size={16}/></button></div> : <>
        <div className="match-summary-strip"><div className="match-summary-icon"><Icon name="check" size={18}/></div><div><strong>{match.count} suitable {match.count === 1 ? 'supplier' : 'suppliers'} returned</strong><span>{submittedRequirement?.industry} / {submittedRequirement?.material} · {submittedRequirement?.quantity} units · max ₹{Number(submittedRequirement?.maxBudget).toLocaleString('en-IN')} per unit</span></div><span className="backend-tag"><StatusDot status="online"/> LIVE API</span></div>
        <div className="supplier-results-grid">{sortedRecommendations.map((supplier, index) => <SupplierMatchCard key={supplier.supplierId || `${supplier.companyName}-${index}`} supplier={supplier} index={index} quantity={Number(submittedRequirement?.quantity || 0)} />)}</div>
        <div className="results-disclaimer"><Icon name="alert" size={16}/><span>Scores use the backend's rule-based formula (price, quality, delivery and rating); this prototype does not use a trained machine-learning model.</span></div>
      </>)}
    </section>
    <footer className="page-footer"><Brand compact/><span>VENORA · MVP demonstration · Supplier matching powered by your connected backend</span></footer>
  </div>;
}

function SupplierMatchCard({ supplier, index, quantity }) {
  const score = Math.max(0, Math.min(100, Number(supplier.compatibilityScore) || 0));
  const quality = Number(supplier.qualityScore || 0);
  const rating = Number(supplier.rating || 0);
  const cost = Number(supplier.pricePerUnit || 0) * quantity;
  const breakdown = supplier.scoreBreakdown || {};
  return <article className={`supplier-match-card ${index === 0 ? 'top-match' : ''}`}>
    <div className="supplier-card-top"><div className={`rank-badge ${index === 0 ? 'rank-first' : ''}`}>{String(index + 1).padStart(2, '0')}</div><div className="supplier-identity"><div className="supplier-monogram">{(supplier.companyName || supplier.name || 'S').trim()[0].toUpperCase()}</div><div><span className="supplier-kicker">{index === 0 ? 'HIGHEST RANKED' : 'MATCHED SUPPLIER'}</span><h3>{supplier.companyName || supplier.name}</h3><p>{supplier.name && supplier.companyName ? supplier.name : supplier.industry}</p></div></div><div className="score-circle" style={{ '--score': `${score}%` }}><div><strong>{score}</strong><span>score</span></div></div></div>
    <div className="supplier-tags"><span className="industry-tag">{supplier.industry}</span>{(supplier.materials || []).slice(0, 2).map(material => <span className="neutral-tag" key={material}>{material}</span>)}{supplier.meetsPreferredQuality && <span className="preferred-tag"><Icon name="check" size={12}/> Preferred quality</span>}</div>
    <div className="supplier-key-metrics"><div><span className="key-metric-icon price-icon"><Icon name="chart" size={16}/></span><span className="key-label">PRICE / UNIT</span><strong>₹{Number(supplier.pricePerUnit).toLocaleString('en-IN')}</strong><small>Est. total ₹{cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</small></div><div><span className="key-metric-icon quality-icon"><Icon name="star" size={16}/></span><span className="key-label">QUALITY</span><strong>{quality}<small className="inline-small"> / 10</small></strong><small>{rating.toFixed(1)} / 5 supplier rating</small></div><div><span className="key-metric-icon delivery-icon"><Icon name="clock" size={16}/></span><span className="key-label">DELIVERY</span><strong>{supplier.deliveryDays}<small className="inline-small"> days</small></strong><small>{Number(supplier.availableQuantity).toLocaleString('en-IN')} units available</small></div></div>
    <div className="supplier-location-row"><Icon name="pin" size={15}/><span>{supplier.location || 'Location not listed'}</span><span className="cost-check"><Icon name="check" size={13}/> Within unit-price cap</span></div>
    <details className="score-details"><summary>View score breakdown <span>+</span></summary><div className="score-breakdown-grid"><ScoreItem label="Price" value={breakdown.price}/><ScoreItem label="Quality" value={breakdown.quality}/><ScoreItem label="Delivery" value={breakdown.delivery}/><ScoreItem label="Rating" value={breakdown.rating}/></div></details>
  </article>;
}

function ScoreItem({ label, value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="score-item"><div><span>{label}</span><strong>{safeValue}</strong></div><div className="score-track"><span style={{ width: `${safeValue}%` }}/></div></div>;
}

function SupplierDirectory({ token, refreshKey = 0 }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest('/api/suppliers').then(data => {
      if (active) { setSuppliers(data.suppliers || []); setError(''); }
    }).catch(requestError => { if (active) setError(requestError.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  if (loading) return <div className="catalogue-placeholder"><span className="spinner spinner-dark"/> Loading supplier catalogue…</div>;
  if (error) return <div className="alert alert-error"><Icon name="alert" size={17}/><span>{error}</span></div>;
  if (!suppliers.length) return <div className="results-placeholder"><div className="placeholder-icon"><Icon name="package" size={22}/></div><div><strong>No supplier listings yet</strong><p>Add the first supplier offer or run the seed script in the backend folder.</p></div></div>;

  return <div className="catalogue-grid">{suppliers.map(supplier => <article className="catalogue-card" key={supplier._id}><div className="catalogue-card-head"><div className="supplier-monogram">{(supplier.companyName || 'S')[0].toUpperCase()}</div><span className="active-pill"><span/> Active</span></div><div className="catalogue-category">{supplier.industry}</div><h3>{supplier.companyName}</h3><p className="catalogue-contact">{supplier.name}</p><div className="catalogue-materials">{(supplier.materials || []).map(material => <span key={material}>{material}</span>)}</div><div className="catalogue-facts"><div><span>Price / unit</span><strong>₹{Number(supplier.pricePerUnit).toLocaleString('en-IN')}</strong></div><div><span>Quality</span><strong>{supplier.qualityScore}/10</strong></div><div><span>Delivery</span><strong>{supplier.deliveryDays} days</strong></div></div><div className="catalogue-location"><Icon name="pin" size={14}/>{supplier.location} <span>·</span> Rating {Number(supplier.rating || 0).toFixed(1)}/5</div></article>)}</div>;
}

function SupplierDashboard({ token, user, onNavigate }) {
  const [form, setForm] = useState({ ...initialSupplierOffer, name: user?.name || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [catalogueCount, setCatalogueCount] = useState('—');

  useEffect(() => {
    apiRequest('/api/suppliers').then(data => setCatalogueCount(Number.isFinite(data.count) ? data.count : (data.suppliers || []).length)).catch(() => setCatalogueCount('—'));
  }, [refreshKey]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  async function publishOffer(event) {
    event.preventDefault();
    setError(''); setSuccess(''); setBusy(true);
    const materials = form.materials.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
    const body = {
      name: form.name.trim(), companyName: form.companyName.trim(), industry: form.industry,
      materials, pricePerUnit: Number(form.pricePerUnit), qualityScore: Number(form.qualityScore),
      deliveryDays: Number(form.deliveryDays), rating: Number(form.rating),
      availableQuantity: Number(form.availableQuantity), location: form.location.trim()
    };
    if (!body.name || !body.companyName || !materials.length || !body.location || ![body.pricePerUnit, body.qualityScore, body.deliveryDays, body.rating, body.availableQuantity].every(Number.isFinite) || body.pricePerUnit < 0 || body.qualityScore < 0 || body.qualityScore > 10 || body.deliveryDays < 1 || body.rating < 0 || body.rating > 5 || body.availableQuantity < 0) {
      setError('Please complete all required fields and check the price, quality, rating and quantity ranges.'); setBusy(false); return;
    }
    try {
      const response = await apiRequest('/api/suppliers', { method: 'POST', token, body });
      setSuccess(response.message || 'Supplier listing created successfully.');
      setRefreshKey(value => value + 1);
    } catch (requestError) {
      setError(requestError.message || 'Could not publish the supplier listing.');
    } finally { setBusy(false); }
  }

  return <div className="page-content">
    <PageHeading eyebrow="SUPPLIER WORKSPACE" title={`Welcome, ${(user?.name || 'Supplier').split(' ')[0]}.`} description="Publish a catalogue listing so vendors can discover it through the matching API." action={<span className="demo-status-pill"><span/> DEMO ENVIRONMENT</span>} />
    <div className="metric-grid"><MetricCard icon="package" eyebrow="ACTIVE CATALOGUE" value={catalogueCount} caption="Public supplier listings" tone="metric-blue"/><MetricCard icon="star" eyebrow="QUALITY SIGNAL" value="0–10" caption="Quality score accepted by API" tone="metric-green"/><MetricCard icon="chart" eyebrow="MATCHING" value="Rule-based" caption="Price · Quality · Delivery · Rating"/></div>
    <section className="work-section">
      <div className="section-title-row"><div><div className="section-eyebrow">01 / SUPPLIER LISTING</div><h2>Publish your offering</h2><p>This form calls the connected <code>POST /api/suppliers</code> endpoint.</p></div><div className="section-step">SUPPLIER <span>/</span> PROFILE</div></div>
      <form className="requirement-form supplier-form" onSubmit={publishOffer}>
        <div className="form-grid-two"><Field label="Contact name"><TextInput value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Your name"/></Field><Field label="Company name"><TextInput value={form.companyName} onChange={e => update('companyName', e.target.value)} required placeholder="Company / business name"/></Field></div>
        <div className="form-grid-two"><Field label="Industry"><SelectInput value={form.industry} onChange={e => update('industry', e.target.value)}>{INDUSTRIES.map(industry => <option key={industry}>{industry}</option>)}</SelectInput></Field><Field label="Materials / products" hint="Comma-separated, lowercase tags are recommended."><TextInput value={form.materials} onChange={e => update('materials', e.target.value)} required placeholder="cotton, cotton fabric"/></Field></div>
        <div className="form-grid-three"><Field label="Price per unit"><div className="input-with-prefix"><span>₹</span><TextInput type="number" min="0" step="any" value={form.pricePerUnit} onChange={e => update('pricePerUnit', e.target.value)} required/></div></Field><Field label="Quality score"><div className="input-with-suffix"><TextInput type="number" min="0" max="10" step="0.5" value={form.qualityScore} onChange={e => update('qualityScore', e.target.value)} required/><span>/ 10</span></div></Field><Field label="Supplier rating"><div className="input-with-suffix"><TextInput type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => update('rating', e.target.value)} required/><span>/ 5</span></div></Field></div>
        <div className="form-grid-three"><Field label="Delivery time"><div className="input-with-suffix"><TextInput type="number" min="1" step="1" value={form.deliveryDays} onChange={e => update('deliveryDays', e.target.value)} required/><span>days</span></div></Field><Field label="Available quantity"><TextInput type="number" min="0" step="any" value={form.availableQuantity} onChange={e => update('availableQuantity', e.target.value)} required/></Field><Field label="Location"><div className="input-with-prefix"><span className="prefix-icon"><Icon name="pin" size={16}/></span><TextInput value={form.location} onChange={e => update('location', e.target.value)} required placeholder="e.g. Jaipur"/></div></Field></div>
        {error && <div className="alert alert-error"><Icon name="alert" size={17}/><span>{error}</span></div>}{success && <div className="alert alert-success"><Icon name="check" size={17}/><span>{success}</span></div>}
        <div className="submit-row"><div className="form-footnote"><Icon name="shield" size={16}/><span>The backend validates and stores this public supplier listing.</span></div><button type="submit" disabled={busy} className="btn btn-primary">{busy ? <><span className="spinner"/> Publishing…</> : <>Publish listing <Icon name="arrow" size={17}/></>}</button></div>
      </form>
    </section>
    <section className="work-section directory-section"><div className="section-title-row"><div><div className="section-eyebrow">02 / CATALOGUE</div><h2>Supplier directory</h2><p>Listings returned by the backend API. Your newly published listing appears here.</p></div><button className="btn btn-secondary btn-small" onClick={() => setRefreshKey(value => value + 1)}>Refresh directory</button></div><SupplierDirectory token={token} refreshKey={refreshKey}/></section>
  </div>;
}

function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [health, setHealth] = useState('checking');
  const [activeSection, setActiveSection] = useState('overview');
  const [catalogueKey, setCatalogueKey] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest('/api/health').then(() => { if (active) setHealth('online'); }).catch(() => { if (active) setHealth('offline'); });
    const token = localStorage.getItem('venora_token');
    if (!token) { setCheckingSession(false); return () => { active = false; }; }
    apiRequest('/api/auth/me', { token }).then(response => {
      if (!active) return;
      const nextSession = { token, user: response.user };
      setSession(nextSession);
      localStorage.setItem('venora_user', JSON.stringify(response.user));
    }).catch(() => {
      localStorage.removeItem('venora_token');
      localStorage.removeItem('venora_user');
    }).finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, []);

  function authenticate(response) {
    const nextSession = { token: response.token, user: response.user };
    localStorage.setItem('venora_token', response.token);
    localStorage.setItem('venora_user', JSON.stringify(response.user));
    setSession(nextSession);
    setActiveSection('overview');
  }

  function logout() {
    localStorage.removeItem('venora_token');
    localStorage.removeItem('venora_user');
    setSession(null);
    setActiveSection('overview');
  }

  function navigate(section) {
    setActiveSection(section);
    if (section === 'matching') {
      setTimeout(() => document.getElementById('matching-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    if (section === 'catalogue') setCatalogueKey(value => value + 1);
  }

  if (checkingSession) return <div className="app-loading"><div className="loading-brand"><Brand compact/></div><span className="spinner spinner-dark"/><p>Restoring your VENORA workspace…</p></div>;
  if (!session) return <AuthScreen onAuthenticated={authenticate}/>;

  return <div className="app-frame"><AppHeader user={session.user} health={health} onLogout={logout}/><div className="app-body"><Sidebar role={session.user.role} active={activeSection} onNavigate={navigate} user={session.user}/><main className="workspace-main">{session.user.role === 'supplier'
    ? activeSection === 'catalogue' ? <div className="page-content"><PageHeading eyebrow="SUPPLIER DIRECTORY" title="Supplier catalogue" description="Explore active catalogue listings available to the VENORA prototype."/><SupplierDirectory token={session.token} refreshKey={catalogueKey}/></div> : <SupplierDashboard token={session.token} user={session.user} onNavigate={navigate}/>
    : activeSection === 'catalogue' ? <div className="page-content"><PageHeading eyebrow="SUPPLIER DIRECTORY" title="Supplier catalogue" description="Browse active supplier listings available to the connected backend."/><SupplierDirectory token={session.token} refreshKey={catalogueKey}/></div> : <VendorDashboard token={session.token} user={session.user} onNavigate={navigate}/>}</main></div></div>;
}

export default App;
