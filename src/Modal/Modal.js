import {useId,View,fadeIn,fadeOut} from "../index";
import css from "./Modal.module.css";


export default function Modal(props){
    const {parent,ref=useId("modal"),id=ref,className,onMount,visible=true}=props;
    const modal=View({parent,id,className:`${css.modal} ${className||""}`,style:styles.modal}),state={
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