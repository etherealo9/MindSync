'use client';

import { useEffect, useState } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';

import { cn } from '@/lib/utils';
import { SlashCommands } from './SlashCommands';
import { useTheme } from 'next-themes';

interface DocumentEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (content: string) => void;
  className?: string;
  minHeight?: string;
  toolbar?: boolean;
  compact?: boolean;
}

export function DocumentEditor({ 
  placeholder = "Type '/' for commands...", 
  value = "",
  onChange,
  className,
  minHeight = "150px",
  toolbar = false,
  compact = true
}: DocumentEditorProps) {
  const { theme: applicationTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initialContent = value ? 
      [{ type: 'paragraph', content: [{ type: 'text', text: value, styles: {} }] }] : 
      [{ type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] }];

    const newEditor = BlockNoteEditor.create({
      initialContent,
      placeholder
    });

    // Listen for content changes
    newEditor.onChange(() => {
      if (onChange) {
        const plainText = newEditor.topLevelBlocks
          .map(block => {
            if (block.type === 'paragraph' && block.content) {
              return block.content
                .map((item: any) => item.text || '')
                .join('');
            }
            return '';
          })
          .join('\n')
          .trim();
        
        onChange(plainText);
      }
    });

    setEditor(newEditor);

    return () => {
      newEditor.destroy();
    };
  }, [mounted, placeholder, onChange]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !slashMenuOpen) {
        event.preventDefault();
        setSlashMenuOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, slashMenuOpen]);

  if (!mounted || !editor) {
    return (
      <div 
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2', 
          className
        )}
        style={{ minHeight: minHeight }}
      >
        <div className="text-sm text-muted-foreground">{placeholder}</div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div 
        className={cn(
          'rounded-md border border-input bg-background overflow-hidden',
          compact && 'text-sm'
        )}
        style={{ minHeight }}
      >
        <BlockNoteView
          editor={editor}
          theme={applicationTheme === 'dark' ? 'dark' : 'light'}
          className={cn(
            'block-note-editor',
            compact && 'compact-editor'
          )}
        />
      </div>
      
      <SlashCommands
        editor={editor}
        open={slashMenuOpen}
        onOpenChange={setSlashMenuOpen}
      />
      
      <style jsx global>{`
        .compact-editor .bn-editor {
          padding: 12px;
        }
        
        .compact-editor .bn-block-content {
          min-height: 1.5em;
        }
        
        .compact-editor .bn-inline-content {
          font-size: 14px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
