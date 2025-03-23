# MindSync

MindSync is a mobile-first personal productivity web application that combines task management, journaling, and reflection capabilities with AI assistance.

## Features

- **Task Management**: Create, organize, and prioritize tasks with due dates and categories
- **Journaling**: Document your thoughts, experiences, and ideas with mood tracking
- **Reflection**: Review your progress and set intentions for personal growth
- **Notifications**: Real-time notifications for tasks, reminders, and system updates
- **AI Assistant**: Get help with productivity tips, journaling prompts, and task organization
- **Analytics**: Track your productivity metrics and personal growth journey
- **Google Calendar Integration**: Sync your tasks with your Google Calendar

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, ShadcnUI
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time subscriptions)
- **AI Integration**: OpenAI API
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/mindsync.git
   cd mindsync
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up the database schema
   ```
   # Install Supabase CLI
   npm install supabase --save-dev
   
   # Login to Supabase CLI
   npx supabase login
   
   # Link your project
   npx supabase link --project-ref YOUR_PROJECT_REF
   
   # Deploy the migrations
   npx supabase db push
   ```
   
   Alternatively, see `supabase/README.md` for manual SQL execution instructions.

5. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/src
  /app                   # Next.js app router structure
    /dashboard           # Dashboard-related pages
      /tasks             # Task management pages
      /journal           # Journaling pages
      /retrospect        # Reflection pages
      /assistant         # AI Assistant pages
      /analytics         # Analytics pages
      /profile           # User profile pages
      /settings          # Settings pages
  /components            # Reusable components
    /layout              # Layout components (Sidebar, Header)
    /notifications       # Notification components
    /ui                  # UI components from ShadcnUI
  /lib                   # Utility functions and libraries
    /notifications       # Notification context and providers
    /supabase            # Supabase client and database utilities
  /styles                # Global styles
/supabase
  /migrations            # Database migrations
```

## Deployment

The application is deployed on Netlify:

1. Push your changes to your repository
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Set up environment variables in Netlify dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Supabase](https://supabase.io/) - Open source Firebase alternative
- [OpenAI](https://openai.com/) - AI models and APIs
