import {BsCheckLg} from 'react-icons/bs'

// import {colors} from 'modules'
import {Box} from '../box/box.common'

export const CheckBox = ({
  label,
  name,
  id,
  handleCheckboxChange,
  check,
  labelStyle,

  ...rest
}: Com.CheckBoxProps) => {
  return (
    <div className="checkbox-container">
      <div
        className="checkbox"
        style={{
          justifyContent: label ? 'flex-start' : 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'inherit',
            justifyContent: 'inherit',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          <input
            id={id ?? name}
            name={name}
            type="checkbox"
            checked={check}
            onChange={(e) => {



              console.log('Checkbox changed value hai:',e.target.checked)
              handleCheckboxChange(e.target.checked, e, name)
            }}
            style={{
              top: 0,
              left: 0,
              cursor: 'inherit',
              height: '100%',
              margin: 0,
              opacity: 0,
              padding: 0,
              background: '3px solid red',
              display: 'none',
              zIndex: 1,
              borderRadius: '3px',
              position: 'relative',
              border: '3px solid red'
            }}
            {...rest}
          />
          <label
            htmlFor={id ?? name}
            style={{
              cursor: 'pointer',
              border: `2px solid ${check ? 'green' : 'rgb(241 114 97)'}`,
              borderRadius: 4,
              height: 16,
              width: 16,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              padding: 4
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '16',
                width: '16',
                borderRadius: '9'
              }}
            >
              <BsCheckLg
                fill={check ? 'green' : 'transparent'}
                size={9}
              ></BsCheckLg>
            </Box>
          </label>
        </div>
        {label && (
          <label
            htmlFor={id ?? name}
            style={labelStyle}
            className="checkbox-label"
            dangerouslySetInnerHTML={{__html: label}}
          >
            {/* {label} */}
          </label>
        )}
      </div>
    </div>
  )
}
