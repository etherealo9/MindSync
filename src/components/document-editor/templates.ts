import { PartialBlock } from '@blocknote/core';

export interface Template {
  id: string;
  name: string;
  description: string;
  content: PartialBlock[];
}

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start with a clean slate',
    content: [],
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for taking meeting notes',
    content: [
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Meeting Notes', styles: {} }],
        props: { level: 1 },
      },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Date & Time', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Attendees', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Agenda', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Discussion Points', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Action Items', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
    ],
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Template for project planning',
    content: [
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Project Plan', styles: {} }],
        props: { level: 1 },
      },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Overview', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Goals & Objectives', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Timeline', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Resources', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
      {
        type: 'heading',
        content: [{ type: 'text', text: 'Budget', styles: {} }],
        props: { level: 2 },
      },
      { type: 'paragraph', content: [{ type: 'text', text: '', styles: {} }] },
    ],
  },
]; 