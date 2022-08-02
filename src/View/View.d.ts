 

export default function View(props:{
    parent:HTMLElement,
    id:String,
    className:String,
    style:String,
}):View;

interface View extends HTMLDivElement {
    beforeEndHTML:string,
}
