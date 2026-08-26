import type { InputHTMLAttributes } from 'react'
import './Field.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
}

export function Input({ label, id, error, className = '', ...rest }: InputProps) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`field-input ${error ? 'field-input-error' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="field-error show">
          {error}
        </span>
      )}
    </div>
  )
}
