import { getFiberCurrentPropsFromNode } from "../client/ReactDOMComponentTree";



export default function getListener(instance, registrationName) {
    const {stateNode} = instance;   
    if(stateNode === null){
        return null
    }
    const props = getFiberCurrentPropsFromNode(stateNode)
    if(props === null){
        return null
    }

    const listerner = props[registrationName]
    return listerner
}