import { NoFlags } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import {
    createTextInstance,
    createInstance,
    appendInitialChild,
    finalizeInitialChildren
  } from 'react-dom-bindings/src/client/ReactDOMHostConfig';


function appendAllChildren(parent, workInProgress) {
    const { type, tag, stateNode, sibling, pendingProps, child } = workInProgress

    let node = workInProgress.child;
    while (node) {
      // 这段if elseif 主要处理子节点是原生节点或者函数组件节点
      // 当子节点是原生节点，直接转成真实dom插入父节点
      // 当子节点不是原生节点，并且子节点的子节点不等于空，可能是函数或者类节点，那么把函数节点的child重新赋值，继续判断
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.child !== null) {
        node = node.child;
        continue;
      }
      if (node === workInProgress) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }
        node = node.return;
      }
      node = node.sibling;
    }
  }


export function completework(current, workInProgress){
    console.log('current, workInProgress',current, workInProgress)
    const { type, tag, stateNode, sibling, pendingProps, child } = workInProgress

    const newProps = workInProgress.pendingProps;
    switch(workInProgress.tag){
        // 当completeWork()中workInProgress = rootFiber时，此时真实dom存在rootFiber.stateNode上
        case HostRoot:
            bubbleProperties(workInProgress)
            break;
        // 当fiber节点是原生标签时
        case HostComponent:
            const {type} = workInProgress;
            const instance = createInstance(type, newProps, workInProgress)
            // 当插入子节点时，如果子节点都是原生节点fiber对象，那么statenode就是真实dom，只需要将statenode插入就可以
            appendAllChildren(instance, workInProgress)
            workInProgress.stateNode = instance
            // 如果此时children是数组，那么不会作为属性赋值到dom节点，如果是其他style，自定义属性，则会赋值
            finalizeInitialChildren(instance, type, newProps)
            bubbleProperties(workInProgress)
            break;
        // 当fiber节点是文本时
        case HostText:
            const newText = newProps;
            workInProgress.stateNode = createTextInstance(newText)
            bubbleProperties(workInProgress)
            break;
    }
}

function bubbleProperties(completedWork){
  const { type, tag, stateNode, sibling, pendingProps } = completedWork
    let subtreeFlags = NoFlags;
    let child = completedWork.child;
    while(child != null){
        // 对于父节点而言，child.flags获取直接子节点的变化，二child.subtreeFlags获取子节点树的变化
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags;
        child = child.sibling;
    }
    completedWork.subtreeFlags = subtreeFlags;
}