

import { topLevelEventsToReactNames } from '../DOMEventProperties'
import {registerSimpleEvents} from '../DOMEventProperties'
import { IS_CAPTURE_PHASE } from '../EventSystemFlags';
import {SyntheticMouseEvent} from '../SyntheticEvent'
import {accumulateSinglePhaseListeners} from '../DOMPluginEventSystem'
function extractEvents(dispatchQueue,domEventName,targetInst,nativeEvent,nativeEventTarget,eventSystemFlags,targetContainer){
    const reactName = topLevelEventsToReactNames.get(domEventName)
    let SyntheticEventCtor;
    switch(domEventName){
        case 'click':
            SyntheticEventCtor = SyntheticMouseEvent
            break
    }
    const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) != 0
    const listeners = accumulateSinglePhaseListeners(
        targetInst,
        reactName,
        nativeEvent.type,
        isCapturePhase
      );
    if (listeners.length > 0) {
    // 则创建一个新的合成事件
    const event = new SyntheticEventCtor(
        reactName, domEventName, null, nativeEvent, nativeEventTarget);
    // 并将其与相应的监听器一起加入调度队列
    dispatchQueue.push({
        event,
        listeners
    });
    }
    
}
export {registerSimpleEvents as registerEvents, extractEvents}