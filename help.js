import { useNavigate } from 'react-router-dom';

function Help() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I scan a food product?",
      answer: "Go to the Scanner page, point your camera at the product's barcode, and hold steady. The app will automatically detect and scan the barcode."
    },
    {
      question: "What health issues can the app detect?",
      answer: "The app analyzes products for compatibility with various health conditions including diabetes (sugar), blood pressure, heart disease, digestive issues, and allergies."
    },
    {
      question: "How accurate are the health ratings?",
      answer: "Our ratings are based on nutritional information and ingredients. A rating of 8-10 is excellent, 6-7 is good, and below 6 suggests caution based on your health profile."
    },
    {
      question: "Can I view my previous scans?",
      answer: "Yes! Your scan history is available on the Results page, showing your last 5 scans with their health ratings."
    },
    {
      question: "How do I update my health profile?",
      answer: "Go to your Profile page from the Dashboard. You can update your health conditions and preferences at any time."
    },
    {
      question: "What do the color codes mean?",
      answer: "Green (8-10): Safe to consume\nYellow (6-7): Consume in moderation\nRed (1-5): Use caution or avoid based on your health conditions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Help & FAQ</h1>
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  {faq.question}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">
              Need More Help?
            </h3>
            <p className="text-gray-600">
              If you can't find the answer you're looking for, please contact our support team at:
              <br />
              Email: support@foodscanner.com
              <br />
              Phone: 1-800-FOOD-SCAN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
