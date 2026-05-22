import { useHermesStore } from '../store/useHermesStore';
import { useState } from 'react';
import { Moon, Sun, X } from 'lucide-react';

export function AdminTrigger() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const { hermesAgent, setHermesAgent } = useHermesStore();

  // Initialize form state from store
  const [form, setForm] = useState({ ...hermesAgent });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file' && files?.[0]
          ? URL.createObjectURL(files[0])
          : value,
    }));
  };

  const handleTaskToggle = (id) => {
    setForm(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      ),
    }));
  };

  const save = async () => {
    // Persist to Zustand store
    setHermesAgent(form);
    // Revoke blob URLs
    Object.values(form)
      .filter(v => typeof v === 'string' && v.startsWith('blob:'))
      .forEach(url => URL.revokeObjectURL(url));
    alert('Hermes Agent data saved!');
    setOpen(false);
  };

  return (
    <>
      {/* Floating admin button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-10 items-center gap-2 border border-line bg-surface/95 px-3 text-[10px] uppercase tracking-[0.14em] text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur hover:border-accent hover:text-accent sm:bottom-5 sm:right-5"
      >
        <Moon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Admin</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[900] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Hermes Agent Settings</h2>
              <div className="flex items-center gap-2">
                <label className="text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theme === 'light'}
                    onChange={e => setTheme(e.target.checked ? 'light' : 'dark')}
                    className="h-4 w-4 text-accent"
                  />
                  Light mode
                </label>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={e => { e.preventDefault(); save(); }}>
              {/* Text fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title || ''}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Stage</label>
                  <input
                    name="currentStage"
                    value={form.currentStage || ''}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Next Milestone</label>
                  <input
                    name="nextMilestone"
                    value={form.nextMilestone || ''}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Progress (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="text-right text-sm">{form.progress}%</div>
                </div>
              </div>

              {/* Image previews */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Interface Preview', key: 'interfacePreview' },
                  { label: 'User-Flow Diagram', key: 'userFlowDiagram' },
                  { label: 'Layout Prototype', key: 'layoutPrototype' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      name={key}
                      className="w-full"
                    />
                    {form[key] && (
                      <img
                        src={form[key]}
                        alt={label}
                        className="mt-2 max-w-xs rounded border"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Task list */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Tasks</h3>
                <div className="space-y-2">
                  {form.tasks.map((t) => (
                    <label key={t.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'done'}
                        onChange={() => handleTaskToggle(t.id)}
                        className="h-4 w-4 text-accent"
                      />
                      <span className="flex-1">{t.description}</span>
                      <span className="text-xs text-muted">
                        ({t.status === 'done' ? 'Done' : 'To-do'})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-foreground px-4 py-2 rounded hover:bg-amber-400"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}