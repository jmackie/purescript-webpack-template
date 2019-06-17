module Main (main) where

import Base  -- custom prelude (recommended for non-trivial apps)

import Control.Monad.Except (runExcept)
import Data.Semigroup.Foldable (intercalateMap)
import Effect.Console as Console
import Effect.Exception as Exception
import Effect.Uncurried (EffectFn1, mkEffectFn1)
import Foreign (Foreign)
import Foreign as Foreign
import Foreign.Index as Foreign.Index
import React.Basic.DOM as DOM
import React.Basic.Hooks as React
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)

import Component.App as App

type Flags =
  { domElementId :: String  -- where to mount the app
  , apiUrl       :: String  -- service to query
  }

parseFlags :: Foreign -> Either Foreign.MultipleErrors Flags
parseFlags value = runExcept ado
  -- NOTE: this doesn't currently give the nicest error messages,
  -- could be improved.
  domElementId <- Foreign.Index.readProp "domElementId" value >>= Foreign.readString
  apiUrl <- Foreign.Index.readProp "apiUrl" value >>= Foreign.readString
  in { domElementId, apiUrl }

-- | Entrypoint, to be called from JavaScript land.
main :: EffectFn1 Foreign Unit
main = mkEffectFn1 \value -> do
  flags <- parseFlags value #
    either
    (\errs -> Exception.throw ("Error parsing flags: " <> renderForeignErrors errs) )
    pure

  maybeElement <- getElementById flags.domElementId =<<
    (map toNonElementParentNode $ document =<< window)

  Console.log ("pretending to make a request to " <> flags.apiUrl)

  case maybeElement of
    Nothing -> Exception.throw "Container element not found!"
    Just element -> do
      app <- App.create
      DOM.render (React.element app {}) element

renderForeignErrors :: Foreign.MultipleErrors -> String
renderForeignErrors = intercalateMap ": " Foreign.renderForeignError
