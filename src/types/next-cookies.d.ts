import 'next/headers';

declare module 'next/headers' {
  function cookies(): {
    get: (name: string) => { name: string; value: string } | undefined;
    getAll: () => Array<{ name: string; value: string }>;
    set: (cookie: { name: string; value: string; [key: string]: any }) => void;
    delete: (name: string) => void;
  };
} 