import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

/**
 * 创建容器，用于将虚拟DOM转换为真实DOM并插入到容器中。
 * @param {*} containerInfo - DOM容器信息。
 * @returns {FiberRoot} - 创建的Fiber根节点。
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器，将虚拟DOM转换为真实DOM并插入到容器中。包含三步，beiginwork，compleltework，commitwork
 * @param {*} element - 虚拟DOM元素。
 * @param {*} container - DOM容器，FiberRootNode。
 */
export function updateContainer(element, container) {
  const current = container.current;
  const update = createUpdate();
  update.payload = { element };
  const root = enqueueUpdate(current, update);
  scheduleUpdateOnFiber(root);
}
