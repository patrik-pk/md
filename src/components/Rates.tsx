import React, { useState, useEffect } from 'react'

import Select from 'react-select'
import Input from './Input'

import '../styles/rates.scss'

const apiKey = 'XFszn09U4PGFro5WBtKMtbV0oRB40sUX'
const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest'

const Rates = () => {
  const [options, setOptions] = useState<string[]>([])
  const [value1, setValue1] = useState(1)
  const [value2, setValue2] = useState(0)

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('apikey', apiKey)

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    }

    let lsdata = localStorage.getItem('lsdata')

    if (lsdata) {
      lsdata = JSON.parse(lsdata)
      console.log('ls data', lsdata)
      setOptions([
        // @ts-ignore
        { label: lsdata.base, value: lsdata.base },
        // @ts-ignore
        ...Object.keys(lsdata.rates).map((key) => ({ label: key, value: key })),
      ])
    } else {
      // @ts-ignore
      fetch(BASE_URL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('lsdata', JSON.stringify(data))
          setOptions([
            // @ts-ignore
            { label: data.base, value: data.base },
            // @ts-ignore
            ...Object.keys(data.rates).map((key) => ({
              label: key,
              value: key,
            })),
          ])
        })
        .catch((error) => console.log('error', error))
    }
  }, [])

  console.log(options)

  return (
    <>
      {options.length && (
        <>
          <div className='rates-value-wrapper'>
            <Input
              name='value1'
              type='number'
              step={1}
              // label='Input'
              value={value1}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue1(Number(e.target.value))
              }
            />

            <Select
              className='rates-select custom-select'
              classNamePrefix='custom-select'
              options={options}
              // onChange={(opt) => handleSelectChange(opt)}
              defaultValue={
                options.find((opt: any) => opt.value === 'CZK') || options[1]
              }
              // isSearchable={true}
            />
          </div>

          <div className='rates-value-wrapper'>
            <Input
              name='value2'
              type='number'
              step={1}
              // label='Input'
              value={value2}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue2(Number(e.target.value))
              }
            />

            <Select
              className='rates-select custom-select'
              classNamePrefix='custom-select'
              options={options}
              defaultValue={options[0]}
              // onChange={(opt) => handleSelectChange(opt)}
              // defaultValue={options[0] || null}
              // isSearchable={true}
            />
          </div>
        </>
      )}
    </>
  )
}

export default Rates
