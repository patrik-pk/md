import React, { useState, useEffect } from 'react'

import Select from 'react-select'
import Input from './Input'
import { morseCode, morseCodeReversed } from '../data/morseCode'

const Morse = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [convertType, setConvertType] = useState<ConvertType>(
    selectOptions[0].value
  )

  const handleSelectChange = (option: Option | null) => {
    if (!option) {
      return
    }

    setConvertType(option.value)
  }

  useEffect(() => {
    setOutput(convert(input, convertType))
  }, [input])

  return (
    <>
      <Input
        name='morseInput'
        label='Input'
        value={input}
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />

      <Select
        className='morse-select'
        classNamePrefix='morse-select'
        options={selectOptions}
        onChange={(opt) => handleSelectChange(opt)}
        defaultValue={selectOptions[0]}
        isSearchable={false}
      />

      <div className='morse-output'>
        <p className='morse-output-label'>Output</p>
        <p className='morse-output-value'>{output || '\u00A0'}</p>
      </div>
    </>
  )
}

type ConvertType = 'morse-to-text' | 'text-to-morse'

type Option = {
  value: ConvertType
  label: string
}

const selectOptions: Option[] = [
  {
    value: 'morse-to-text',
    label: 'Morse code to text',
  },
  {
    value: 'text-to-morse',
    label: 'Text to morse code',
  },
]

const convert = (input: string, convertType: ConvertType): string => {
  if (!input.length) {
    return ''
  }

  return convertType === 'morse-to-text'
    ? convertMorseToText(input)
    : convertTextToMorse(input)
}

const convertTextToMorse = (input: string): string => {
  return input
    .split('')
    .map(
      (char) =>
        morseCode[
          char
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        ]
    )
    .join('')
}

const convertMorseToText = (input: string): string => {
  return input
    .split('//')
    .map((word) =>
      word
        .split('/')
        .map((char) => morseCodeReversed[char])
        .join('')
    )
    .join(' ')
}

const isMorse = (input: string) => {
  if (input.includes(' ')) {
    return false
  }

  for (const char of input) {
    if (char != '-' && char != '.' && char != '/') {
      return false
    }
  }

  return true
}

export default Morse
