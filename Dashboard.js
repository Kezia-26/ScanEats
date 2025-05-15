import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Food Scanner</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/help')}
                className="text-blue-500 hover:text-blue-600"
              >
                Help
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Welcome, {userData?.name || 'User'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/scanner')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Scan Food</h3>
            <p className="text-gray-600">Scan food products to check their health compatibility</p>
          </div>

          <div
            onClick={() => navigate('/results')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">View Results</h3>
            <p className="text-gray-600">Check your previous scan results and recommendations</p>
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
            <p className="text-gray-600">Manage your health information and preferences</p>
          </div>

          <div
            onClick={() => navigate('/help')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Help & FAQ</h3>
            <p className="text-gray-600">Get answers to common questions and learn how to use the app</p>
          </div>
        </div>

        {userData?.healthIssues && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Health Profile</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(userData.healthIssues).map(([issue, hasIssue]) => (
                  hasIssue && (
                    <div key={issue} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="capitalize">{issue.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
