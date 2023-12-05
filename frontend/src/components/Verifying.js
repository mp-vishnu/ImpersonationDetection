import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import draw from "../utilities/utilities";
import "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { useParams, useNavigate } from "react-router-dom";
tf.setBackend("webgl");

function Verifying() {
  const { image } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const runFaceDetection = async (image) => {
    const model = await blazeface.load();
    console.log("Face Detection Model is Loaded..");

    const returnTensors = false;

    const prediction = await model.estimateFaces(image, returnTensors);

    console.log(prediction);

    const ctx = canvasRef.current.getContext("2d");
    draw(prediction, ctx);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          runFaceDetection(image);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const runWebcamDetection = async () => {
    const model = await blazeface.load();
    console.log("Face Detection Model is Loaded..");
    const capturedImages = []; // to store captured images
    // setInterval(() => {
    //   detect(model);
    // }, 100);
    const detectionInterval = setInterval(() => {
      detect(model);
    }, 100);

    // Stop detection after 7 seconds
    setTimeout(() => {
      clearInterval(detectionInterval);
      console.log("Face detection stopped after 7 seconds");
      stopWebcam();
      captureImage();
      console.log("image", capturedImages);
      sendImagesToServer(capturedImages);
    }, 7000);
    const stopWebcam = () => {
      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        console.log("Webcam stopped after 7 seconds");
      }
    };

    const captureImage = () => {
      if (webcamRef.current && webcamRef.current.video) {
        const canvas = document.createElement("canvas");
        canvas.width = webcamRef.current.video.videoWidth;
        canvas.height = webcamRef.current.video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          webcamRef.current.video,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const capturedImageUrl = canvas.toDataURL("image/jpeg");
        capturedImages.push(capturedImageUrl);
        console.log("Image captured:", capturedImageUrl);
      }
    };
  };
  const sendImagesToServer = async (capturedImages) => {
    //const image1 = image.toString('base64');
    // const image1 = decodeURIComponent(image);
    const image1 = decodeURIComponent(image);
    const image2temp = capturedImages[0];
    let image2;
    if (image2temp) {
      image2 = image2temp.split(",")[1];
    }
    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);

    try {
      console.log("image1---", typeof image1);
      console.log("image1---", image1);
      console.log("image2---", typeof image2);
      console.log("image2---", image2);
      console.log("length---", capturedImages.length);
      console.log("data---", capturedImages);
      const response = await fetch("http://localhost:5000/compare", {
        method: "POST",
       body:formData
      });
      console.log("ok---", response.ok);
      const result = await response.json();
      console.log("result---", result);
      console.log(result.message);
      if (result.match_flag) {
        navigate("/done");
      } else {
        navigate("/error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  // const calculateImageSimilarity = (image1, image2) => {
  //   const canvas1 = document.createElement('canvas');
  //   const canvas2 = document.createElement('canvas');
  //   const ctx1 = canvas1.getContext('2d');
  //   const ctx2 = canvas2.getContext('2d');

  //   const img1 = new Image();
  //   const img2 = new Image();

  //   img1.src = image1;
  //   img2.src = image2;

  //   ctx1.drawImage(img1, 0, 0);
  //   ctx2.drawImage(img2, 0, 0);

  //   const imageData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data;
  //   const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data;

  //   const totalPixels = imageData1.length / 4; // RGBA values, so divide by 4
  //   let differentPixels = 0;

  //   for (let i = 0; i < imageData1.length; i += 4) {
  //     // Compare RGBA values
  //     if (
  //       imageData1[i] !== imageData2[i] ||
  //       imageData1[i + 1] !== imageData2[i + 1] ||
  //       imageData1[i + 2] !== imageData2[i + 2] ||
  //       imageData1[i + 3] !== imageData2[i + 3]
  //     ) {
  //       differentPixels++;
  //     }
  // }

  //   const similarityPercentage = ((totalPixels - differentPixels) / totalPixels) * 100;
  //   return similarityPercentage.toFixed(2);
  // };

  const detect = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current !== null // Check if canvasRef.current is not null
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const prediction = await model.estimateFaces(video, false);

      console.log(prediction);

      const ctx = canvasRef.current.getContext("2d");
      draw(prediction, ctx);
    }
  };

  runWebcamDetection();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 0,
            right: 80,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <input type="file" onChange={handleImageUpload} accept="image/*" />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 0,
            right: 80,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default Verifying;
