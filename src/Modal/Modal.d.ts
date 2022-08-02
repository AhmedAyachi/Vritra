import View from "../View/View";


export default function Modal(props:{
    parent:HTMLElement,
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
    className:String,
    onMount(element:Modal):void,
}):Modal;

interface Modal extends View {
    show(display:String,callback:()=>void):void,
    hide(callback:()=>void):void,
}
