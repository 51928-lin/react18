import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completework } from "./ReactFiberCompleteWork"
import { MutationMask, NoFlags } from "./ReactFiberFlags";
import {commitMutationEffectsOnFiber} from './ReactFiberCommitWork'
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
  // 当完成同步任务之后，将新rootFiber树赋值给finishedwork
  root.finishedWork  = root.current.alternate;
  console.log('commitRoot',commitRoot)
  commitRoot(root);
}

/**
 * 当同步任务执行完成，则finishedwork完成挂载，指向新的rootfiber
 */
function commitRoot(root){
  const {finishedWork} = root;
  // MutationMask此时记录两种操作，插入或者更新，如果subtreeFlags是任何一种，那么与完肯定有结果，不为0
  const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask ) != NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) != NoFlags;
  if(subtreeHasEffect || rootHasEffect){
    // 提交副作用
    commitMutationEffectsOnFiber(finishedWork, root)
  }
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
 * 作用： 
 *  1. 不断处理workingprogress指向的fiber节点，通过beginwork将所有子节点转为fiber节点，但是返回第一个子节点， 如果子节点存在赋值给workInProgress，
 *     performUnitOfWork执行完成，回到while循环中，根据第一个fiber子节点，不断向下获取最后一个fiber节点
 */
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 当next = null，优先深度遍历结束，执行到此，说明深度优先遍历完成虚拟dom到fiber节点
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

/**
 *  作用：内部循环为了构建父子节点关系
 *   1. 当next为null，说明最后一个fiber节点，然后开始将fiber节点转为真实dom节点，需要明白需求，转真实dom的顺序，先子节点，兄弟，父节点
 *      当有了顺序，旧需要个指针随时变化，
 */
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork 
  const { type, tag, stateNode, sibling, pendingProps, child } = completedWork
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // 执行结果就是fiber.statenode = dom真实节点
    completework(current, completedWork);
    // 当兄弟节点存在，将兄弟节点赋值workInProgress，才能继续将当前节点子节点转成fiber对象
    const siblingFiber = completedWork.sibling;
    if(siblingFiber != null){
      workInProgress = siblingFiber
      return ;
    }
    // 当第一个转dom后，如果没有兄弟节点，应该指向上一个，如果有兄弟节点，指向兄弟节点
    completedWork = returnFiber;
    workInProgress = completedWork;
  }while(completedWork != null)
}
