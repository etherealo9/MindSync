'use client';

import { BlockNoteEditor } from '@blocknote/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { templates } from './templates';
import { FileText, Plus } from 'lucide-react';

interface TemplateSelectorProps {
  editor: BlockNoteEditor | null;
}

export function TemplateSelector({ editor }: TemplateSelectorProps) {
  const handleTemplateSelect = (templateId: string) => {
    if (!editor) return;

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    editor.replaceBlocks(editor.topLevelBlocks, template.content);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to start your document
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="flex items-center justify-start gap-2 px-4 py-6"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <FileText className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-muted-foreground">
                  {template.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 