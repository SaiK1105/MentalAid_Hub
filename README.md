Mental Aid Hub
Mental Aid Hub is a modern, comprehensive web application designed to provide confidential and accessible mental health support. It offers a suite of tools for self-care and professional assistance, all within a secure and user-friendly platform. The application is built using React and modern web technologies to deliver a fast and responsive experience.

✨ Features
Secure User Authentication: Users can securely sign up and log in via email and password, with state management handled by Supabase. The app uses protected routes to ensure sensitive data is only accessible to authenticated users.

AI Mental Health Chat: An AI-powered chatbot provides immediate, empathetic, and confidential support. The chatbot dynamically generates responses using the Gemini API based on a user's messages and a preliminary risk assessment.

Mental Health Assessments: The app includes standardized self-assessment tools, such as the PHQ-9 (for depression) and GAD-7 (for anxiety), to help users understand their mental state.

Curated Resources: A library of helpful resources is available, including articles, guided audio sessions, videos, and downloadable PDFs, categorized by topic to help users with stress, anxiety, depression, and coping skills.

Counsellor Booking: A feature that allows users to browse a list of professional counsellors and book simulated sessions, showcasing a potential path to professional help.

Anonymous Mode: The welcome screen offers an anonymous mode, providing a barrier-free entry for users who prefer not to create an account.

Multi-language Support: The application is built with internationalization (i18n) support, allowing for an inclusive experience with translations for English, Hindi, Kashmiri, and Dogri.

🚀 Technologies Used
Frontend: React with TypeScript and Vite

Styling: Tailwind CSS with shadcn/ui components

Backend: Supabase for user authentication, data storage, and real-time updates.

AI Integration: Gemini API for generating dynamic chatbot responses.

Routing: React Router DOM

State Management: React hooks and context for local and global state.

🛠️ Getting Started
Prerequisites
Node.js (v18 or higher) and npm installed on your machine.

A Supabase project with a database configured as per supabase/migrations files.

A Gemini API key.

Setup
Clone the repository:

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

Install dependencies:

npm install

Configure environment variables:
Create a .env file in the root of your project and add your Supabase and Gemini API keys.

VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

Run the application:

npm run dev

The application will be available at http://localhost:8080.