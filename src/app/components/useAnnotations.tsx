"use client"

import React, { useState } from 'react'

type AnnotationsContextValue = {
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDynamic: boolean
  showAnnotations: boolean
  showMass: boolean
  showLocalCom: boolean
  showWorldCom: boolean
  toggleAnnotations: (bool: boolean) => void
  toggleIsDynamic: (bool: boolean) => void
  toggleMass: (bool: boolean) => void
  toggleLocalCom: (bool: boolean) => void
  toggleWorldCom: (bool: boolean) => void
}
const AnnotationsContext = React.createContext(null)
export function AnnotationsProvider(
  {children}: {children: React.ReactNode}
): React.ReactNode {
  const [isDynamic, toggleIsDynamic] = useState(false)
  const [showAnnotations, toggleAnnotations] = useState(true)
  const [showMass, toggleMass] = useState(true)
  const [showLocalCom, toggleLocalCom] = useState(true)
  const [showWorldCom, toggleWorldCom] = useState(true)

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    console.log(name, e.target.checked)
    switch (name) {
      case 'dynamic':
        toggleIsDynamic(!isDynamic)
        break;
      case 'annotation':
        toggleAnnotations(!showAnnotations)
        break;
      case 'mass':
        toggleMass(!showMass)
        break;
      case 'lCom':
        toggleLocalCom(!showLocalCom)
        break;
      case 'wCom':
        toggleWorldCom(!showWorldCom)
        break;
      default:
        break;
    }
  }
  const value: AnnotationsContextValue = {
    handleCheck,
    isDynamic,
    showAnnotations,
    showMass,
    showLocalCom,
    showWorldCom,
    toggleAnnotations,
    toggleIsDynamic,
    toggleMass,
    toggleLocalCom,
    toggleWorldCom,
  }
  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  )
}
export default function useAnnotations () {
  const context = React.useContext(AnnotationsContext)
  if (!context) {
    throw new Error('useAnnotations must be used within AnnotationsProvider')
  }
  return context
}