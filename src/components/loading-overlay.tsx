import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Icon } from '@iconify/react';

interface LoadingOverlayContext {
  isLoading: boolean;
  message?: string;
}

const DEFAULT: LoadingOverlayContext = { isLoading: false };

const LoadingOverlayContext = createContext<[LoadingOverlayContext, Dispatch<SetStateAction<LoadingOverlayContext>>]>([
  DEFAULT,
  () => { },
]);

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const state = useState(DEFAULT);
  return (
    <LoadingOverlayContext.Provider value={state}>
      {children}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const [, setState] = useContext(LoadingOverlayContext);
  const loading = async <T,>(promise: Promise<T>, message?: string) => {
    setState({ isLoading: true, message });
    return promise.finally(() => setState(DEFAULT));
  };

  return loading;
};

export default function LoadingOverlay() {
  const [{ isLoading, message }] = useContext(LoadingOverlayContext);

  return isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center gap-2 p-4">
        <Icon icon="svg-spinners:ring-resize" className="size-10 text-white" />
        {<p className="text-white">{message || 'Loading...'}</p>}
      </div>
    </div>
  ) : null;
}