import React, { useState } from "react";
import axios from "axios";

const FaceDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState("");
  const [isAddingNewFace, setIsAddingNewFace] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "recognized") {
        setResults({ recognized: true, user: response.data.user });
      } else {
        setResults({ recognized: false });
        setIsAddingNewFace(true);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleSaveFace = async () => {
    const formData = new FormData();
    formData.append("name", userName);
    formData.append("embedding", JSON.stringify(results.embedding));

    try {
      const response = await axios.post("http://localhost:5000/api/save-face", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("New face added successfully!");
      setIsAddingNewFace(false);
    } catch (error) {
      console.error("Error saving new face", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Analyze Face</button>

      {results && results.recognized ? (
        <div>
          <p>Recognized: {results.user.name}</p>
        </div>
      ) : (
        <div>
          <p>Face not recognized. Add a new face?</p>
          {isAddingNewFace && (
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button onClick={handleSaveFace}>Save Face</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceDetector;
