'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/style.css';

import { cn } from '@/lib/utils';
import { Toolbar } from './Toolbar';

interface EditorProps {
  editor: BlockNoteEditor | null;
  className?: string;
}

export function Editor({ editor, className }: EditorProps) {
  const { theme: applicationTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !editor) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <BlockNoteView
        editor={editor}
        theme={applicationTheme === 'dark' ? 'dark' : 'light'}
      >
        <Toolbar editor={editor} className="px-2" />
      </BlockNoteView>
    </div>
  );
}