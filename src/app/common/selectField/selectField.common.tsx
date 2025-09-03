import { useMemo } from 'react'
import Select from 'react-select'
import Theme from 'src/theme'

interface SelectFieldProps {
  data?: any
  isViewing?: boolean
  getOptionLabel?: any
  getOptionValue?: any
  options: any[]
  formatGroupLabel?: any
  onChangeValue?: (arg: any) => void
  isSearchable?: boolean
  isClearable?: boolean
  placeholder?: string
  isLoading?: any
  defaultValue?: any
  isMulti?: any
  value?: any
  isOptionDisabled?: any
  formatOptionLabel?: any
  instanceId?: any
  borderless?: boolean
  isDisabled?: boolean
  onFocus?: any
  fontSize?: any
  width?: string
  containerStyle?: any
}

export const SelectField = ({
  options,
  formatGroupLabel,
  onChangeValue,
  getOptionLabel = 'label',
  getOptionValue = 'id',
  isSearchable,
  isClearable,
  placeholder,
  isLoading,
  defaultValue,
  isMulti,
  value,
  isOptionDisabled,
  formatOptionLabel,
  instanceId = 'react-select',
  borderless,
  isDisabled,
  onFocus,
  fontSize = 14,
  width,
  containerStyle,
  ...props
}: SelectFieldProps) => {
  const selectStyles = {
    valueContainer: (provided: any) => ({
      ...provided,
      height: 'auto',
      flexWrap: 'wrap',
      fontSize,
      width: width
    }),
    control: (styles: any, {isFocused}: {isFocused: boolean}) => ({
      ...styles,
      borderRadius: 4,
      width: width,
      borderColor: borderless
        ? 'transparent'
        : isFocused
        ? Theme.colors.$primary300
        : Theme.colors.$gray200,
      backgroundColor: '#F8F8F8',
      boxShadow: isFocused && 'none',
      '&:hover': {
        borderColor: borderless ? 'transparent' : Theme.colors.$primary100
      },
      fontSize
    }),
    option: (styles: any, {isSelected}: any) => {
      return {
        ...styles,
        backgroundColor: isSelected ? Theme.colors.$primary200 : '#fff',
        '&:hover': {
          backgroundColor: isSelected
            ? Theme.colors.$primary200
            : Theme.colors.$gray200
        },
        fontSize
      }
    },
    indicatorSeparator: (styles: any) => ({
      ...styles,
      display: 'none'
    }),
    menu: (styles: any) => ({
      ...styles,
      zIndex: 100
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: Theme.colors.$gray400
    })
  }

  // Create consistent option label function
  const optionLabel = useMemo(() => {
    if (typeof getOptionLabel === 'string') {
      return (option: any) => `${option[getOptionLabel]}`
    } else if (typeof getOptionLabel === 'function') {
      return getOptionLabel
    }
    return (option: any) => option.label
  }, [getOptionLabel])

  // Create consistent option value function
  const optionValue = useMemo(() => {
    if (typeof getOptionValue === 'string') {
      return (option: any) => `${option[getOptionValue]}`
    } else if (typeof getOptionValue === 'function') {
      return getOptionValue
    }
    return (option: any) => option.id
  }, [getOptionValue])

  // Fix for value reference equality issue
  const selectedValue = useMemo(() => {
    if (!value || !options || options.length === 0) return value

    // For multi-select
    if (isMulti && Array.isArray(value)) {
      return value.map(val => {
        const found = options.find(option => {
          const optionVal = optionValue(option)
          const currentVal = optionValue(val)
          return optionVal === currentVal
        })
        return found || val
      })
    }

    // For single select - find matching option from options array
    const found = options.find(option => {
      const optionVal = optionValue(option)
      const currentVal = optionValue(value)
      return optionVal === currentVal
    })

    return found || value
  }, [value, options, optionValue, isMulti])

  // Debug logging (remove in production)
  console.log('SelectField Debug:', {
    value,
    selectedValue,
    options: options?.length,
    hasMatch: selectedValue !== value
  })

  return (
    <div style={{...containerStyle}}>
      <Select
        formatOptionLabel={formatOptionLabel}
        isOptionDisabled={isOptionDisabled}
        isMulti={isMulti}
        instanceId={instanceId}
        className="selectfield"
        classNamePrefix="react-select"
        styles={selectStyles}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isLoading={isLoading}
        onChange={onChangeValue}
        getOptionLabel={optionLabel}
        getOptionValue={optionValue}
        options={options}
        formatGroupLabel={formatGroupLabel}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={selectedValue}
        onFocus={onFocus}
        {...props}
      />
    </div>
  )
}