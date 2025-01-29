import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { output } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(null)
    
    //this to define worker
    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
          worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
            type: 'module'
          })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.type) {
                case 'initiate':
                    console.log('DOWNLOADING')
                    break;
                case 'progress':
                    console.log('LOADING')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    console.log(e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log('DONE')
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => {
            worker.current.removeEventListener('message', onMessageReceived)
        }
    })

    const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || ''

    function handleCopy() {
        navigator.clipboard.writeText(textElement.toString())
    }

    function handleDownload() {
        const element = document.createElement('a')
        const file = new Blob([textElement], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `FreeChronicle_${new Date().toString()}.txt`
        document.body.appendChild(element)
        element.click()
    }
    
    function generateTranslation() {
        if (translating || toLanguage === 'Select language' || !worker.current) {
            return
        }

        setTranslating(true)

        worker.current.postMessage({
            text: output.map(val => val.text).join("\n"),
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage,
        })
    }

  return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
        <h1 className='font-semibold text-4xl sm:text-5xl 
        md:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>
        <div className='grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
            <button onClick={() => {
                setTab('transcription')
            }} className={'px-4 duration-200 py-1 font-medium ' + 
                (tab === 'transcription' ? 
                ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Transcription</button>
            <button onClick={() => {
                setTab('translation')
            }} className={'px-4 duration-200 py-1 font-medium ' + 
                (tab === 'translation' ? 
                ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Translation</button>
        </div>

        <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
        {tab === 'transcription' ? ( 
            <Transcription {...props} textElement={textElement} />
        ) : (
            <Translation {...props} toLanguage={toLanguage} 
            translating={translating} textElement={textElement} 
            setTranslating={setTranslating} setTranslation={setTranslation} 
            setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
        )}
        </div>
        <div className='flex items-center gap-4 mx-auto text-base'>
            <button onClick={handleCopy} title='Copy' className='bg-yellow-50 hover:text-blue-600 duration-200 text-blue-400 px-2 aspect-square grid place-items-center rounded-md px-4'>
                <i className="fa-regular fa-copy"></i>
            </button>
            <button onClick={handleDownload} title='Download' className='bg-yellow-50 hover:text-blue-600 duration-200 text-blue-400 px-2 aspect-square grid place-items-center rounded-md px-4'>
                <i className="fa-solid fa-file-arrow-down"></i>
            </button>
        </div>
    </main>
  )
}

