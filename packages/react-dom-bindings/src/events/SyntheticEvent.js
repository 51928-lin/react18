const MouseEventInterface = {
    clientX: 0,
    clientY: 0
}

function functionThatReturnsTrue() {
    return true;
  }
  function functionThatReturnsFalse() {
    return false;
  }

function createSyntheticEvent(Interface){
    function syntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget){
        this._reactName = reactName;
        this.type = reactEventType;
        this._targetInst = targetInst;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        for (const propName in Interface) {
            if (!Interface.hasOwnProperty(propName)) {
              continue;
            }
            this[propName] = nativeEvent[propName]
          }
          // 初始状态下，事件的默认行为不被阻止，事件传播也没有被停止
          this.isDefaultPrevented = functionThatReturnsFalse;
          this.isPropagationStopped = functionThatReturnsFalse;
          return this;
    }

    Object.assign(syntheticBaseEvent.prototype, {
        preventDefault(){
            const event = this.nativeEvent;
            if(event.preventDefault){
                event.preventDefault()
            }else{
                event.returnValue = false;
            }
            this.isDefaultPrevented = functionThatReturnsTrue
        },
        stopPropagation(){
            const event = this.nativeEvent;
            if(event.stopPropagation){
                event.stopPropagation()
            }else{
                event.cancelBubble = true
            }
            this.isPropagationStopped = functionThatReturnsTrue
        }
    })

    return syntheticBaseEvent

}

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface)