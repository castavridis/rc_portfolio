"use client"

/**
 * Based on MediaPipe CodePen demo
 * https://codepen.io/mediapipe-preview/pen/zYamdVd?editors=1000
 */
import Tesseract, { createWorker } from 'tesseract.js'
import { GestureRecognizer, FilesetResolver, DrawingUtils, GestureRecognizerResult } from '@mediapipe/tasks-vision'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'


const VIDEO_HEIGHT = "720px"
const VIDEO_WIDTH = "960px"

export default function GestureRecognizerTest () {
  const [isLoading, setIsLoading] = useState(true)
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer>()
  const [lastVideoTime, setLastVideoTime] = useState(-1)
  const [recognizedText, setRecognizedText] = useState(``)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const workerRef = useRef<Tesseract.Worker>(null)
  const recognizedTextRef = useRef(null)

  useGSAP(() => {
    if (recognizedTextRef.current) {
      gsap.to(recognizedTextRef.current, {
        // x: 100 * Math.random(),
        y: -100,
        opacity: 1,
        scale: 2.5,
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
        yoyoEase: 'power2.inOut',
        onComplete: () => {
          gsap.to(recognizedTextRef.current, {
            opacity: 0,
          })
        }
      })
    }
  }, {dependencies: [recognizedText]})

  const initTesseract = useCallback(async () => {
    const worker = await createWorker('eng')
    if (worker) {
      workerRef.current = worker
    }
  }, [])

  const initGestureRecognizer = useCallback(async () => {
    try {
      // - TODO: What is this for?
      const vision = await FilesetResolver.forVisionTasks(
        // path/to/wasm/root
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )
      const _gestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/_lib/models/gesture_recognizer.task", // TODO: What is this .task
            delegate: "GPU", // TODO: What is the implication here?
          },
          numHands: 1,
          runningMode: 'VIDEO',
          cannedGesturesClassifierOptions: {
            "categoryAllowlist": ["Pointing_Up", "Closed_Fist"]
          }
        }
      )
      setGestureRecognizer(_gestureRecognizer)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const predictWebcam = useCallback((video: HTMLVideoElement) => {
    if (!gestureRecognizer || !video) return
    
    let nowInMs = Date.now()
    if (video.currentTime !== lastVideoTime) {
      const _result = gestureRecognizer.recognizeForVideo(video, nowInMs)
      setLastVideoTime(video.currentTime)
      drawResults(_result)
    }  
    
    window.requestAnimationFrame(() => predictWebcam(video))
  }, [gestureRecognizer, lastVideoTime])

  const recognizeText = useCallback(async () => {
    if (!workerRef.current || !canvasRef.current) {
      console.warn('Worker or canvas not ready yet')
      return
    }
    const capture = canvasRef.current.toDataURL()
    const ret = await workerRef.current.recognize(capture)
    if (ret.data.text) {
      setRecognizedText(`${ret.data.text}`)
    }
  }, [canvasRef, workerRef])

  function drawResults (results: GestureRecognizerResult) {
    const canvas: HTMLCanvasElement = canvasRef.current
    if (!canvas) return
    
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return
    
    canvasCtx.save()
    const drawingUtils = new DrawingUtils(canvasCtx)
    if (results.gestures) {
      for (const gestures of results.gestures) {
        for (const gesture of gestures) {
          if (gesture.categoryName !== "Pointing_Up") {
            canvasCtx.scale(-1,1)
            canvasCtx.save()
            recognizeText()
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
            canvasCtx.restore()
          }
          else {
            if (results.landmarks) {
              for (const landmarks of results.landmarks) {
                // drawingUtils.drawConnectors(
                //   landmarks,
                //   GestureRecognizer.HAND_CONNECTIONS,
                //   {
                //     color: "#FF00FF",
                //     lineWidth: 1,
                //   }
                // )
                // drawingUtils.drawLandmarks(landmarks, {
                //   color: "#FFFF00",
                //   lineWidth: 1,
                // })
                drawingUtils.drawLandmarks([landmarks[8]], {
                  color: "#FF0000",
                  lineWidth: 5,
                })
              }
            }
          }
        }
      }
    }
    canvasCtx.restore() // TODO: What does this do?
  }

  const handleButtonClick = useCallback(() => {
    const canvas: HTMLCanvasElement = canvasRef.current
    const video: HTMLVideoElement = videoRef.current

    if (!canvas || !video) return

    video.style.height = VIDEO_HEIGHT
    video.style.width = VIDEO_WIDTH

    canvas.style.height = VIDEO_HEIGHT
    canvas.style.width = VIDEO_WIDTH

    navigator.mediaDevices.getUserMedia({
      video: true,
    }).then((stream: MediaStream) => {
      video.srcObject = stream
      video.addEventListener("loadeddata", () => {
        predictWebcam(video)
      })
    })
  }, [videoRef, canvasRef, predictWebcam])

  useEffect(() => {
    initGestureRecognizer()
  }, [initGestureRecognizer])

  useEffect(() => {
    initTesseract()
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [initTesseract])

  return (
    isLoading 
      ? <div>
          Loading Phonics Toy...
        </div>
      : <div>
          <h1>Phonics Toy</h1>
          <div className="flex items-center">
            <h2 className="mb-0">1. Enable Webcam</h2>
            <button className="rounded-md block p-3 ml-4" onClick={handleButtonClick}>Enable Webcam</button>
          </div>
          <h2>Goals</h2>
          <ul>
            <li>Attempt to draw letters using 👆 your pointer finger</li>
            <li>When you're ready to check your letter, close your fist ✊</li>
          </ul>
          <div className="relative">
            <video className="scale-x-[-1]" ref={videoRef} autoPlay playsInline style={{ opacity: 0.25 }} />
            <canvas className="scale-x-[-1]" ref={canvasRef} width="1280" height="720" style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 1,
            }}></canvas>
            <div className="absolute top-[50%] left-[50%] z-10 opacity-0 translate-x-[-50%] translate-y-[-50%] text-5xl" ref={recognizedTextRef}>
              {recognizedText}
            </div>
          </div>
        </div>
  )
}