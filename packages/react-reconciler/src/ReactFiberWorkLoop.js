import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

let workInProgress = null;

/**
 * 在 Fiber 上计划更新根节点。
 * @param {*} root - 根节点。
 */
export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);
}

/**
 * 确保根节点被调度执行。
 * @param {*} root - 根节点。
 */
function ensureRootIsScheduled(root) {
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 执行根节点上的并发工作。
 * @param {*} root - 根节点。
 */
function performConcurrentWorkOnRoot(root) {
  renderRootSync(root);
  // const finishedWork = root.current.alternate;
  // root.finishedWork = finishedWork;
  // commitRoot(root);
}

/**
 * 准备一个新的工作栈。
 * @param {*} root - 根节点。
 */
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

/**
 * 同步渲染根节点。
 * @param {*} root - 根节点。
 */
function renderRootSync(root) {
  prepareFreshStack(root);
  workLoopSync();
}

/**
 * 同步工作循环。
 */
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元。
 * 初始化： next返回的是rootfiber.children, 也就是第一个divfiber，此时next不等于空，让全局workInProgress指向next也就是divfiber
 * performUnitOfWork该函数会一直执行，因为它处在while(workInProgress)循环体中，只要next存在就会一直执行
 * next指向的是父fiber的childfiber节点
 * 
 * 第二次执行完beginwork得到next是divfiber的第一个子节点pfiber
 */
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  workInProgress = null //临时加上，防止死循环 

  // 当next = null，优先深度遍历结束，
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

/**
 * 完成一个工作单元。
 * @param {*} unitOfWork - 工作单元 是深度优先遍历最后一个fiber节点
 */
function completeUnitOfWork(unitOfWork) {

  console.log('开启comleteWork阶段')
}
