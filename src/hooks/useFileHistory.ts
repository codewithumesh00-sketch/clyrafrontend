import { useState, useCallback } from 'react';

interface HistoryEntry {
  file: string;
  code: string;
  timestamp: number;
}

interface UseFileHistoryReturn {
  files: Record<string, string>;
  setFile: (filename: string, code: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentPosition: number;
}

export const useFileHistory = (
  initialFiles: Record<string, string>
): UseFileHistoryReturn => {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const maxHistory = 50;

  // ✅ SET FILE
  const setFile = useCallback((filename: string, code: string) => {
    setFiles((prev) => {
      const currentCode = prev[filename];

      if (currentCode === code) return prev;

      // Save to history
      setHistory((h) => {
        const newEntry: HistoryEntry = {
          file: filename,
          code: currentCode,
          timestamp: Date.now(),
        };

        const newHistory = [...h, newEntry];

        return newHistory.length > maxHistory
          ? newHistory.slice(-maxHistory)
          : newHistory;
      });

      // Clear redo stack
      setFuture([]);

      return {
        ...prev,
        [filename]: code,
      };
    });
  }, []);

  // ✅ UNDO
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const lastEntry = history[history.length - 1];

    setFiles((prevFiles) => {
      const currentCode = prevFiles[lastEntry.file];

      // Save current state to future
      setFuture((f) => [
        {
          file: lastEntry.file,
          code: currentCode,
          timestamp: Date.now(),
        },
        ...f,
      ]);

      return {
        ...prevFiles,
        [lastEntry.file]: lastEntry.code,
      };
    });

    setHistory((h) => h.slice(0, -1));
  }, [history]);

  // ✅ REDO
  const redo = useCallback(() => {
    if (future.length === 0) return;

    const nextEntry = future[0];

    setFiles((prevFiles) => {
      const currentCode = prevFiles[nextEntry.file];

      // Save current to history
      setHistory((h) => [
        ...h,
        {
          file: nextEntry.file,
          code: currentCode,
          timestamp: Date.now(),
        },
      ]);

      return {
        ...prevFiles,
        [nextEntry.file]: nextEntry.code,
      };
    });

    setFuture((f) => f.slice(1));
  }, [future]);

  return {
    files,
    setFile,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    historyLength: history.length,
    currentPosition: history.length,
  };
};