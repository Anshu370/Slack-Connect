import { useState } from 'react';
import { Slack, ArrowRight } from 'lucide-react';
import Header from '../components/Header'
import Footer from '../components/Footer'

function Hero() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Redirect user to backend OAuth start route
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/slack/auth`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-5">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
              <Slack className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Slack Workspace
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your team communication by sending and scheduling messages 
            directly from our platform to your Slack channels and DMs.
          </p>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting...
              </>
            ) : (
              <>
                <Slack className="w-5 h-5 mr-3" />
                Connect your Slack workspace to start sending messages
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            You'll be redirected to Slack to authorize the connection
          </p>
        </div>

        {/* Steps Preview */}
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What happens next?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Authorize</h4>
                <p className="text-gray-600 text-sm">Connect your Slack workspace</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Choose Destination</h4>
                <p className="text-gray-600 text-sm">Select channels and DMs</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Send Messages</h4>
                <p className="text-gray-600 text-sm">Start messaging your team</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Hero;