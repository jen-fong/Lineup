import { useState } from 'react'

function useHint () {
  const [hoveredCell, setCell] = useState(null)

  function openHint (datapoint) {
    setCell(datapoint)
  }
  function removeHint () {
    setCell(null)
  }

  return { openHint, removeHint, hoveredCell }
}

export default useHint
