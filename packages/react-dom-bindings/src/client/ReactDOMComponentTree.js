
const randomKey = Math.random().toString(36).slice(2)
const internalInstanceKey = `__reactFiber$${randomKey}`
const interPropsKey = `__reactProps$${randomKey}`

export function precacheFiberNode(hostInst, node){
    node[internalInstanceKey] = hostInst
}

export function updateFiberProps(node, props){
    node[interPropsKey] = props
}

export function getClosestInstanceFromNode(targetNode){
    const targetInst = targetNode[internalInstanceKey]
    return targetInst
}

export function getFiberCurrentPropsFromNode(node){
    return node[interPropsKey] || null
}