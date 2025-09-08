MindSync 🧠

Your self-hosted, open-source productivity platform.
MindSync is a personal productivity application designed for developers who want full control. It's built to be self-hosted, giving you ownership of your data and the flexibility to extend the platform as you see fit. No vendor lock-in, just a tool that works for you.


-----

### Key Features

  * **Bring Your Own Key (BYOK)**: MindSync operates on a BYOK model for all AI services. This gives you full ownership and control over your data and API usage. Supabase is configured with Row Level Security (RLS) policies to ensure user data is private and owned by the user.
  * **Modular AI**: The AI assistant is built to be provider-agnostic. The codebase supports integrations with OpenAI, Groq, and Hugging Face, allowing for easy switching or adding new models.
  * **Self-Hostable Backend**: The application uses Supabase, an open-source Firebase alternative, for the database (PostgreSQL), authentication, and storage.
  * **Core Productivity Tools**: Manage tasks, write journal entries, and review your progress. The database schema includes tables for `tasks`, `journal_entries`, and `user_settings`.
  * **Google Calendar Integration**: Sync tasks and routines with your Google Calendar.

-----

### Tech Stack

  * **Frontend**: Next.js, React, TypeScript, TailwindCSS, ShadcnUI.
  * **Backend**: Supabase (PostgreSQL, Authentication, Storage).
  * **AI**: `@ai-sdk/groq`, `@huggingface/inference`, `openai`.

-----

### Getting Started

#### Prerequisites

  * Node.js (v18+)
  * npm or yarn

#### Installation

1.  Clone the repo:

    ```bash
    git clone https://github.com/yourusername/mindsync.git
    cd mindsync
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables:
    Create a `.env.local` file and add your keys:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    OPENAI_API_KEY=your_openai_api_key
    GROQ_API_KEY=your_groq_api_key
    HUGGINGFACE_API_KEY=your_huggingface_api_key
    ```

4.  Set up the database:

    ```bash
    # Install Supabase CLI
    npm install supabase --save-dev
    # Login to Supabase CLI
    npx supabase login
    # Link your project
    npx supabase link --project-ref YOUR_PROJECT_REF
    # Deploy the migrations
    npx supabase db push
    ```

5.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

-----

### Contributing

We welcome all contributions. Our primary focus is on expanding features and improving performance for developers and power users.

#### Roadmap:

  * **Multi-user Support**: Implement collaborative features like shared task lists and projects.
  * **Advanced Project Management**: Build new views such as Kanban boards and mind maps.
  * **Authentication**: Add support for more authentication providers like Firebase.
  * **AI Integrations**: Integrate new AI models to expand the assistant's capabilities.

#### How to Contribute:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'feat: add new feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.

-----

### License

This project is licensed under the MIT License.
