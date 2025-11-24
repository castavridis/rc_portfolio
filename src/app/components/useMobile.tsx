"use client"

import React, { useState } from 'react'

type MobileContextValue = {}
const defaultValue: MobileContextValue = {}
const MobileContext = React.createContext(defaultValue)
export function MobileProvider (
  {children}: {children: React.ReactNode}
): React.ReactNode {
  // Levels increment from the bottom up
  const [currentLevel, setCurrentLevel] = useState(0)
  // Calder JSON
  const [calderJson, setCalderJson] = useState({})
  // build entire mobile
    // ceiling anchor
      // arm
        // weight a
        // terminus arm
          // weight a
          // weight b

  function handleAddArm () {}
  function handleAddWeight () {}
  function handleAddLevel () {}
  function handleFinishMobile () {}

  const value: MobileContextValue = {}
  return (
    <MobileContext.Provider value={value}>
      {children}
      <button onClick={handleFinishMobile}>Finish Mobile</button>
      <button onClick={handleAddLevel}>Add New Level</button>
      <button onClick={handleAddArm}>Add New Arm</button>
      <button onClick={handleAddWeight}>Add Add Weight</button>
    </MobileContext.Provider>
  )
}
export default function useMobile () {
  const context = React.useContext(MobileContext)
  if (!context) {
    throw new Error('useMobile must be used within MobileProvider')
  }
  return context
}
