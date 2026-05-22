import { useHermesStore } from '../store/useHermesStore';
import { useState, useEffect } from 'react';
import { X, Moon, CheckCircle2, Circle, Loader2, Upload, Save } from 'lucide-react';

const STORAGE_KEY = 'hermes_agent_data';

const INPUT = "w-full bg-[#0d1117] border border-white/10 text-[#e2e8f0] rounded-none px-3 py-2 text-sm font-mono outline-none focus:border-[#22d3ee]/60 transition-colors placeholder:text-white/20";
const LABEL = "block text-[9px] font-semibold tracking-[0.14em] uppercase text-[#64748b] mb-1.5";
const SECTION = "border-t border-white/5 pt-5 mt-5";

function Field({ label, children }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'done')        return <span className="text-[10px] font-mono text-[#22d3ee] border border-[#22d3ee]/30 px-2 py-0.5">DONE</span>;
  if (status === 'in-progress') return <span className="text-[10px] font-mono text-[#fbbf24] border border-[#fbbf24]/30 px-2 py-0.5">IN PROGRESS</span>;
  return                               <span className="text-[10px] font-mono text-white/20 border border-white/10 px-2 py-0.5">TODO</span>;
}

export function AdminTrigger() {
  const [open, setOpen] = useState(false);
  const { hermesAgent, setHermesAgent } = useHermesStore();
  const [form, setForm] = useState({ ...hermesAgent });
  const [saved, setSaved] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHermesAgent(parsed);
        setForm(parsed);
      }
    } catch {}
  }, []);

  // Sync form when store changes externally
  useEffect(() => {
    setForm({ ...hermesAgent });
  }, [open]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const cycleTask = (id) => {
    const order = ['todo', 'in-progress', 'done'];
    setForm(f => ({
      ...f,
      tasks: f.tasks.map(t => t.id === id
        ? { ...t, status: order[(order.indexOf(t.status) + 1) % order.length] }
        : t
      )
    }));
  };

  const handleImage = (key, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    set(key, url);
  };

  const save = () => {
    setHermesAgent(form);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 border border-white/10 bg-[#0d1117]/95 px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white/50 hover:border-[#22d3ee]/40 hover:text-[#22d3ee] transition-all backdrop-blur font-mono"
    >
      <Moon className="w-3 h-3" />
      Admin
    </button>
  );

  return (
    <div className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-start justify-end">
      <div className="h-full w-full max-w-sm bg-[#0a0e14] border-l border-white/5 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div>
            <div className="text-[9px] tracking-[0.16em] uppercase text-[#22d3ee]/70 font-mono mb-0.5">/ HERMES AGENT</div>
            <div className="text-sm font-semibold text-white tracking-tight">Control Panel</div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Identity */}
          <Field label="Title">
            <input className={INPUT} value={form.title || ''} onChange={e => set('title', e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea className={INPUT + " resize-none h-16"} value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </Field>

          <div className={SECTION}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Current Stage">
                <input className={INPUT} value={form.currentStage || ''} onChange={e => set('currentStage', e.target.value)} />
              </Field>
              <Field label="Next Milestone">
                <input className={INPUT} value={form.nextMilestone || ''} onChange={e => set('nextMilestone', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Progress */}
          <div className={SECTION}>
            <div className="flex items-center justify-between mb-2">
              <span className={LABEL} style={{marginBottom:0}}>Progress</span>
              <span className="text-[#22d3ee] text-sm font-mono">{form.progress}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={form.progress}
              onChange={e => set('progress', +e.target.value)}
              className="w-full accent-[#22d3ee] cursor-pointer"
            />
            <div className="w-full bg-white/5 h-0.5 mt-1 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#fbbf24] transition-all" style={{ width: `${form.progress}%` }} />
            </div>
          </div>

          {/* Previews */}
          <div className={SECTION}>
            <div className="text-[9px] tracking-[0.14em] uppercase text-[#64748b] font-mono mb-3">Preview Assets</div>
            {[
              { label: 'Interface Preview', key: 'interfacePreview' },
              { label: 'User-Flow Diagram', key: 'userFlowDiagram' },
              { label: 'Layout Prototype', key: 'layoutPrototype' },
            ].map(({ label, key }) => (
              <div key={key} className="mb-3">
                <label className={LABEL}>{label}</label>
                <label className="flex items-center gap-2 border border-dashed border-white/10 px-3 py-2 cursor-pointer hover:border-[#22d3ee]/40 transition-colors group">
                  <Upload className="w-3 h-3 text-white/20 group-hover:text-[#22d3ee]/60 transition-colors" />
                  <span className="text-[11px] font-mono text-white/20 group-hover:text-white/40 transition-colors">
                    {form[key] ? '✓ uploaded' : 'choose file'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImage(key, e.target.files?.[0])} />
                </label>
                {form[key] && (
                  <img src={form[key]} alt={label} className="mt-1.5 w-full h-20 object-cover object-top border border-white/5" />
                )}
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className={SECTION}>
            <div className="text-[9px] tracking-[0.14em] uppercase text-[#64748b] font-mono mb-3">Tasks — click to cycle status</div>
            <div className="border border-white/5">
              {form.tasks?.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => cycleTask(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/3 ${i < form.tasks.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <span className="flex-shrink-0 text-white/30">
                    {t.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22d3ee]" /> :
                     t.status === 'in-progress' ? <Loader2 className="w-3.5 h-3.5 text-[#fbbf24] animate-spin" /> :
                     <Circle className="w-3.5 h-3.5" />}
                  </span>
                  <span className={`flex-1 text-[11px] font-mono ${t.status === 'done' ? 'text-white/30 line-through' : 'text-white/70'}`}>
                    {t.description}
                  </span>
                  <StatusBadge status={t.status} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={save}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-[11px] tracking-[0.1em] uppercase font-mono transition-all ${
              saved
                ? 'bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee]'
                : 'bg-[#22d3ee]/5 border border-[#22d3ee]/20 text-white/60 hover:bg-[#22d3ee]/10 hover:border-[#22d3ee]/40 hover:text-[#22d3ee]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
