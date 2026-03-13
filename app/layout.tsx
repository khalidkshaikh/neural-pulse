import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotWrapper } from '@/components/ChatbotWrapper';
import { BackToTop } from '@/components/BackToTop';
import { FeedbackForm } from '@/components/FeedbackForm';

export const metadata: Metadata = {
  title: 'NeuralPulse — AI & SAP AI Intelligence Platform',
  description:
    'The Bloomberg terminal for AI news. Automated daily intelligence on model releases, AI tools, open-source repos, and SAP AI ecosystem updates.',
  keywords: ['AI news', 'SAP AI', 'Joule', 'AI Core', 'Generative AI Hub', 'LLM', 'AI tools'],
  openGraph: {
    title: 'NeuralPulse — AI & SAP AI Intelligence Platform',
    description: 'Automated daily AI intelligence: model releases, tool launches, open-source trends, and SAP AI updates.',
    type: 'website',
  },
};

/**
 * Runs before first paint — reads localStorage and sets the correct theme
 * class on <html> with zero flash. Defaults to dark.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('np-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: applies theme class before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-950 text-slate-200 min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Aurora background */}
        <div className="aurora-bg">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
        {/* Grid overlay */}
        <div className="grid-overlay" />

        <Navbar />
        <main className="flex-1 page-content">
          {children}
        </main>
        <Footer />
        <ChatbotWrapper />
        <BackToTop />
        <FeedbackForm />
      </body>
    </html>
  );
}
