import React from 'react'
import Select from 'react-select'

class SelectPicker extends React.PureComponent {
  handleChange = option => {
    const { handleChange } = this.props
    handleChange(option)
  }
  render () {
    const { options, selectedOption, name } = this.props

    return (
      <div className='col-md-12'>
        <Select
          name={name}
          options={options.asMutable()}
          value={selectedOption}
          onChange={this.handleChange}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.id}
        />
      </div>
    )
  }
}

export default SelectPicker
