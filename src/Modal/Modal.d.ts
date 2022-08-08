import Component from "../Component/Component";


export default function Modal(props:{
    parent:HTMLElement,
    id:String,
    className:String,
    onMount(component:Modal):void,
}):Modal;

interface Modal extends Component {
    show(display:String,callback:()=>void):void,
    hide(callback:()=>void):void,
}
