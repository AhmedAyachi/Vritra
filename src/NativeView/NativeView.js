import {View} from "../index";
import css from "./NativeView.module.css";


export default function NativeView(props){
    const nativeview=View({...props,className:[css.nativeview,props.className]});

    if(!"rem" in window){
        const {innerWidth}=window;
        Object.defineProperty(window,"rem",{
            value:(innerWidth>=567?1:3)*innerWidth/100,
        });
    }
    return nativeview;
}
