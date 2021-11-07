import {useRef,fadeIn,fadeOut} from "../index";
import css from "./Modal.module.css";


export default function Modal(props){
    const {parent,ref=useRef("modal"),className,onMount,visible=true}=props;
    parent.insertAdjacentHTML("beforeend",`<div id="${ref}" class="${css.modal} ${className||""}" style="${styles.modal}"></div>`);
    const modal=parent.querySelector(`#${ref}`),state={
        fadeduration:0.1,
    };

    modal.innerHTML=`
    `;
    
    visible&&fadeIn(modal,{display:"",duration:state.fadeduration});

    modal.show=(display,callback)=>{
        fadeIn(modal,{display,duration:state.fadeduration},callback);
    }
    modal.hide=(callback)=>{
        fadeOut(modal,0.25,callback);
    }
    onMount&&onMount(modal);
    return modal;
}

const styles={
    modal:`
        display:none;
    `,
}