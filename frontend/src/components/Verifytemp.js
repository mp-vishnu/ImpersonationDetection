import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Verifying = () => {
  const { image } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      // Cleanup: Stop the camera when the component unmounts
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
  
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set the canvas dimensions to the video dimensions
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the current frame of the video onto the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Get the base64-encoded data URL of the canvas
    const image2 = canvas.toDataURL('image/jpeg'); // You can change the format if needed

    return image2;
  };

  const sendImagesToServer = async () => {
    //const image1 = image.toString('base64');
    const image1 = decodeURIComponent(image);
    try {
      const image2 = captureImage();
      console.log("image---",typeof image1);
      console.log("image2---",typeof image2);
      const response = await fetch('http://localhost:5000/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image1, image2 }),
      });
      console.log("ok---",response.ok);
      console.log("response---",response.message);
      const result = await response.json();
      console.log(result.message);
      if (result.match_flag) {
        navigate('/done');
      } else {
        navigate('/error');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      stopCamera(); // Stop the camera after capturing the image
    }
  };

  useEffect(() => {
    // Start a timer to capture the image after 7 seconds
    const captureTimer = setTimeout(() => {
      sendImagesToServer();
    }, 7000);

    return () => {
      // Cleanup: Clear the timer if the component unmounts
      clearTimeout(captureTimer);
    };
  }, []); // Empty dependency array ensures that this effect runs once after initial render

  return (
    <div>
      <video ref={videoRef} autoPlay />
      {/* No need for a button to start the camera since it starts automatically */}
    </div>
  );
};

export default Verifying;
