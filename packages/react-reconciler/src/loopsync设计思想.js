
let workInProgress = null

function workloopsync(){
    while(workInProgress != null){
        performance()
    }
}
// 当performance函数执行完成后，是while内部循环体完成，但是workloopsync函数还没完成执行
function performance(){
    let res = beginWork()
    if(res === null){
        // 执行到此，说明深度优先遍历完成虚拟dom到fiber节点
        completework()
    }else{
        workInProgress = res
    }
}

function beginWork(){

}

function completework(){
    // 

}