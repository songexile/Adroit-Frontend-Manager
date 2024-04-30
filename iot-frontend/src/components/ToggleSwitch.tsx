import React, { useState } from 'react'

interface ToggleSwitchProps {
  text: string
  initialValue?: boolean
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ text, initialValue = false }) => {
  const [isChecked, setIsChecked] = useState(initialValue)

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState)
  }

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div
        className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
          isChecked
            ? 'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full'
            : ''
        } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
        onClick={handleToggle}
      ></div>
      <span className="ms-3 text-sm font-medium ">{text}</span>
    </label>
  )
}

export default ToggleSwitch