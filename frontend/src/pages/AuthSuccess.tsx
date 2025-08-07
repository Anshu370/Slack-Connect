import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CheckCircle, Slack, ArrowRight, Users, MessageSquare } from 'lucide-react';
import Header from '../components/Header'
import Footer from '../components/Footer'

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract parameters from URL
    const teamId = searchParams.get('teamId');
    const teamName = searchParams.get('teamName');
    const botUserId = searchParams.get('botUserId');
    const userId = searchParams.get('userId');

    // Store in cookies if parameters exist
    if (teamId && teamName && botUserId && userId) {
      Cookies.set('slack_team_id', teamId, { expires: 10 }); // 10 days
      Cookies.set('slack_team_name', teamName, { expires: 10 });
      Cookies.set('slack_bot_user_id', botUserId, { expires: 10 });
      Cookies.set('slack_user_id', userId, { expires: 10 });
      
      console.log('Slack auth data stored in cookies:', {
        teamId,
        teamName,
        botUserId,
        userId
      });
    }
  }, [searchParams]);

  const handleContinueToDashboard = () => {
    // todo navigate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5  ">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Slack Connect!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your Slack workspace has been successfully connected. You can now send and schedule 
            messages to your team channels and direct messages.
          </p>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">            
            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Browse your channels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Send your first message</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleContinueToDashboard}
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <div className="mt-5">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AuthSuccess;