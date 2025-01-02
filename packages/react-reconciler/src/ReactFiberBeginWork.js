import { FunctionComponent, HostComponent, HostRoot, HostText, IndeterminateComponent } from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import {renderWithHooks} from 'react-reconciler/src/ReactFiberHooks'
/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * 对于fiber节点中children是一个{children: text}文本，workInProgress.child = null
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    // 将新fiber节点上的pendingprops也就是虚拟children的dom转成 父与第一个子fiber通过child与renturn关联，child兄弟通过sibling关联
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // nextChildren来源不是从updatequeue中，因为在遍历while循环已经将updatequeue.shared.pending = null
    // nextChildren来源是memoizedState中（经过老memoizedstate与update合并之后保存的）
    // 当渲染完div这个fiber后，挂载到rootfiber的child下
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  }
}

/**
 * 更新HostRoot类型的Fiber节点
 * @param {FiberNode} current - 老的Fiber节点
 * @param {FiberNode} workInProgress - 新的Fiber节点
 * @returns {FiberNode} 新的子Fiber节点
 */
function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress);
  // 合并后的虚拟dom，新fiber节点之前的memoizedState与update中的进行object.assign合并
  const nextState = workInProgress.memoizedState;
  // 获取最新的虚拟dom
  const nextChildren = nextState.element;
  reconcileChildren(current, workInProgress, nextChildren);
  // 返回的是第一个divfiber节点，返回给了beginwork中switch=hostroot判断
  return workInProgress.child;
}

/**
 * current是新fiber节点对应的旧fiber节点，
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  // nextProps是新fiber节点的虚拟dom集合
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  // workInProgress每次都会向下修改指向
  // 对于 workInProgress 如果是最后一层 <p>aaa</p>, nextChildren因为是text，所以被设置null
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function mountIndeterminateComponent(current, workInProgress, Component){
  const props = workInProgress.pendingProps;
  const value = renderWithHooks(current, workInProgress,Component,props);
  workInProgress.tag = FunctionComponent
  reconcileChildren(current, workInProgress, value)
  return workInProgress.child
}

/**
 *  1. current= rootFiber, workInProgress = rootFiber, 但是current === workInProgress => false;
 */
export function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, workInProgress.type)
    case HostRoot:
      // 这里返回的是hostroot的fiber节点，也就是新rootfiber节点
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
