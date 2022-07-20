import './style.scss'
import './cards.scss'

import { getOffset } from '@area17/a17-helpers'

const wrapper = document.querySelector('.panel-wrapper')
const panels = [...wrapper.querySelectorAll('.panel')]

const headerHeight = 48
const tabs = headerHeight * (panels.length - 1) // at any time theres only that many tabs
let wrapperOffset = getOffset(wrapper)
let scrolPos = window.scrollY
const borderRaidus = 24

const setInitialHeights = () => {
  const windowHeight = window.innerHeight
  let wrapperHeight = 0

  // inital set up get the correct z index and heights
  panels.forEach((elem, index) => {
    // first unset all values
    elem.style.height = `0px`

    // now time to set the correct values
    // make every panel the corect size
    // panels should equal the height of the screen minus the tab height
    const panelHeight = windowHeight - tabs
    elem.style.height = `${panelHeight + borderRaidus}px`

    elem.style.zIndex = `${index + 1}`
    wrapperHeight = wrapperHeight + panelHeight
    if (index !== 0) {
      // how far to pulldown the amount of space
      elem.style.top = `calc( 100% - ${
        tabs - (index - 1) * headerHeight + borderRaidus
      }px)`
    }
  })

  // the height needs all the tabs -1 panel (the first panel doesnt need an offset)
  wrapper.style.height = `${
    wrapperHeight +
    tabs -
    headerHeight * (panels.length - 1) +
    borderRaidus * (panels.length - 1)
  }px`
  wrapperOffset = getOffset(wrapper)
}

setInitialHeights()

const setPanel = (currentPanel, index) => {
  const panelOffset = getOffset(currentPanel)
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
  panelInactiveScrollPos =
    panelActiveScrollPos + panelOffset.height - 48 - borderRaidus

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
      panelOffset.height * -1 + 48 + borderRaidus
    }px)`
  }

  if (scrolPos >= panelActiveScrollPos && scrolPos <= panelInactiveScrollPos) {
    const formatScrollPos = panelActiveScrollPos - scrolPos
    nextPanel.style.transform = `translateY(${formatScrollPos}px)`
  }
}

window.addEventListener('scroll', () => {
  scrolPos = window.scrollY
  panels.forEach((currentPanel, index) => {
    setPanel(currentPanel, index)
  })
})

window.addEventListener('resize', () => {
  scrolPos = window.scrollY
  setInitialHeights()
  panels.forEach((currentPanel, index) => {
    setPanel(currentPanel, index)
  })
})
