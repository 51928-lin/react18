// EventRegistry文件导出set结构
import {allNativeEvents} from './plugins/EventRegistry'
import {IS_CAPTURE_PHASE} from './EventSystemFlags'

import { createEventListenerWrapperWithPriority } from './ReactDOMEventListener';
import {
  addEventCaptureListener,
  addEventBubbleListener
} from './EventListerner'

import * as SimpleEventPlugin from './plugins/SimpleEventPlugin'
SimpleEventPlugin.registerEvents()
import getListener from './getListener'
import { HostComponent } from 'react-reconciler/src/ReactWorkTags';
import getEventTarget from './getEventTarget';

const listeringMarker = `_reactListening${Math.random().toString(36).slice(2)}`

export function listenToAllSupportedEvents(rootContainerElement){
    if(!rootContainerElement[listeringMarker]){
        rootContainerElement[listeringMarker] = true
        allNativeEvents.forEach(domEventName => {
            listenToNativeEvent(domEventName, true, rootContainerElement)
            listenToNativeEvent(domEventName, false, rootContainerElement)
        })
    }
}

 function listenToNativeEvent(domEventName, isCapturePhaseListerner, target){
    let eventSystemFlags = 0;
    if(isCapturePhaseListerner){
        eventSystemFlags |= IS_CAPTURE_PHASE
    }
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListerner);
 }

 function addTrappedEventListener(
     targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener
    ) {
      // 创建带有优先级的事件监听器
      const listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
      // 根据监听阶段选择合适的添加监听函数
      if (isCapturePhaseListener) {
        addEventCaptureListener(targetContainer, domEventName, listener);
      } else {
        addEventBubbleListener(targetContainer, domEventName, listener);
      }
    }

  export function dispatchEventForPluginEventSystem( domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
    dispatchEventForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer)
  }

  function dispatchEventForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
    const nativeEventTarget = getEventTarget(nativeEvent);
    const dispatchQueue = [];
    // 提取事件
    extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer
    );
    processDispatchQueue(dispatchQueue, eventSystemFlags);

  }

  function extractEvents(dispatchQueue,domEventName,targetInst,nativeEvent,nativeEventTarget,eventSystemFlags,targetContainer) {
    SimpleEventPlugin.extractEvents(dispatchQueue,domEventName,targetInst,nativeEvent,nativeEventTarget,eventSystemFlags,targetContainer);
  }

  function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
    for (let i = 0; i < dispatchQueue.length; i++) {
      const { event, listeners } = dispatchQueue[i];
      // 按顺序处理分发队列中的项目
      processDispatchQueueItemsInOrder(event, listeners, isCapturePhase);
    }
  }


  function processDispatchQueueItemsInOrder(event, dispatchListeners, isCapturePhase) {
    if (isCapturePhase) {
      for (let i = dispatchListeners.length - 1; i >= 0; i--) {
        const { listener, currentTarget } = dispatchListeners[i];
        if (event.isPropagationStopped()) {
          return;
        }
        executeDispatch(event, listener, currentTarget);
      }
    } else {
      for (let i = 0; i < dispatchListeners.length; i++) {
        const { listener, currentTarget } = dispatchListeners[i];
        if (event.isPropagationStopped()) {
          return;
        }
        executeDispatch(event, listener, currentTarget);
      }
    }
  }

  function executeDispatch(event, listener, currentTarget) {
    event.currentTarget = currentTarget;
    listener(event);
  }


  export function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, isCapturePhase) {
    const captureName = reactName + 'Capture';
    const reactEventName = isCapturePhase ? captureName : reactName;
    const listerners = [];
    let instance = targetFiber;
    while(instance != null){
      const {stateNode, tag} = instance;
      if(tag === HostComponent && stateNode !== null){
        const listerner = getListener(instance, reactEventName)
        if(listerner){
          listerners.push(createDispatchListener(instance, listerner, stateNode))
        }
      }
      instance = instance.return
    }
    return listerners
  }


  function createDispatchListener(instance, listener, currentTarget) {
    return { instance, listener, currentTarget }
  }