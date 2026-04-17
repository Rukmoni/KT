import { useState } from 'react';
import { Brain, Table, FileText, Globe, Database, Play, Upload, CircleCheck as CheckCircle, Loader } from 'lucide-react';
import type { AiSourceStatus } from '../types';

interface AiSourceDef {
  id: string;
  source_type: string;
  label: string;
  description: string;
  status: AiSourceStatus;
  icon: React.ReactNode;
  iconBg: string;
}

const AI_SOURCES: AiSourceDef[] = [
  { id: '1', source_type: 'rag', label: 'RAG Settings', description: 'Retrieval-Augmented Generation configuration', status: 'active', icon: <Brain size={22} color="#8b5cf6" />, iconBg: 'rgba(139,92,246,0.15)' },
  { id: '2', source_type: 'excel', label: 'Excel Upload', description: 'Product catalogs and pricing sheets', status: 'active', icon: <Table size={22} color="#22c55e" />, iconBg: 'rgba(34,197,94,0.12)' },
  { id: '3', source_type: 'pdf', label: 'PDF Upload', description: 'Documentation and manuals', status: 'active', icon: <FileText size={22} color="#3B82F6" />, iconBg: 'rgba(59,130,246,0.12)' },
  { id: '4', source_type: 'website_crawl', label: 'Website Crawl', description: 'Scrape knowledge from websites', status: 'pending', icon: <Globe size={22} color="#f59e0b" />, iconBg: 'rgba(245,158,11,0.12)' },
  { id: '5', source_type: 'database', label: 'Database Connector', description: 'Connect to external databases', status: 'inactive', icon: <Database size={22} color="#64748B" />, iconBg: 'rgba(100,116,139,0.1)' },
];

type TestMap = Record<string, 'idle' | 'testing' | 'done'>;

