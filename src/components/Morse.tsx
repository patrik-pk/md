import React, { useState, useEffect } from 'react'

import Select from 'react-select'
import Input from './Input'
import { morseCode, morseCodeReversed } from '../data/morseCode'

import '../styles/morse.scss'

const Morse = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [inputError, setInputError] = useState<React.ReactNode>(null)
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
    setOutput(convert(input, convertType, setInputError))
  }, [input, convertType])

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

      {inputError && (
        <div className='morse-input-error'>
          <p className='morse-input-error__label'>Input contains errors:</p>
          <p className='morse-input-error__value'>{inputError}</p>
        </div>
      )}

      <Select
        className='morse-select custom-select'
        classNamePrefix='custom-select'
        options={selectOptions}
        onChange={(opt) => handleSelectChange(opt)}
        defaultValue={selectOptions[0]}
        isSearchable={false}
      />

      <div className='morse-output'>
        <p className='morse-output__label'>Output</p>
        <p className='morse-output__value'>{output || '\u00A0'}</p>
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

const convert = (
  input: string,
  convertType: ConvertType,
  setInputError: Function
): string => {
  if (!input.length) {
    setInputError(null)
    return ''
  }

  // TODO: Also handle error when converting from text to morse
  if (convertType == 'text-to-morse') {
    setInputError(null)
  }

  return convertType === 'morse-to-text'
    ? convertMorseToText(input, setInputError)
    : convertTextToMorse(input)
}

const convertTextToMorse = (input: string): string => {
  return input
    .split(' ')
    .map((word) =>
      word
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
        .join('/')
    )
    .join('//')
}

const convertMorseToText = (input: string, setInputError: Function): string => {
  const inputCheckArr: {
    value: string
    error: boolean
  }[] = []
  const words = input.split('//')
  const result = words
    .map((word, i) => {
      if (i !== 0) {
        inputCheckArr.push({ value: '//', error: false })
      }

      const chars = word.split('/')
      return chars
        .map((char, j) => {
          if (!char.length) {
            return ''
          }

          const val = morseCodeReversed[char]
          inputCheckArr.push({ value: char, error: val ? false : true })
          if (j !== chars.length - 1) {
            inputCheckArr.push({ value: '/', error: false })
          }

          return val
        })
        .join('')
    })
    .join(' ')

  const containsError = inputCheckArr.some((item) => item.error)
  const inputError = containsError ? (
    <>
      {inputCheckArr.map((item, i) =>
        item.error ? (
          <span key={i} className='error'>
            {item.value}
          </span>
        ) : (
          <React.Fragment key={i}>{item.value}</React.Fragment>
        )
      )}
    </>
  ) : null

  setInputError(inputError)

  return result
}

export default Morse
