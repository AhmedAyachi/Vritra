import {useId} from "../index";


export default class Component {
    constructor(props){
        const {id=useId("view"),className,style,position="beforeend"}=props,parentEl=getParentEl(props.parent);
        parentEl.insertAdjacentHTML(position,`<div id="${id}" ${className?`class="${className}"`:""} ${style?`style="${style}"`:""}></div>`);
        const element=parent.querySelector(`#${id}`);
        Object.defineProperties(this,[
            ["element",{value:element}],
            ["parentNode",{value:element.parentNode}],
            ["querySelector",({value:(selector)=>{element.querySelector(selector)}})],
            ["querySelectorAll",({value:(selector)=>{element.querySelectorAll(selector)}})],
            ["replaceWith",{value:(...nodes)=>{element.replaceWith(...nodes)}}],
            ["insertAdjacentHTML",{value:(position,html)=>{element.insertAdjacentHTML(position,html)}}],
            ["insertAdjacentElement",{value:(position,node)=>{element.insertAdjacentElement(position,node)}}],
            ["innerHTML",({set:(html)=>{element.innerHTML=html}})],
            ["beforeEndHTML",({set:(html)=>{element.insertAdjacentHTML("beforeend",html)}})],
            ["remove",{value:()=>{element.remove()}}],
        ]);
    }
}

const getParentEl=(parent)=>parent instanceof Component?parent.element:parent;
