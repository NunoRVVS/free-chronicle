import React from 'react'

export default function Transcription(props) {
  const { output } = props
  console.log(output)
  const finalText = output.map(val => val.text)

  return (
    <div>{finalText}</div>
  )
}
