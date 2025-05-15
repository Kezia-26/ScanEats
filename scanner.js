
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import { auth, db } from '../firebase/config';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { foodDatabase, analyzeFood } from '../utils/foodDatabase';

function Scanner() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);

  const handleUserMedia = (stream) => {
    setCameraReady(true);
    setCameraError(false);
  };

  const handleUserMediaError = (error) => {
    console.error('Camera error:', error);
    setCameraError(true);
    setError('Camera access denied. Please use manual entry below.');
  };

  useEffect(() => {
    let codeReader;
    let scanInterval;

    const startScanning = async () => {
      if (webcamRef.current && webcamRef.current.video && cameraReady && scanning) {
        codeReader = new BrowserMultiFormatReader();
        try {
          const videoElement = webcamRef.current.video;
          if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            scanInterval = setInterval(async () => {
              try {
                console.log('Scanning attempt:', scanAttempts + 1);
                const result = await codeReader.decodeFromVideoElement(videoElement);
                if (result) {
                  console.log('Barcode detected:', result.getText());
                  clearInterval(scanInterval);
                  setScanning(false);
                  await processBarcode(result.getText());
                }
                setScanAttempts(prev => prev + 1);
              } catch (error) {
                // Continue scanning
              }
            }, 200); // Faster scanning interval
          }
        } catch (error) {
          console.error('Scanner initialization error:', error);
          setCameraError(true);
          setError('Camera access failed. Please use manual entry below.');
        }
      }
    };

    if (cameraReady && !cameraError) {
      startScanning();
      setScanAttempts(0);
    }

    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
      if (codeReader) {
        try {
          codeReader.reset();
          codeReader.destroy();
        } catch (error) {
          console.error('Error cleaning up scanner:', error);
        }
      }
    };
  }, [scanning, cameraReady, cameraError, scanAttempts]);

  const processBarcode = async (barcode) => {
    try {
      console.log('Processing barcode:', barcode);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userHealthIssues = userDoc.data().healthIssues;
      const foodData = foodDatabase[barcode];

      if (!foodData) {
        setError('Product not found in database');
        setScanning(true);
        return;
      }

      const analysis = analyzeFood(foodData, userHealthIssues);
      await addDoc(collection(db, 'scanResults'), {
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
        barcode,
        foodData,
        analysis,
      });

      navigate('/results', { state: { foodData, analysis }});
    } catch (error) {
      console.error('Process barcode error:', error);
      setError('Error processing scan: ' + error.message);
      setScanning(true);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      await processBarcode(manualBarcode.trim());
    }
  };

  const restartScanning = () => {
    setScanning(true);
    setCameraReady(false);
    setScanAttempts(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Scan Food Product</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {!cameraError ? (
            <div className="relative aspect-video mb-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full rounded-lg"
                videoConstraints={{
                  facingMode: 'environment',
                  width: { min: 480, ideal: 1080 },
                  height: { min: 360, ideal: 720 },
                  aspectRatio: 4/3,
                  focusMode: 'continuous'
                }}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                mirrored={false}
                audio={false}
              />
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-yellow-700">
                Camera not available. Please use manual entry below.
              </p>
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode manually"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Back
            </button>
            {!cameraError && (
              <button
                onClick={restartScanning}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {scanning ? 'Scanning...' : 'Scan Again'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
