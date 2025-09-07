'use client';

import { BlockNoteEditor } from '@blocknote/core';
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  TextAlignButton,
  NestBlockButton,
  UnnestBlockButton,
} from '@blocknote/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Subscript, 
  Superscript, 
  Highlighter,
  Undo,
  Redo,
  MoreHorizontal
} from 'lucide-react';

interface ToolbarProps {
  editor: BlockNoteEditor | null;
  className?: string;
}

export function Toolbar({ editor, className }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const toggleSubscript = () => {
    const selection = editor.getTextCursorPosition();
    const currentStyles = editor.getActiveStyles();
    editor.toggleStyles({ subscript: !currentStyles.subscript });
  };

  const toggleSuperscript = () => {
    const selection = editor.getTextCursorPosition();
    const currentStyles = editor.getActiveStyles();
    editor.toggleStyles({ superscript: !currentStyles.superscript });
  };

  const toggleHighlight = () => {
    const selection = editor.getTextCursorPosition();
    const currentStyles = editor.getActiveStyles();
    editor.toggleStyles({ backgroundColor: currentStyles.backgroundColor ? undefined : 'yellow' });
  };

  const handleUndo = () => {
    if (editor.canUndo()) {
      editor.undo();
    }
  };

  const handleRedo = () => {
    if (editor.canRedo()) {
      editor.redo();
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-1 p-2 border-b bg-background/50', className)}>
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            {/* Block type selection */}
            <BlockTypeSelect key="blockTypeSelect" />
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Basic text formatting */}
            <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
            <BasicTextStyleButton basicTextStyle="italic" key="italicStyleButton" />
            <BasicTextStyleButton basicTextStyle="underline" key="underlineStyleButton" />
            <BasicTextStyleButton basicTextStyle="strike" key="strikeStyleButton" />
            <BasicTextStyleButton basicTextStyle="code" key="codeStyleButton" />
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Advanced text formatting */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSubscript}
              className="h-8 w-8 p-0"
              title="Subscript"
            >
              <Subscript className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSuperscript}
              className="h-8 w-8 p-0"
              title="Superscript"
            >
              <Superscript className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleHighlight}
              className="h-8 w-8 p-0"
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Text alignment */}
            <TextAlignButton textAlignment="left" key="textAlignLeftButton" />
            <TextAlignButton textAlignment="center" key="textAlignCenterButton" />
            <TextAlignButton textAlignment="right" key="textAlignRightButton" />
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Indentation */}
            <NestBlockButton key="nestBlockButton" />
            <UnnestBlockButton key="unnestBlockButton" />
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Color and links */}
            <ColorStyleButton key="colorStyleButton" />
            <CreateLinkButton key="createLinkButton" />
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              className="h-8 w-8 p-0"
              title="Undo"
              disabled={!editor.canUndo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              className="h-8 w-8 p-0"
              title="Redo"
              disabled={!editor.canRedo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </FormattingToolbar>
        )}
      />
    </div>
  );
} 