export const AiConfigView = () => {
  const [selected, setSelected] = useState<AiSourceDef>(AI_SOURCES[0]);
  const [model, setModel] = useState('gpt-4-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [testStates, setTestStates] = useState<TestMap>({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles] = useState<string[]>(['product_catalog_Q4.xlsx', 'pricing_2024.xlsx']);
  const [pdfFiles] = useState<string[]>(['API_documentation.pdf', 'user_manual_v2.pdf', 'integration_guide.pdf']);

  const handleTest = async (id: string) => {
    setTestStates(prev => ({ ...prev, [id]: 'testing' }));
    await new Promise(r => setTimeout(r, 1200));
    setTestStates(prev => ({ ...prev, [id]: 'done' }));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="oh-page-title">AI & Data Configuration</h1>
          <p className="oh-page-sub">Configure AI knowledge sources and data inputs</p>
        </div>
        <button className="oh-train-btn">
          <Brain size={15} />
          Train AI Model
        </button>
      </div>

      <div className="oh-ai-grid">
        {AI_SOURCES.map(src => (
          <div
            key={src.id}
            className={`oh-ai-source-card${selected.id === src.id ? ' oh-ai-source-card--active' : ''}`}
            onClick={() => setSelected(src)}
          >
            <span className={`oh-ai-source-card__status oh-ai-source-card__status--${src.status}`}>
              {src.status}
            </span>
            <div className="oh-ai-source-card__icon" style={{ background: src.iconBg }}>
              {src.icon}
            </div>
            <h3 className="oh-ai-source-card__title">{src.label}</h3>
            <p className="oh-ai-source-card__desc">{src.description}</p>
            <button
              className="oh-ai-test-btn"
              onClick={e => { e.stopPropagation(); handleTest(src.id); }}
              disabled={testStates[src.id] === 'testing'}
            >
              {testStates[src.id] === 'testing' ? (
                <><Loader size={12} className="oh-spin" /> Testing…</>
              ) : testStates[src.id] === 'done' ? (
                <><CheckCircle size={12} /> Verified</>
              ) : (
                <><Play size={12} /> Test Source</>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="oh-ai-details-grid">
        <div className="oh-ai-detail-card">
          <div className="oh-ai-detail-card__title">
            <Brain size={16} color="#8b5cf6" />
            RAG Settings
            <span style={{ fontSize: 11, color: '#64748B', marginLeft: 'auto' }}>Retrieval-Augmented Generation</span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="oh-int-field-label">Model Selection</label>
            <select className="oh-select" value={model} onChange={e => setModel(e.target.value)}>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="oh-int-field-label">Temperature ({temperature})</label>
            <input
              type="range"
              className="oh-slider"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 4 }}>
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
          <div className="oh-int-grid">
            <div className="oh-int-field">
              <label className="oh-int-field-label">Max Tokens</label>
              <input className="oh-int-input" type="number" defaultValue={2048} />
            </div>
            <div className="oh-int-field">
              <label className="oh-int-field-label">Top K Results</label>
              <input className="oh-int-input" type="number" defaultValue={5} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="oh-int-field-label">Similarity Threshold</label>
            <input
              type="range"
              className="oh-slider"
              min={0.5}
              max={1}
              step={0.05}
              defaultValue={0.75}
            />
          </div>
          <button className="oh-int-btn oh-int-btn--primary" style={{ width: '100%' }}>Save RAG Settings</button>
        </div>

        <div className="oh-ai-detail-card">
          <div className="oh-ai-detail-card__title">
            <Upload size={16} color="#3B82F6" />
            Upload Files
            <span style={{ fontSize: 11, color: '#64748B', marginLeft: 'auto' }}>Excel, PDF, and other documents</span>
          </div>

          <div
            className="oh-drop-zone"
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}
            style={{ borderColor: dragOver ? 'rgba(59,130,246,0.6)' : undefined, marginBottom: 16 }}
          >
            <div className="oh-drop-zone__icon">
              <Upload size={28} />
            </div>
            <p className="oh-drop-zone__title">Drop files here or click to browse</p>
            <p className="oh-drop-zone__sub">Supports PDF, Excel, Word, CSV (Max 50MB)</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>EXCEL FILES ({uploadedFiles.length})</div>
            {uploadedFiles.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(34,197,94,0.05)', borderRadius: 8, marginBottom: 4, border: '1px solid rgba(34,197,94,0.1)' }}>
                <Table size={13} color="#22c55e" />
                <span style={{ fontSize: 12.5, color: '#CBD5E1', flex: 1 }}>{f}</span>
                <CheckCircle size={13} color="#22c55e" />
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>PDF FILES ({pdfFiles.length})</div>
            {pdfFiles.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(59,130,246,0.05)', borderRadius: 8, marginBottom: 4, border: '1px solid rgba(59,130,246,0.1)' }}>
                <FileText size={13} color="#3B82F6" />
                <span style={{ fontSize: 12.5, color: '#CBD5E1', flex: 1 }}>{f}</span>
                <CheckCircle size={13} color="#3B82F6" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="oh-card" style={{ marginTop: 20 }}>
        <div className="oh-ai-detail-card__title" style={{ marginBottom: 16 }}>
          <Globe size={16} color="#f59e0b" />
          Website Crawl Configuration
        </div>
        <div className="oh-int-grid">
          <div className="oh-int-field" style={{ gridColumn: '1 / -1' }}>
            <label className="oh-int-field-label">Target URLs (one per line)</label>
            <textarea className="oh-int-input" rows={3} defaultValue="https://kuvanta.tech" style={{ resize: 'vertical' }} />
          </div>
          <div className="oh-int-field">
            <label className="oh-int-field-label">Crawl Depth</label>
            <input className="oh-int-input" type="number" defaultValue={3} />
          </div>
          <div className="oh-int-field">
            <label className="oh-int-field-label">Refresh Schedule</label>
            <select className="oh-select" defaultValue="Weekly">
              <option>Weekly</option>
              <option>Daily</option>
              <option>Monthly</option>
              <option>Manual</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <button className="oh-int-btn oh-int-btn--primary">Save & Start Crawl</button>
          <button className="oh-int-btn oh-int-btn--ghost">Preview URLs</button>
        </div>
      </div>
    </>
  );
};
