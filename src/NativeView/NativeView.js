import {View} from "../index";
import css from "./NativeView.module.css";


export default function NativeView(props){
    const nativeview=View({
        ...props,
        className:`${css.nativeview} ${props.className||""}`,
    });

    return nativeview;
}
