import { InteractiveLayerOptions, Layer, LayerOptions } from 'leaflet'
import { useEffect } from 'react'

import { useAttribution } from './attribution'
import { LeafletContextInterface, useLeafletContext } from './context'
import { LeafletElement, ElementHook } from './element'
import { EventedProps, useEventHandlers } from './events'
import { withPane } from './pane'

export interface LayerProps extends EventedProps, LayerOptions {}
export interface InteractiveLayerProps
  extends LayerProps,
    InteractiveLayerOptions {}

export function useLayerLifecycle(
  element: LeafletElement<Layer>,
  context: LeafletContextInterface,
) {
  useEffect(
    function addLayer() {
      // MARK: removing nullish coalescing operators
      // const container = context.layerContainer ?? context.map
      const container = (context.layerContainer == null || context.layerContainer == undefined) ? context.map : context.layerContainer

      container.addLayer(element.instance)

      return function removeLayer() {
        context.layerContainer?.removeLayer(element.instance)
        context.map.removeLayer(element.instance)
      }
    },
    [context, element],
  )
}

export function createLayerHook<E extends Layer, P extends LayerProps>(
  useElement: ElementHook<E, P>,
) {
  return function useLayer(props: P): ReturnType<ElementHook<E, P>> {
    const context = useLeafletContext()
    const elementRef = useElement(withPane(props, context), context)

    useAttribution(context.map, props.attribution)
    useEventHandlers(elementRef.current, props.eventHandlers)
    useLayerLifecycle(elementRef.current, context)

    return elementRef
  }
}
