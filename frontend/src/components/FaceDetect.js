import React, { useEffect, useRef } from 'react';

const FaceDetection = () => {
    const videoRef = useRef();

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        startVideo();
    }, []);

    const captureFrameAndDetect = async () => {
        try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');

            // Send imageData to the backend for face detection
            const response = await fetch('/api/face-detection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData }),
            });

            const { detections } = await response.json();
            console.log('Face detections:', detections);
        } catch (error) {
            console.error('Error capturing frame and detecting face:', error);
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />
            <button onClick={captureFrameAndDetect}>Capture and Detect</button>
        </div>
    );
};

export default FaceDetection;
