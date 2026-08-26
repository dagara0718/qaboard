import type { TextareaHTMLAttributes } from 'react'
import './Field.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  id: string
  maxLength: number
  error?: string
}

export function Textarea({
  label,
  id,
  maxLength,
  error,
  value,
  className = '',
  ...rest
}: TextareaProps) {
  const length = typeof value === 'string' ? value.length : 0
  const warn = length > maxLength * 0.8

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={`field-input field-textarea ${error ? 'field-input-error' : ''} ${className}`}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : `${id}-count`}
        {...rest}
      />
      <div className="field-footer">
        <span
          id={`${id}-error`}
          className="field-error show"
          style={{ display: error ? 'inline' : 'none' }}
        >
          {error}
        </span>
        <span id={`${id}-count`} className={`field-char-count ${warn ? 'warn' : ''}`}>
          {length} / {maxLength}
        </span>
      </div>
    </div>
  )
}
