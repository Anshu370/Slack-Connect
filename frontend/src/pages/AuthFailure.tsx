import { XCircle, Slack, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer'

function AuthFailure() {
  const handleRetry = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/slack/auth`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Authentication Failed
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We couldn't connect to your Slack workspace. This might be due to 
            permissions being denied or a connection issue.
          </p>

          {/* Error Details Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Connection Failed
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The authorization process was interrupted or denied. This could happen if:
            </p>
            
            {/* Common Issues */}
            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Common Issues:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You clicked "Cancel" or "Deny" during the authorization process</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Network connection was interrupted</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Your Slack workspace has restricted third-party app installations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Session expired during the authorization process</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleRetry}
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-3" />
              Try Again
            </button>
            
            <Link 
              to="/"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-800 text-sm">
              If you continue to experience issues, please contact your Slack workspace administrator 
              or check if third-party app installations are allowed in your workspace settings.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AuthFailure;