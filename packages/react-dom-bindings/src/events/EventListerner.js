

export function addEventCaptureListener(target, eventType, listener) {
    // 调用目标元素的 addEventListener 方法，添加捕获阶段的事件监听器
    target.addEventListener(eventType, listener, true);
    
    // 返回添加的监听器函数
    return listener;
  }


  export function addEventBubbleListener(target, eventType, listener) {
    // 调用目标元素的 addEventListener 方法，添加冒泡阶段的事件监听器
    target.addEventListener(eventType, listener, false);
    
    // 返回添加的监听器函数
    return listener;
  }