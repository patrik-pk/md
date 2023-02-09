import React, { FC } from 'react'

import '../styles/input.scss'

type InputProps = {
  name?: string
  label?: string
  value: string | number
  handleChange: React.ChangeEventHandler<HTMLInputElement>
} & { [key: string]: any }

const Input: FC<InputProps> = ({
  name,
  label,
  value,
  handleChange,
  ...rest
}) => {
  return (
    <div className='input-wrapper'>
      {label && (
        <label className='input-label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className='input'
        id={name}
        name={name}
        value={value}
        {...rest}
        onChange={handleChange}
      />
    </div>
  )
}

export default Input
