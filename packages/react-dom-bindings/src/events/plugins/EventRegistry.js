// 导出，是给Dompluginineventsystem中使用
export const allNativeEvents = new Set()

// 该方法导出给domeventproperties中使用
export function registerTwoPhaseEvent(registrationName, dependencies){
    registerDirectEvent(registrationName, dependencies)
    registerDirectEvent(registrationName + 'Capture', dependencies)
}

export function registerDirectEvent(registrationName, dependencies){
    for(let i = 0; i < dependencies.length; i++){
        allNativeEvents.add(dependencies[i])
    }
}