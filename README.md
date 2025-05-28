# Recall - Interactive Flashcard Learning Platform

Recall is a modern web application built with Next.js that helps users create, study, and share flashcard sets for effective learning.

## Features

- **Create and Manage Flashcard Sets**
  - Create sets with custom titles and descriptions
  - Add, edit, and delete flashcards
  - Organize sets with labels
  - Track creation and update times

- **Study Modes**
  - Interactive study mode with card flipping
  - Multiple choice and fill-in-the-blank test mode
  - Progress tracking and performance statistics
  - Keyboard shortcuts for efficient navigation

- **Sharing and Collaboration**
  - Share flashcard sets with other users
  - View sets shared with you
  - Manage shared access permissions
  - Real-time updates for shared content

- **User Experience**
  - Clean, modern interface
  - Responsive design for all devices
  - Smooth animations and transitions
  - Loading states and error handling

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Lucide Icons

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database (Supabase)
  - NextAuth.js for Authentication

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/recall.git
   cd recall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://postgres:your-password@db.qfhevbpptypgtibdhtpt.supabase.co:5432/postgres"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Creating a Set**
   - Click "New Set" to create a flashcard set
   - Add a title and description
   - Add flashcards with terms and definitions
   - Add labels for organization

2. **Studying**
   - Open a set and click "Study"
   - Use spacebar to flip cards
   - Use arrow keys to navigate
   - Track your progress

3. **Testing**
   - Open a set and click "Test"
   - Choose the number of cards to test
   - Answer multiple choice or fill-in-the-blank questions
   - Review your results

4. **Sharing**
   - Open a set and click the share icon
   - Enter the email of the user to share with
   - Manage shared access from the set page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
