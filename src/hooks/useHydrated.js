import { useState, useEffect } from 'react'

// False during the server render and the first client render, then true.
// Lets a component hold back markup that can't match the prerendered HTML
// (values derived from the current date/time, `window`, etc.) until after
// hydration, instead of diverging mid-hydration.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
