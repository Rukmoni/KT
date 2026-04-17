import { createContext, useContext, useState } from 'react';

export type DataMode = 'sample' | 'live';

interface DataModeContextValue {
  mode: DataMode;
  setMode: (m: DataMode) => void;
}

const DataModeContext = createContext<DataModeContextValue>({
  mode: 'sample',
  setMode: () => {},
});

export const DataModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<DataMode>('sample');
  return (
    <DataModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => useContext(DataModeContext);
