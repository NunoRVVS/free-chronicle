import { useState, useEffect, useRef } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'
import { use } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [outPut, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const isAudioAvailble = file  || audioStream

  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }

  const worker = useRef(null)

  // useEffect(() => {
  //   console.log(audioStream)
  // }, [audioStream])

  return (
    <>
      <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
        <section className='min-h-screen flex flex-col'>
          <Header />
          {outPut ? (
            <Information />
          ) : loading ? (
            <Transcribing />
          ) : isAudioAvailble ? (
            <FileDisplay handleAudioReset=
            {handleAudioReset} file={file} audioStream={audioStream}/>
          ) : (<HomePage setFile={setFile} setAudioStream=
            {setAudioStream} />
          )}
        </section>
        <h1 className='text-green-400'>Counter</h1>
        <footer></footer>
      </div>
    </>
  )
}

export default App
