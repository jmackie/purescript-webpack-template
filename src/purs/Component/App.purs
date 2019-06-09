module Component.App (create) where

import Base
import React.Basic.Hooks as React
import React.Basic.DOM as DOM
import React.Basic.Events as Events

data Action
  = Increment
  | Decrement

type Props = {}

type State = { counter :: Int }

initialState :: State
initialState = { counter: 0 }

reducer :: State -> Action -> State
reducer state = case _ of
  Increment -> state { counter = state.counter + 1 }
  Decrement -> state { counter = state.counter - 1 }

create :: React.CreateComponent Props
create = do
  React.component "App" \_props -> React.do

    state /\ dispatch <- React.useReducer initialState reducer

    pure $ React.fragment
      [ DOM.button
          { onClick: Events.handler_ (dispatch Decrement)
          , children: [ DOM.text "Decrement" ]
          }
      , DOM.button
          { onClick: Events.handler_ (dispatch Increment)
          , children: [ DOM.text "Increment" ]
          }
      , DOM.div_
          [ DOM.text (show state.counter)
          ]
      ]
