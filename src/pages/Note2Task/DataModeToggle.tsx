import { Wifi, FlaskConical } from 'lucide-react';
import { useDataMode } from './DataModeContext';
import type { DataMode } from './DataModeContext';

interface DataModeToggleProps {
  className?: string;
}

export const DataModeToggle = ({ className }: DataModeToggleProps) => {
  const { mode, setMode } = useDataMode();

  return (
    <div className={`dmt-root${className ? ` ${className}` : ''}`}>
      <ModeBtn id="sample" active={mode === 'sample'} onClick={() => setMode('sample')}>
        <FlaskConical size={12} />
        Sample
      </ModeBtn>
      <ModeBtn id="live" active={mode === 'live'} onClick={() => setMode('live')}>
        <Wifi size={12} />
        Live
        {mode === 'live' && <span className="dmt-live-dot" />}
      </ModeBtn>
    </div>
  );
};

const ModeBtn = ({
  id,
  active,
  onClick,
  children,
}: {
  id: DataMode;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className={`dmt-btn dmt-btn--${id}${active ? ' dmt-btn--active' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);
