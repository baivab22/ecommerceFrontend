import React, { useState, useRef, useEffect } from 'react'
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BiSearch } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styled from 'styled-components'
import { colors } from 'src/modules'
import { Box } from '../box/box.common'
import { Text } from '../text/text.common'

// ─────────────────────────────────────────────
// InputField
// ─────────────────────────────────────────────

export const InputField = React.forwardRef<HTMLInputElement, Com.InputFieldProps>(
  (props, ref) => {
    const {
      name,
      defaultValue,
      placeholder,
      style,
      onChange,
      className,
      type,
      inputType,
      disabled,
      autofocus,
      dateMax,
      dateMin,
      readonly,
      error,
      containerStyle,
      max,
      ...rest
    } = props

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value

      // Prevent leading whitespace
      if (/^\s/.test(val)) return

      // Validate by inputType
      if (inputType === 'nonZero' && !/^[1-9]*$|^[1-9][0-9]*$/.test(val)) return
      if (inputType === 'citizen' && !/^[(0-9a-z-/,)]*$/i.test(val)) return
      if (inputType === 'numSymbol' && !/^[(0-9a-z-/)]*$/i.test(val)) return
      if (inputType === 'alphanumeric' && !/^[0-9A-Za-z]*$/.test(val)) return
      if (type === 'tel' && !/^[0-9]*$/.test(val)) return

      onChange(e)
    }

    const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      let maxNum: number | undefined = undefined;
      if (typeof max === 'string') {
        const parsed = parseInt(max, 10);
        if (!isNaN(parsed)) maxNum = parsed;
      } else if (typeof max === 'number') {
        maxNum = max;
      }
      if (typeof maxNum === 'number' && target.value.length > maxNum) {
        target.value = target.value.slice(0, maxNum);
      }
      if (Number(target.value) < 0) {
        target.value = '0';
      }
    }

    return (
      <div className="input-field-container" style={containerStyle}>
        <input
          name={name}
          ref={ref}
          defaultValue={defaultValue as string | number}
          onChange={handleChange}
          style={{ ...style, borderColor: error ? 'red' : undefined }}
          className={[
            'inputfield body',
            className,
            disabled ? 'disabled' : '',
            type === 'password' ? 'password' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          placeholder={placeholder}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          onInput={type === 'number' ? handleNumberInput : undefined}
          max={dateMax}
          min={dateMin}
          disabled={disabled}
          autoFocus={autofocus}
          readOnly={readonly}
          {...rest}
        />

        {type === 'password' && (
          <Box
            className="password-icon"
            flexBox
            alCenter
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </Box>
        )}

        {error && <div className="input-error">{error}</div>}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

// ─────────────────────────────────────────────
// TextArea
// ─────────────────────────────────────────────

export const TextArea = React.forwardRef<HTMLTextAreaElement, Com.TextAreaProps>(
  (props, ref) => {
    const { className, disabled, cols = 40, rows = 5, ...rest } = props

    return (
      <textarea
        ref={ref}
        cols={cols}
        rows={rows}
        className={['inputfield', className, disabled ? 'disabled' : '']
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        {...rest}
      />
    )
  }
)

TextArea.displayName = 'TextArea'

// ─────────────────────────────────────────────
// FormInput
// ─────────────────────────────────────────────

export const FormInput = ({
  children,
  label,
  newElement,
  required,
  style,
}: Com.FormInputProps) => {
  return (
    <Box flexBox vertical rg={4} style={style}>
      <Box flexBox alCenter jSpace>
        <Text body style={{ fontWeight: 500 }}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Text>
        <Text style={{ fontSize: '14px', color: colors.text.secondary }}>
          {newElement}
        </Text>
      </Box>
      {children}
    </Box>
  )
}

// ─────────────────────────────────────────────
// SearchField — Styled components
// ─────────────────────────────────────────────

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(33, 127, 219, 0.06);
  padding: 0 10px 0 0;
  min-height: 44px;
  width: 100%;
  transition: box-shadow 0.2s;

  &:focus-within {
    box-shadow: 0 2px 8px 0 rgba(33, 127, 219, 0.13);
  }
`

const StyledSearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.08rem;
  padding: 12px 8px 12px 16px;
  outline: none;
  color: #222;
  border-radius: 8px 0 0 8px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.4rem;
  color: #217fdb;
  transition: color 0.2s;

  &:hover {
    color: #60afff;
  }

  &:disabled {
    color: #bdbdbd;
    cursor: not-allowed;
  }
`

const ListeningText = styled.span`
  margin-left: 8px;
  color: #217fdb;
  font-weight: 500;
  font-size: 13px;
`

const ErrorText = styled.span`
  margin-left: 8px;
  color: #e53e3e;
  font-weight: 500;
  font-size: 13px;
`

// ─────────────────────────────────────────────
// SearchField
// ─────────────────────────────────────────────

export const SearchField = React.forwardRef<HTMLInputElement, Com.SearchInputProps>(
  (props, ref) => {
    const { className, disabled, containerStyle, onChange, value: propValue, ...rest } = props

    const [listening, setListening] = useState(false)
    const [error, setError] = useState('')
    const [value, setValue] = useState<string>(
      typeof propValue === 'string'
        ? propValue
        : typeof propValue === 'number'
        ? String(propValue)
        : Array.isArray(propValue)
        ? propValue.join(', ')
        : ''
    )
    const recognitionRef = useRef<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync with controlled value
    useEffect(() => {
      if (typeof propValue === 'string' && propValue !== value) {
        setValue(propValue)
      }
    }, [propValue])

    const mergedRef = (node: HTMLInputElement) => {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      inputRef.current = node
    }

    useEffect(() => {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognitionAPI) return

      const recognition = new SpeechRecognitionAPI()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setValue(transcript)
        if (onChange) {
          onChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>)
        }
        setListening(false)
        setError('')
      }

      recognition.onerror = () => {
        setError('Voice search error')
        setListening(false)
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
    }, [onChange])

    const handleMicClick = () => {
      if (!recognitionRef.current) return

      if (listening) {
        setValue('')
        if (onChange) onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
        recognitionRef.current.stop()
      } else {
        setError('')
        setListening(true)
        recognitionRef.current.start()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      if (onChange) onChange(e)
    }

    return (
      <SearchBarContainer style={containerStyle}>
        <StyledSearchInput
          ref={mergedRef}
          className={['inputfield body', className, disabled ? 'disabled' : '']
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          {...rest}
        />

        <IconButton
          type="button"
          tabIndex={-1}
          disabled={disabled}
          style={{ marginRight: 2, fontSize: '1.3rem' }}
        >
          <BiSearch />
        </IconButton>

        <IconButton
          type="button"
          className="mic-icon"
          onClick={disabled ? undefined : handleMicClick}
          title={listening ? 'Listening...' : 'Voice Search'}
          disabled={disabled}
          style={{ marginLeft: 0, fontSize: '1.4rem' }}
        >
          {listening ? (
            <BiMicrophoneOff style={{ animation: 'pulse 1s infinite' }} />
          ) : (
            <BiMicrophone />
          )}
        </IconButton>

        {listening && <ListeningText>Listening...</ListeningText>}
        {error && <ErrorText>{error}</ErrorText>}
      </SearchBarContainer>
    )
  }
)

SearchField.displayName = 'SearchField'