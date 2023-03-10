import React, { useState, useEffect, useRef } from 'react'

import Select from 'react-select'
import Input from './Input'
import Loading from './Loading'

import '../styles/rates.scss'

const apiKey = 'XFszn09U4PGFro5WBtKMtbV0oRB40sUX'
const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest'

const myHeaders = new Headers()
myHeaders.append('apikey', apiKey)

type Option = {
  value: string
  label: string
}

const Rates = () => {
  const [options, setOptions] = useState<Option[]>([])
  const [fromCurrency, setFromCurrency] = useState<Option | null>(null)
  const [toCurrency, setToCurrency] = useState<Option | null>(null)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)
  const [loading, setLoading] = useState(false)
  const firstLoadRef = useRef(firstLoad)

  let fromAmount, toAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isAmountFrom: boolean
  ) => {
    setAmountInFromCurrency(isAmountFrom)
    setAmount(Number(e.target.value))
  }

  useEffect(() => {
    firstLoadRef.current = firstLoad
  }, [firstLoad])

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    }

    setLoading(true)

    fetch(BASE_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const baseOption = { label: data.base, value: data.base }
        const otherOptions = Object.keys(data.rates).map((key) => ({
          label: key,
          value: key,
        }))
        const toOption =
          otherOptions.find((opt) => opt.value === 'CZK') || otherOptions[0]

        setOptions([baseOption, ...otherOptions])
        setFromCurrency(baseOption)
        setToCurrency(toOption)
        setExchangeRate(data.rates[toOption.value])
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('fetch error', error)
      })
  }, [])

  useEffect(() => {
    if (fromCurrency && toCurrency && !firstLoadRef.current) {
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      }

      setLoading(true)

      fetch(
        `${BASE_URL}?base=${fromCurrency.value}&symbols=${toCurrency.value}`,
        requestOptions
      )
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates[toCurrency.value])
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('fetch error', error)
        })
    } else if (fromCurrency && toCurrency && firstLoadRef.current) {
      setFirstLoad(false)
    }
  }, [fromCurrency, toCurrency])

  return (
    <>
      {loading && <Loading />}
      {options.length && (
        <>
          <div className='rates-value-wrapper'>
            <Input
              name='value1'
              type='number'
              step={1}
              value={fromAmount}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAmountChange(e, true)
              }
            />
            <Select
              className='rates-select custom-select'
              classNamePrefix='custom-select'
              options={options}
              value={fromCurrency}
              onChange={(opt) => setFromCurrency(opt)}
            />
          </div>

          <div className='rates-value-wrapper'>
            <Input
              name='value2'
              type='number'
              step={1}
              value={toAmount}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAmountChange(e, false)
              }
            />
            <Select
              className='rates-select custom-select'
              classNamePrefix='custom-select'
              options={options}
              value={toCurrency}
              onChange={(opt) => setToCurrency(opt)}
            />
          </div>
        </>
      )}
    </>
  )
}

export default Rates
