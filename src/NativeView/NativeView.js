import {View} from "../index.js";
import css from "./NativeView.module.css";


export default function NativeView(props){
    const nativeview=View({...props,className:[css.nativeview,props.className]});

    if(!Object.hasOwn(window,"rem")){
        const {innerWidth}=window;
        Object.defineProperty(window,"rem",{
            value:innerWidth/(innerWidth<=567?100:300),
        });
    }
    return nativeview;
}
