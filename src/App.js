import React, { useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import EmotionDetector from './components/EmotionDetector';

import FaceDetector from './components/FaceDetector';

function App() {
  // Create a ref for the EmotionDetector component
  const emotionDetectorRef = useRef(null);

  
  const scrollToEmotionDetector = () => {
    emotionDetectorRef.current.scrollIntoView({
      behavior: 'smooth', 
      block: 'start',     
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <section className="w-full md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-6xl font-bold mb-4 ml-5">MoodE</h1>
              <h1 className="text-4xl font-bold mb-4 ml-5">Real-Time Face Analysis AI</h1>
              <p className="text-lg text-gray-400 mb-6 ml-5">
                Explore MoodE's Advanced Face Analysis AI
              </p>
              <div className="mt-6">
                <button
                  onClick={scrollToEmotionDetector} 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-4 ml-5"
                >
                  Try Demo
                </button>
                
              </div>
            </section>

            
            <div className="w-full md:w-1/2 flex justify-center mr-12 md:block" >
              <img
                src="/Phone2.png"
                alt="Phone Mockup"
                className="max-w-full h-auto md:max-w-md"
              />
            </div>
          </div>
        </div>

        
        <div ref={emotionDetectorRef}>
          
          <EmotionDetector />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
