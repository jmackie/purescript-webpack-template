module Main (main) where

import Base

import Effect.Uncurried (EffectFn1, mkEffectFn1)
import Effect.Exception as Exception
import React.Basic.Hooks as React
import React.Basic.DOM as DOM
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)

import Component.App as App

-- | Entrypoint, to be called from JavaScript land.
main :: EffectFn1 String Unit
main = mkEffectFn1 \elementId -> do
  maybeElement <- getElementById elementId =<<
    (map toNonElementParentNode $ document =<< window)

  case maybeElement of
    Nothing -> Exception.throw "Container element not found!"
    Just element -> do
      app <- App.create
      DOM.render (React.element app {}) element
