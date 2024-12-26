import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { Placement } from "./ReactFiberFlags";
import isArray from "shared/isArray";

/**
 * 创建Child Reconciler的函数
 *
 * @param {boolean} shouldTrackSideEffects - 是否需要跟踪副作用
 * @return {function} reconcileChildFibers - 用于处理子fiber的函数
 *
 * 这个函数会根据传入的shouldTrackSideEffects参数返回一个函数reconcileChildFibers，
 * reconcileChildFibers函数可以根据新旧Fiber进行比较并返回处理结果。
 */
function createChildReconciler(shouldTrackSideEffects) {
  
  /**
   * 将新创建的元素转换为fiber
   * 初始化：返回的是div的fiber节点对象，并且挂在return到父节点上
   */
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  /**
   * 设置副作用
   *
   * @param {Fiber} newFiber - 新创建的Fiber
   * @return {Fiber} newFiber - 返回新创建的Fiber
   */
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  /**
   * 根据新的子节点创建Fiber
   *
   * @param {Fiber} returnFiber - 新的父Fiber
   * @param {object} newChild - 新的子节点
   * @return {Fiber | null} created - 返回新创建的Fiber，或null
   */
  function createChild(returnFiber, newChild) {
    if ((typeof newChild === "string" && newChild !== "") || typeof newChild === "number") {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  /**
   * 为新创建的Fiber设置索引，并在必要时设置副作用
   *
   * @param {Fiber} newFiber - 新创建的Fiber
   * @param {number} newIdx - 新的索引
   */
  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
  }

  /**
   * 将新的子节点数组与旧的子Fiber进行比较，并返回新的子Fiber
   *
   * @param {Fiber} returnFiber - 新的父Fiber
   * @param {Fiber} currentFirstFiber - 老fiber第一个子fiber
   * @param {Array} newChildren - 新的子节点虚拟dom数组
   * @return {Fiber} resultingFirstChild - 返回的新的子Fiber
   */
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null; 
    let previousNewFiber = null; 
    let newIdx = 0;
    for (; newIdx < newChildren.length; newIdx++) {
      // 创建fiber对象，将虚拟dom转换成fiber对象
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      /**
      previousNewFiber = newFiber;
       * 第一次previousNewFiber = null，resultingFirstChild指向第一个fiber节点，previousNewFiber指向第一个fiber节点
       * 第二次previousNewFiber=第一个fiber，previousNewFiber.sibling指向兄弟节点，previousNewFiber指向第二个fiber节点
       * 以此类推previousNewFiber永远指向兄弟中最后一个fiber节点
       * resultingFirstChild永远指向兄弟中第一个fiber节点
       */
      if (previousNewFiber === null) {
        // children数组中，第一次previousNewFiber没有，则将index=0的fiber作为resultingFirstChild
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    // 得到是children虚拟dom转为fiber兄弟节点关系，通过sibling链接，通过retur链接父fiber节点
    return resultingFirstChild;
  }

  /**
   * 对于初次渲染，returnFiber = 新rootfiber，currentFirstFiber = 旧rootfiber.child = null,newChild = 虚拟dom，
   *  此时returnFiber还没有将虚拟dom转成fiber对象，挂载到rootfiber下
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild));
        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  return reconcileChildFibers;
}

//有老的父fiber，更新的时候用这个，对于初始化而言，有current的时候
export const reconcileChildFibers = createChildReconciler(true);
//如果没有老父fiber,初次挂载的时候用这个
export const mountChildFibers = createChildReconciler(false);
