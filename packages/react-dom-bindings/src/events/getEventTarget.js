function getEventTarget(nativeEvent){
    const target = nativeEvent.target || nativeEvent.srcElement
    return target
}

export default getEventTarget