import './style.scss'
import './cards.scss'

import { getOffset } from '@area17/a17-helpers'

const wrapper = document.querySelector('.panel-wrapper')
const panels = [...wrapper.querySelectorAll('.panel')]

const windowHeight = window.innerHeight
const headerHeight = 48
const tabs = headerHeight * (panels.length - 1) // at any time theres only that many tabs

let wrapperHeight = 0
// inital set up get the correct z index and heights
panels.forEach((elem, index) => {
  // make every panel the corect size
  // panels should equal the height of the screen minus the tab height
  const panelHeight = windowHeight - tabs
  elem.style.height = `${panelHeight}px`

  elem.style.zIndex = `${index + 1}`
  wrapperHeight = wrapperHeight + panelHeight
  if (index !== 0) {
    // how far to pulldown the amount of space
    elem.style.top = `calc( 100% - ${tabs - (index - 1) * headerHeight}px)`
  }
})

// the height needs all the tabs -1 panel (the first panel doesnt need an offset)
wrapper.style.height = `${
  wrapperHeight + tabs - headerHeight * (panels.length - 1)
}px`
const wrapperOffset = getOffset(wrapper) // top 696

console.log('wrapper offset ', wrapperOffset)

panels.forEach((currentPanel, index) => {
  const panelOffset = getOffset(currentPanel)
  let scrolPos = 0
  // get the amount to the top of the page per item
  let panelActiveScrollPos = 0
  let panelInactiveScrollPos = 0

  panels.forEach((nestedElem, nestedIndex) => {
    if (nestedIndex < index) {
      panelActiveScrollPos =
        panelActiveScrollPos +
        getOffset(nestedElem).height -
        (index === 0 ? 0 : 48)
    }
  })
  panelActiveScrollPos = panelActiveScrollPos + wrapperOffset.top
  panelInactiveScrollPos = panelActiveScrollPos + panelOffset.height - 48

  window.addEventListener('scroll', () => {
    scrolPos = window.scrollY

    // we animated next panel
    // grab that content and transfrom it
    const nextIndex = index + 1
    const nextPanel = panels[nextIndex]
    if (!nextPanel) return

    if (scrolPos < panelActiveScrollPos) {
      nextPanel.style.transform = `translateY(0px)`
    }

    if (scrolPos > panelInactiveScrollPos) {
      nextPanel.style.transform = `translateY(${
        panelOffset.height * -1 + 48
      }px)`
    }

    if (
      scrolPos >= panelActiveScrollPos &&
      scrolPos <= panelInactiveScrollPos
    ) {
      const formatScrollPos = panelActiveScrollPos - scrolPos
      nextPanel.style.transform = `translateY(${formatScrollPos}px)`
    }
  })
})
