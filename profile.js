import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    healthIssues: {
      sugar: false,
      bloodPressure: false,
      migraine: false,
      digestion: false,
      allergies: false,
      heartDisease: false,
      cholesterol: false
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().profileCompleted) {
          setFormData(userDoc.data());
        }
      } catch (error) {
        setError('Error loading profile data');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        healthIssues: {
          ...prev.healthIssues,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Please login first');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        ...formData,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Health Issues</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.healthIssues).map((issue) => (
                <div key={issue} className="flex items-center">
                  <input
                    type="checkbox"
                    name={issue}
                    checked={formData.healthIssues[issue]}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="capitalize">{issue.replace(/([A-Z])/g, ' $1').trim()}</label>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
