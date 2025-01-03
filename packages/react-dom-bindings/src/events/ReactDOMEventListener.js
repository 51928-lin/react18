import getEventTarget from './getEventTarget'
import {getClosestInstanceFromNode} from '../client/ReactDOMComponentTree'
import { dispatchEventForPluginEventSystem } from './DOMPluginEventSystem';

export function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags){
    const listernerWrapper = dispatchDisCreteEvent;
    return listernerWrapper.bind(null, domEventName,eventSystemFlags,targetContainer)
}

function dispatchDisCreteEvent(domEventName,eventSystemFlags,container, nativeEvent){
    debugger
    dispatchEvent(domEventName,eventSystemFlags,container, nativeEvent)
}

function dispatchEvent(domEventName,eventSystemFlags,targetContainer, nativeEvent){
    const nativeEventTarget = getEventTarget(nativeEvent)
    const targetInst = getClosestInstanceFromNode(nativeEventTarget)
    dispatchEventForPluginEventSystem(
        domEventName,
        eventSystemFlags,
        nativeEvent,
        targetInst,
        targetContainer
      )
}