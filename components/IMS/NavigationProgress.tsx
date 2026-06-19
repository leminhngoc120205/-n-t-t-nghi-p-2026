'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function NavigationProgress() {
  return (
    <AppProgressBar
      height="3px"
      color="#17a2b8"
      options={{ showSpinner: false, easing: 'ease', speed: 300 }}
      shallowRouting
    />
  )
}
