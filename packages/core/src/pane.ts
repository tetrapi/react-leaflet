import { LayerOptions } from 'leaflet'

import { LeafletContextInterface } from './context'

export function withPane<P extends LayerOptions>(
  props: P,
  context: LeafletContextInterface,
): P {
  // MARK: removing nullish coalescing operators
  // const pane = props.pane ?? context.pane
  const container = (props.pane == null || props.pane == undefined) ? context.pane : props.pane
  return pane ? { ...props, pane } : props
}
