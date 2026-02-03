import { createContext, useContext, useState, type ReactNode } from 'react';

interface FormDialogContextType {
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
}

const FormDialogContext = createContext<FormDialogContextType | undefined>(undefined);

export function FormDialogProvider({ children }: { children: ReactNode }) {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <FormDialogContext.Provider value={{ formOpen, setFormOpen }}>
      {children}
    </FormDialogContext.Provider>
  );
}

export function useFormDialog() {
  const ctx = useContext(FormDialogContext);
  if (ctx === undefined) {
    throw new Error('useFormDialog must be used within a FormDialogProvider');
  }
  return ctx;
}

/** Safe hook for layout: returns default when outside provider (e.g. user routes). */
export function useFormDialogSafe() {
  const ctx = useContext(FormDialogContext);
  return ctx ?? { formOpen: false, setFormOpen: () => {} };
}
