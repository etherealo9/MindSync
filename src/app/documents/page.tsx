'use client';

import { useEffect, useState } from 'react';
import { Editor } from '@/components/document-editor/Editor';
import { SlashCommands } from '@/components/document-editor/SlashCommands';
import { TemplateSelector } from '@/components/document-editor/TemplateSelector';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Save, FileText, Download } from 'lucide-react';

export default function DocumentsPage() {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const { theme: applicationTheme } = useTheme();
  const [editor] = useState(() =>
    BlockNoteEditor.create({
      initialContent: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Start writing...',
              styles: {},
            },
          ],
        },
      ],
    })
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !slashMenuOpen) {
        event.preventDefault();
        setSlashMenuOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [slashMenuOpen]);

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !isAutoSaveEnabled) return;

    const autoSave = () => {
      const content = JSON.stringify(editor.topLevelBlocks);
      localStorage.setItem('document-autosave', content);
      localStorage.setItem('document-title', documentTitle);
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [editor, isAutoSaveEnabled, documentTitle]);

  const handleSave = () => {
    if (!editor) return;
    const content = JSON.stringify(editor.topLevelBlocks);
    localStorage.setItem('document-save', content);
    localStorage.setItem('document-title', documentTitle);
    // TODO: Implement server-side saving
  };

  const handleExport = () => {
    if (!editor) return;
    const content = JSON.stringify(editor.topLevelBlocks, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!editor) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b-2 border-black dark:border-white pb-4">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold uppercase">Documents</h2>
          <input 
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-medium bg-transparent border-none outline-none focus:ring-0 max-w-md"
            placeholder="Enter document title..."
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-sm px-2 py-1 font-medium">
            Press / for commands
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <TemplateSelector editor={editor} />
        </div>
      </div>
      <div className="rounded-lg border-2 bg-card shadow-sm">
        <div className="px-6 py-6 min-h-[500px]">
          <Editor editor={editor} />
        </div>
      </div>
      <SlashCommands
        editor={editor}
        open={slashMenuOpen}
        onOpenChange={setSlashMenuOpen}
      />
    </div>
  );
} 