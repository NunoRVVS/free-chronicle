import React, { useState, useEffect, useRef } from 'react'

export default function HomePage(props) {
  const { setFile, setAudioStream } = props
  const [recordingStatus, setRecordingStatus] = useState('inactive')
  const [audioChuncks, setAudioChunks] = useState([])
  const [duration, setDuration] = useState(0)

  const mediaRecorder = useRef(null)

  const mimeType = 'audio/webm'

  // recording function 
  async function startRecording() {
    let tempStream

    console.log('Start recording')

    try { 
      const stremData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      tempStream = stremData
    } catch(err) {
        console.error(err.message)
        return
      }
      setRecordingStatus('recording')

      // explanation create new Media Recorder instance using the stream
      const media = new MediaRecorder(tempStream, { type:mimeType })

      mediaRecorder.current = media

      mediaRecorder.current.start()
      let localAudioChunks = []
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') { return }
        if (event.data.size === 0) { return }
        localAudioChunks.push(event.data)
      }
      setAudioChunks(localAudioChunks)
    }

  // stop recoding function
  async function stopRecording() {
    setRecordingStatus('inactive')
    console.log('Stop recording')

    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChuncks, { type: mimeType })
      setAudioStream(audioBlob)
      setAudioChunks([])
      setDuration(0)
    }
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') { return }

    const interval = setInterval(() => {
      setDuration(curr => curr + 1)
    }, 1000)

    return () => clearInterval(interval)
  })
  
  return (
    <main className='flex-1 p-4 flex flex-col text-center gap-3 sm:gap-4 justify-center pb-20'>
        <h1 className='font-semibold text-5xl sm:text-6xl 
        md:text-7xl'>Free<span className='text-blue-900 bold'>Chronicle</span></h1>
        <h3 className='font-medium md:text-lg '>Record <span 
        className='text-blue-900'>&rarr;</span> Transcribe <span
        className='text-blue-900'>&rarr;</span> Translate </h3>
        <button onClick={recordingStatus === 'recording' ? 
          stopRecording : startRecording} 
          className='flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4'>
          <p className='text-blue-900'>{recordingStatus === 'inactive' ? 'Record' : 'Stop recording'}</p>
          <div className='flex items-center gap-2'>
            {duration !== 0 && (
              <p className='text-sm text-#ab6b5c'>{duration}s</p>)
            }
            <i className={"fa-solid duration-200 fa-microphone text-blue-900 " + (recordingStatus === 'recording' ? ' text-rose-400' : 
            "")}></i>
          </div>
        </button>
        <p className='text-base'>Or <label className='text-blue-900 cursor-pointer hover:text-blue-400 duration-200'>upload 
          <input onChange={(e) => {
            const file = e.target.files[0]
            setFile(file)
          }} className='hidden' type='file' accept='.mp3,.wav'/></label> a mp3 file</p>
        <p className='italic text-slate-400'>Free for ever more</p>
    </main>
  )
} 
