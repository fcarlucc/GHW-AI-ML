import { auth0 } from "@/lib/auth0";
import { cookies } from 'next/headers';
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import ChatInterface from "@/components/ChatInterface";

export default async function Home() {
  let session = await auth0.getSession();
  
  // Fallback: check for manual cookie if session not found
  if (!session) {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    if (userInfoCookie) {
      try {
        const userInfo = JSON.parse(Buffer.from(userInfoCookie, 'base64').toString());
        session = {
          user: {
            sub: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name || userInfo.nickname,
            picture: userInfo.picture,
          }
        };
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }
  
  const user = session?.user;

  // Landing Page (not logged in)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="container max-w-4xl">
          <div className="text-center">
            
            <h1 className="text-6xl text-white mb-6">
              Privacy-Aware<br />RAG Assistant
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              An intelligent AI assistant that respects privacy and manages access<br />
              to company documents based on your role with Auth0 FGA
            </p>
            
            <LoginButton />

            {/* Features - Vertical */}
            <div className="mt-16 space-y-4 max-w-2xl mx-auto">
              <div className="glass-card p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">🔐 Fine-Grained Access</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Document-level access control with Auth0 FGA - managers see salary data, employees don't
                </p>
              </div>

              <div className="glass-card p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">📚 Smart RAG System</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Retrieval-Augmented Generation with permission filtering before LLM sees content
                </p>
              </div>

              <div className="glass-card p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">⚡ Powered by Groq</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Lightning-fast responses using Groq's LLM inference with Llama 3.3 70B model
                </p>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-12">
              <p className="text-gray-500 text-sm mb-3">Try it with demo accounts:</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <div className="glass-card px-4 py-2">
                  <span className="text-white text-sm font-medium">👔 manager@company.com</span>
                  <span className="text-gray-500 text-xs ml-2">(Full Access)</span>
                </div>
                <div className="glass-card px-4 py-2">
                  <span className="text-white text-sm font-medium">👤 employee@company.com</span>
                  <span className="text-gray-500 text-xs ml-2">(Limited Access)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat App (logged in)
  const isManager = user.email?.toLowerCase().includes('manager') || user.email?.toLowerCase().includes('admin');

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Privacy-Aware RAG</h1>
              <p className="text-sm text-gray-400">
                {user.email} • <span className={isManager ? 'font-bold text-red-500' : 'text-white'}>{isManager ? '👔 Manager' : '👤 Employee'}</span>
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎯 How it works</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">1.</span>
                  <span>Ask a question about company documents</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">2.</span>
                  <span>Auth0 FGA verifies your permissions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">3.</span>
                  <span>RAG retrieves only authorized documents</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">4.</span>
                  <span>Groq LLM generates the response</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">📚 Available Documents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Company Handbook</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Benefits Overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Vacation Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isManager ? 'text-green-400' : 'text-red-500'}>
                    {isManager ? '✓' : '✗'}
                  </span>
                  <span className={!isManager ? 'text-gray-600' : 'text-gray-300'}>Salary Bands</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isManager ? 'text-green-400' : 'text-red-500'}>
                    {isManager ? '✓' : '✗'}
                  </span>
                  <span className={!isManager ? 'text-gray-600' : 'text-gray-300'}>Q4 Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isManager ? 'text-green-400' : 'text-red-500'}>
                    {isManager ? '✓' : '✗'}
                  </span>
                  <span className={!isManager ? 'text-gray-600' : 'text-gray-300'}>Compensation Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Chat */}
          <div>
            <ChatInterface userEmail={user.email || user.sub} />
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">💡 Example Questions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-gray-700 text-sm text-gray-300 transition">
                  🏖️ What are the vacation policies?
                </button>
                <button className="w-full text-left p-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-gray-700 text-sm text-gray-300 transition">
                  🏥 Tell me about employee benefits
                </button>
                <button className="w-full text-left p-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-gray-700 text-sm text-gray-300 transition">
                  ⏰ How many PTO days do I get?
                </button>
                <button className="w-full text-left p-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-gray-700 text-sm text-gray-300 transition">
                  🏥 What health insurance options?
                </button>
                {isManager && (
                  <>
                    <button className="w-full text-left p-3 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-xl border border-red-500 text-sm text-red-400 transition">
                      💰 What are the salary bands?
                    </button>
                    <button className="w-full text-left p-3 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-xl border border-red-500 text-sm text-red-400 transition">
                      📊 Show me Q4 budget details
                    </button>
                    <button className="w-full text-left p-3 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-xl border border-red-500 text-sm text-red-400 transition">
                      💵 What's the compensation policy?
                    </button>
                    <button className="w-full text-left p-3 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-xl border border-red-500 text-sm text-red-400 transition">
                      🎁 Bonus structure for this year?
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">🔒 Privacy & Security</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Pre-retrieval authorization</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>LLM never sees blocked docs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Complete audit trail</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Auth0 FGA integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
