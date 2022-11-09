import { CFormGroup, CLabel, CSelect } from '@coreui/react'
// import Select from 'react-select'
import React from 'react'



const CselectField = (props: any) => {
  const { field, label, values, placeholder } = props
  const { name, value } = field
  // const { errors, touched } = form
  // const showError: boolean = !!(errors[name] && touched[name])

  return (
    <CFormGroup>
      {/* <Select
        className='mb-3'
        placeholder='Vui lòng chọn'
        name='color'
        isClearable={true}
        onChange={handleChange}
        options={selectOptions}
      /> */}
      <CLabel htmlFor={name}>{label}</CLabel>
      <CSelect value={null} id={name} {...field} placeholder={placeholder}>
        {values.map((item: { value: string; name: string }, index: number) => (
          <option
            key={index}
            disabled={item.value === ''}
            selected={item.value === value}
            value={item.value}>
            {item.name}
          </option>
        ))}
      </CSelect>
    </CFormGroup>
  )
}

CselectField.propTypes = {}

export default CselectField
