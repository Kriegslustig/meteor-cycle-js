import { Meteor } from 'meteor/meteor'

// import Rx from 'rx'
import { run } from '@cycle/core'
import { makeDOMDriver, button, p, h } from '@cycle/dom'
import storageDriver from '@cycle/storage'

const intent = (DOM) =>
  ({
    more$: DOM.select('button').events('click')
  })

const model = (actions, store) =>
  [
    store.getItem('state'),
    actions.more$
      .withLatestFrom(store.getItem('state'))
      .map(([_, n]) =>
        ({ key: 'state', value: n ? ++n : 1 })
      )
  ]

const view = (state$) =>
  state$.map((n) =>
    h('main', [
      p(`You have clicked the button ${n} times`),
      button('Click Me!')
    ])
  )

const main = (sources) => {
  const [state$, storageRequests$] = model(
    intent(sources.DOM),
    sources.storage.local
  )
  return { DOM: view(state$), storage: storageRequests$ }
}

Meteor.startup(() => {
  const drivers = {
    DOM: makeDOMDriver('#app'),
    storage: storageDriver
  }
  run(main, drivers)
})

