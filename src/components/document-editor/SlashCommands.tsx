'use client';

import { BlockNoteEditor } from '@blocknote/core';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image,
  Table,
  Code,
  Quote,
  Minus,
  CheckSquare,
  AlertCircle,
  Lightbulb,
  Target,
} from 'lucide-react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface SlashCommandsProps {
  editor: BlockNoteEditor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SlashCommands({ editor, open, onOpenChange }: SlashCommandsProps) {
  if (!editor) {
    return null;
  }

  const commands = [
    {
      name: 'Heading 1',
      icon: Heading1,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'heading',
          props: { level: 1 },
        });
      },
    },
    {
      name: 'Heading 2',
      icon: Heading2,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'heading',
          props: { level: 2 },
        });
      },
    },
    {
      name: 'Heading 3',
      icon: Heading3,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'heading',
          props: { level: 3 },
        });
      },
    },
    {
      name: 'Bullet List',
      icon: List,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'bulletListItem',
        });
      },
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'numberedListItem',
        });
      },
    },
    {
      name: 'Image',
      icon: Image,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'image',
          props: {
            url: 'https://via.placeholder.com/800x400',
            caption: 'Image caption',
          },
        });
      },
    },
    {
      name: 'Code Block',
      icon: Code,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'codeBlock',
        });
      },
    },
    {
      name: 'Quote',
      icon: Quote,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'paragraph',
              props: { 
                textAlignment: 'left',
                backgroundColor: 'gray',
                textColor: 'default'
              },
              content: [
                {
                  type: 'text',
                  text: '',
                  styles: { italic: true }
                }
              ]
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
    {
      name: 'Divider',
      icon: Minus,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'paragraph',
              props: { textAlignment: 'center' },
              content: [{ type: 'text', text: '---', styles: {} }],
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
    {
      name: 'To-do List',
      icon: CheckSquare,
      action: () => {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: 'checkListItem',
        });
      },
    },
    {
      name: 'Table',
      icon: Table,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'table',
              content: {
                type: 'tableContent',
                rows: [
                  {
                    cells: [
                      [{ type: 'text', text: 'Header 1', styles: { bold: true } }],
                      [{ type: 'text', text: 'Header 2', styles: { bold: true } }],
                      [{ type: 'text', text: 'Header 3', styles: { bold: true } }],
                    ],
                  },
                  {
                    cells: [
                      [{ type: 'text', text: 'Cell 1', styles: {} }],
                      [{ type: 'text', text: 'Cell 2', styles: {} }],
                      [{ type: 'text', text: 'Cell 3', styles: {} }],
                    ],
                  },
                ],
              },
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
    {
      name: 'Callout - Info',
      icon: AlertCircle,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'paragraph',
              props: { 
                textAlignment: 'left',
                backgroundColor: 'blue',
                textColor: 'blue'
              },
              content: [
                {
                  type: 'text',
                  text: '💡 ',
                  styles: {}
                },
                {
                  type: 'text',
                  text: 'This is an info callout.',
                  styles: {}
                }
              ]
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
    {
      name: 'Callout - Warning',
      icon: Target,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'paragraph',
              props: { 
                textAlignment: 'left',
                backgroundColor: 'yellow',
                textColor: 'yellow'
              },
              content: [
                {
                  type: 'text',
                  text: '⚠️ ',
                  styles: {}
                },
                {
                  type: 'text',
                  text: 'This is a warning callout.',
                  styles: {}
                }
              ]
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
    {
      name: 'Callout - Success',
      icon: Lightbulb,
      action: () => {
        editor.insertBlocks(
          [
            {
              type: 'paragraph',
              props: { 
                textAlignment: 'left',
                backgroundColor: 'green',
                textColor: 'green'
              },
              content: [
                {
                  type: 'text',
                  text: '✅ ',
                  styles: {}
                },
                {
                  type: 'text',
                  text: 'This is a success callout.',
                  styles: {}
                }
              ]
            },
          ],
          editor.getTextCursorPosition().block,
          'after'
        );
      },
    },
  ];

  const runCommand = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Blocks">
            {commands.map((command) => (
              <CommandItem
                key={command.name}
                onSelect={() => runCommand(command.action)}
              >
                <command.icon className="mr-2 h-4 w-4" />
                {command.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
} 