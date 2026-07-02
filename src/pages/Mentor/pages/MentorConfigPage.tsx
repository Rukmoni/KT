import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useMentorConfig } from '../hooks/useMentorConfig';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUBJECTS } from '../constants';
import type { MentorConfigData, KnowledgeFile } from '../types';
import type { SubjectCode } from '../types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MODEL_OPTIONS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
];

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items
      .map((item) => ('str' in item ? (item as { str: string }).str : ''))
      .join(' ') + '\n';
  }
  return text;
}

async function extractMdText(file: File): Promise<string> {
  return file.text();
}

// ─── Model Settings Section ──────────────────────────────────────────────────

function ModelSection({
  config,
  saving,
  onSave,
}: {
  config: MentorConfigData;
  saving: boolean;
  onSave: (updates: Partial<MentorConfigData>) => void;
}) {
  const [draft, setDraft] = useState({
    model_primary: config.model_primary,
    model_lite: config.model_lite,
    model_pro: config.model_pro,
    max_history_messages: config.max_history_messages,
  });

  useEffect(() => {
    setDraft({
      model_primary: config.model_primary,
      model_lite: config.model_lite,
      model_pro: config.model_pro,
      max_history_messages: config.max_history_messages,
    });
  }, [config]);

  return (
    <section className="bg-mentor-surface border border-mentor-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-mentor-navy mb-4">Model Configuration</h2>
      <div className="space-y-4">
        {(
          [
            { key: 'model_primary', label: 'Primary Model', hint: 'Teaching, tests, revision, PYQ' },
            { key: 'model_lite', label: 'Lite Model', hint: 'Flashcards, rapid-fire, navigation' },
            { key: 'model_pro', label: 'Pro Model', hint: 'Long-answer grading, research' },
          ] as { key: keyof typeof draft; label: string; hint: string }[]
        ).map(({ key, label, hint }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-mentor-muted mb-1">
              {label} <span className="text-mentor-muted font-normal">— {hint}</span>
            </label>
            <select
              value={draft[key] as string}
              onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
              className="w-full rounded-lg border border-mentor-border bg-mentor-cream px-3 py-2 text-sm text-mentor-text focus:outline-none focus:border-mentor-navy"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-mentor-muted mb-1">
            Context Window (messages sent to API)
          </label>
          <input
            type="number"
            min={4}
            max={60}
            value={draft.max_history_messages}
            onChange={(e) =>
              setDraft((d) => ({ ...d, max_history_messages: Number(e.target.value) }))
            }
            className="w-24 rounded-lg border border-mentor-border bg-mentor-cream px-3 py-2 text-sm text-mentor-text focus:outline-none focus:border-mentor-navy"
          />
          <p className="text-xs text-mentor-muted mt-1">
            Older messages are trimmed to reduce token costs.
          </p>
        </div>

        <button
          onClick={() => onSave(draft)}
          disabled={saving}
          className="px-4 py-2 bg-mentor-navy text-mentor-cream rounded-lg text-sm font-medium hover:bg-mentor-navy-light disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Model Settings'}
        </button>
      </div>
    </section>
  );
}

// ─── API Key Section ─────────────────────────────────────────────────────────

function ApiKeySection({
  config,
  saving,
  onSave,
}: {
  config: MentorConfigData;
  saving: boolean;
  onSave: (updates: Partial<MentorConfigData>) => void;
}) {
  const [key, setKey] = useState(config.api_key_override ?? '');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setKey(config.api_key_override ?? '');
  }, [config.api_key_override]);

  return (
    <section className="bg-mentor-surface border border-mentor-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-mentor-navy mb-1">API Key Override</h2>
      <p className="text-xs text-mentor-muted mb-4">
        If set, overrides the server-side <code className="bg-mentor-cream-dark px-1 rounded">GEMINI_API_KEY</code> secret.
      </p>
      <div className="flex gap-2">
        <input
          type={show ? 'text' : 'password'}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="AIza…"
          className="flex-1 rounded-lg border border-mentor-border bg-mentor-cream px-3 py-2 text-sm text-mentor-text focus:outline-none focus:border-mentor-navy font-mono"
        />
        <button
          onClick={() => setShow((v) => !v)}
          className="px-3 py-2 rounded-lg border border-mentor-border text-xs text-mentor-muted hover:border-mentor-navy transition-colors"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSave({ api_key_override: key.trim() || null })}
          disabled={saving}
          className="px-4 py-2 bg-mentor-navy text-mentor-cream rounded-lg text-sm font-medium hover:bg-mentor-navy-light disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Key'}
        </button>
        {config.api_key_override && (
          <button
            onClick={() => {
              setKey('');
              onSave({ api_key_override: null });
            }}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Knowledge Files Section ─────────────────────────────────────────────────

function KnowledgeSection() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCode>(SUBJECTS[0].code);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    const { data } = await supabase
      .from('mentor_knowledge')
      .select('id, file_key, source_filename, file_type, chunk_text, created_at')
      .order('created_at', { ascending: false });
    setFiles((data as KnowledgeFile[]) ?? []);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);

    try {
      let text = '';
      const isMd = file.name.endsWith('.md') || file.type === 'text/markdown';
      const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';

      if (isMd) {
        text = await extractMdText(file);
      } else if (isPdf) {
        text = await extractPdfText(file);
      } else {
        throw new Error('Only .md and .pdf files are supported');
      }

      if (!text.trim()) throw new Error('No text content found in file');

      const fileKey = `${selectedSubject}_${file.name.replace(/[^a-z0-9_.]/gi, '_')}`;
      const fileType = isMd ? 'md' : 'pdf';

      const { error } = await supabase.from('mentor_knowledge').upsert(
        {
          file_key: fileKey,
          chunk_text: text,
          file_type: fileType,
          source_filename: file.name,
        },
        { onConflict: 'file_key' }
      );

      if (error) throw new Error(error.message);
      await loadFiles();
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this knowledge file?')) return;
    await supabase.from('mentor_knowledge').delete().eq('id', id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const subjectFiles = SUBJECTS.reduce<Record<string, KnowledgeFile[]>>((acc, s) => {
    acc[s.code] = files.filter((f) => f.file_key.startsWith(s.code + '_'));
    return acc;
  }, {});
  const otherFiles = files.filter((f) => !SUBJECTS.some((s) => f.file_key.startsWith(s.code + '_')));

  return (
    <section className="bg-mentor-surface border border-mentor-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-mentor-navy mb-1">Knowledge Base</h2>
      <p className="text-xs text-mentor-muted mb-4">
        Upload <code className="bg-mentor-cream-dark px-1 rounded">.md</code> or{' '}
        <code className="bg-mentor-cream-dark px-1 rounded">.pdf</code> files. MD files are
        consulted first; PDFs as secondary. Re-uploading the same filename replaces it.
      </p>

      {/* Upload */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value as SubjectCode)}
          className="rounded-lg border border-mentor-border bg-mentor-cream px-3 py-2 text-sm text-mentor-text focus:outline-none focus:border-mentor-navy"
        >
          {SUBJECTS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>
        <label
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            uploading
              ? 'bg-mentor-cream-dark text-mentor-muted cursor-not-allowed'
              : 'bg-mentor-amber text-white hover:bg-amber-500'
          }`}
        >
          {uploading ? 'Processing…' : 'Upload File'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {uploadError}
        </p>
      )}

      {/* File List */}
      <div className="space-y-4">
        {SUBJECTS.map((s) => {
          const sFiles = subjectFiles[s.code];
          if (!sFiles?.length) return null;
          return (
            <div key={s.code}>
              <h3 className={`text-xs font-semibold ${s.color} mb-2`}>
                {s.icon} {s.name}
              </h3>
              <div className="space-y-1">
                {sFiles.map((f) => (
                  <FileRow key={f.id} file={f} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          );
        })}
        {otherFiles.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-mentor-muted mb-2">Other</h3>
            <div className="space-y-1">
              {otherFiles.map((f) => (
                <FileRow key={f.id} file={f} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
        {files.length === 0 && (
          <p className="text-xs text-mentor-muted text-center py-4">
            No files uploaded yet. Upload MD or PDF files to build the knowledge base.
          </p>
        )}
      </div>
    </section>
  );
}

function FileRow({
  file,
  onDelete,
}: {
  file: KnowledgeFile;
  onDelete: (id: string) => void;
}) {
  const wordCount = file.chunk_text.trim().split(/\s+/).length;
  const date = new Date(file.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const isMd = file.file_type === 'md';

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-mentor-cream hover:bg-mentor-cream-dark transition-colors group">
      <span className="text-sm">{isMd ? '📄' : '📕'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-mentor-text truncate">
          {file.source_filename ?? file.file_key}
        </p>
        <p className="text-xs text-mentor-muted">
          {wordCount.toLocaleString()} words · {date}
        </p>
      </div>
      <span
        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          isMd ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
        }`}
      >
        {isMd ? 'MD' : 'PDF'}
      </span>
      <button
        onClick={() => onDelete(file.id)}
        className="text-mentor-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xs"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MentorConfigPage() {
  const navigate = useNavigate();
  const { config, loading, saving, loadConfig, saveConfig } = useMentorConfig();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  async function handleSave(updates: Partial<MentorConfigData>) {
    const ok = await saveConfig(updates);
    setToast(ok ? 'Saved!' : 'Save failed');
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="min-h-screen bg-mentor-cream">
      <header className="bg-mentor-navy px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/mentor')}
          className="text-mentor-tan-light hover:text-mentor-cream transition-colors text-lg"
        >
          ←
        </button>
        <h1 className="text-mentor-cream font-semibold text-base">Mentor Configuration</h1>
        {toast && (
          <span className="ml-auto text-xs text-mentor-amber font-medium">{toast}</span>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <p className="text-sm text-mentor-muted text-center py-12">Loading config…</p>
        ) : (
          <>
            <ModelSection config={config} saving={saving} onSave={handleSave} />
            <ApiKeySection config={config} saving={saving} onSave={handleSave} />
            <KnowledgeSection />
          </>
        )}
      </div>
    </div>
  );
}
