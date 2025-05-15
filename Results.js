import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [previousScans, setPreviousScans] = useState([]);
  const { foodData, analysis } = location.state || {};

  useEffect(() => {
    const fetchPreviousScans = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const scanQuery = query(
          collection(db, 'scanResults'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );

        const querySnapshot = await getDocs(scanQuery);
        const scans = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPreviousScans(scans);
      } catch (error) {
        console.error('Error fetching previous scans:', error);
      }
    };

    fetchPreviousScans();
  }, [navigate]);

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Scan Results</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-500 hover:text-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {foodData && analysis ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{foodData.name}</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Health Rating</h3>
              <div className={`text-3xl font-bold ${getRatingColor(analysis.rating)}`}>
                {analysis.rating}/10
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc pl-5">
                {foodData.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>Calories: {foodData.nutritionalInfo.calories}</div>
                <div>Sugar: {foodData.nutritionalInfo.sugar}g</div>
                <div>Sodium: {foodData.nutritionalInfo.sodium}mg</div>
              </div>
            </div>

            {analysis.warnings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Warnings</h3>
                <ul className="list-disc pl-5 text-red-600">
                  {analysis.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.alternatives && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Healthier Alternatives</h3>
                <ul className="list-disc pl-5 text-green-600">
                  {analysis.alternatives.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No scan results to display. Try scanning a product first.
          </div>
        )}

        {previousScans.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Previous Scans</h3>
            <div className="space-y-4">
              {previousScans.map((scan) => (
                <div key={scan.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{scan.foodData.name}</h4>
                    <span className={getRatingColor(scan.analysis.rating)}>
                      {scan.analysis.rating}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
