import React, { useState, useRef } from 'react';
import { ImagePlus, Camera, Upload, CheckCircle, RefreshCcw, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import Webcam from 'react-webcam';
import imageCompression from 'browser-image-compression';

const EmotionDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const webcamRef = React.useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    const formData = new FormData();
    const compressedFile = await compressImage(selectedFile);
    formData.append('image', compressedFile);
    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.1.40:5000/api/analyze-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 100000
      });

      setResults(response.data);
      setUploadedFile(selectedFile);
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.error || 'Server error'
        : err.message;
      setError(`Analysis failed: ${errorMessage}`);
      console.error('Upload Error:', err);
    } finally {
      setIsLoading(false);
      setIsWebcamActive(false);
    }
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const file = dataURItoBlob(imageSrc);
      const compressedFile = await compressImage(file);
      setSelectedFile(compressedFile);
      setIsWebcamActive(false);
    }
  };
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
      return file;
    }
  };
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Helper function to get the highest scored label
  const getHighestScoredLabel = (resultObj) => {
    return Object.entries(resultObj).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const resetState = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
    setIsWebcamActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-9 mr-10 border-2 border-gray-700 ">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Facial Analysis</h2>


          {/* Upload and Webcam Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
            <div className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="file-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="file-upload"
                className="block w-full bg-gray-700 text-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center"
              >
                <Upload className="inline-block mr-2" />
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload Face Image'}
              </label>
            </div>

            <button
              onClick={() => setIsWebcamActive(true)}
              className="flex-1 p-4 rounded-lg bg-gray-700 hover:bg-green-700 text-white hidden md:flex items-center justify-center"
            >
              <Camera className="mr-2" />
              Use Webcam
            </button>
          </div>
          {isWebcamActive && (
            <div className="text-center mb-6">
              <Webcam
                audio={false}
                height="auto"
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "user" }}
                ref={webcamRef}
              />
              <button
                onClick={handleCapture}
                className="hidden md:flex w-full mt-4 p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white items-center justify-center">
                <CheckCircle className="mr-2" />
                Capture
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            className={`w-full p-4 rounded-lg transition flex items-center justify-center ${selectedFile ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin mr-2"><Loader className="w-6 h-6 text-white" /></div>
            ) : (
              <ImagePlus className="mr-2" />
            )}
            {isLoading ? 'Analyzing...' : 'Analyze Face'}
          </button>

          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-400 p-4 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>

        {results && (
          <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-8 border-2 border-gray-700 max-w-2xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400 text-center">Uploaded Image</h3>
              <div className="flex justify-center">
                {uploadedFile && (
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Uploaded"
                    className="rounded-lg shadow-lg max-w-full h-auto max-h-96 md:max-h-80 lg:max-h-72 xl:max-h-64"
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400 text-center">Analysis Results</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h4 className="text-gray-300 mb-2">Gender</h4>
                  <p className="text-white font-bold">
                    {getHighestScoredLabel(results.gender)}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <h4 className="text-gray-300 mb-2">Age</h4>
                  <p className="text-white font-bold">
                    {getHighestScoredLabel(results.age)}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg ">
                  <h4 className="text-gray-300 mb-1 text-center">Mask</h4>
                  <p className="text-white font-bold    ">
                    {getHighestScoredLabel(results.mask)}

                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-400 text-center">Emotions</h3>
              <div className="flex justify-center">
                <div className="w-full md:w-1/1 lg:w-2/3 xl:w-1/1">
                  <Radar
                    data={{
                      labels: Object.keys(results.emotions),
                      datasets: [
                        {
                          label: 'Emotions',
                          data: Object.values(results.emotions).map((score) => score * 100),
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        r: {
                          angleLines: {
                            display: true
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          },
                          ticks: {
                            display: true,
                            stepSize: 20,
                            maxTicksLimit: 6,
                            color: 'white',
                            backdropColor: 'rgba(0, 0, 0, 0)'
                          },
                          pointLabels: {
                            color: 'white'
                          }
                        }
                      },
                      responsive: true,
                      maintainAspectRatio: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={resetState}
                className="w-full md:w-1/3 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              >
                <RefreshCcw className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector;