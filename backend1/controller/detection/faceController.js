const faceapi = require('face-api.js');
const { userModel } = require("../../model/userModel");

// ... (imports and other code)

exports.faceDetection = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email, password: req.body.password });
    const referenceImage = Buffer.from(existingUser.image, 'binary');

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
    ]);

    const referenceDescriptor = await getReferenceDescriptor(referenceImage);

    const videoStream = await beginVideo();

    function getReferenceDescriptor(image) {
      return faceapi.fetchImage(image)
        .then(img => faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor());
    }

    async function beginVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('play', onVideoPlay);
        return stream;
      } catch (err) {
        console.error('Unable to connect to the device', err);
        return res.status(500).json({
          success: false,
          error: 'Unable to connect to the device',
        });
      }
    }

    function onVideoPlay() {
      const video = videoRef.current;
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const dim = { width: video.width, height: video.width };
      faceapi.matchDimensions(canvas, dim);

      const intervalId = setInterval(async () => {
        try {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
          const resizeDetections = faceapi.resizeResults(detections, dim);
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizeDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);

          // Compare real-time face descriptor with the reference descriptor
          if (referenceDescriptor) {
            const distance = faceapi.euclideanDistance(referenceDescriptor.descriptor, resizeDetections[0].descriptor);
            const threshold = 0.5;

            if (distance < threshold) {
              console.log('Face match detected!');
              clearInterval(intervalId); // Clear interval on success
              videoStream.getTracks().forEach(track => track.stop()); // Stop video stream
              return res.status(200).json({
                success: true,
                message: 'You have registered.',
                data: {
                  image: existingUser.image,
                },
              });
            } else {
              console.log('Face does not match.');
              clearInterval(intervalId); // Clear interval on failure
              videoStream.getTracks().forEach(track => track.stop()); // Stop video stream
              return res.status(201).json({
                success: false,
                message: 'You have not registered.',
              });
            }
          }
        } catch (error) {
          console.error('Error in face detection:', error);
          clearInterval(intervalId); // Clear interval on error
          videoStream.getTracks().forEach(track => track.stop()); // Stop video stream
          return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
          });
        }
      }, 100);

      // Stop video stream after 7 seconds
      setTimeout(() => {
        clearInterval(intervalId);
        videoStream.getTracks().forEach(track => track.stop());
      }, 7000);
    }
  } catch (error) {
    console.error('Error in face detection:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

