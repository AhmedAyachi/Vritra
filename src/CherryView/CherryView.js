import {View} from "../index";
import css from "./CherryView.module.css";


export default function CherryView(props){
    const cherryview=View({
        ...props,
        className:`${css.cherryview} ${props.className||""}`,
    });

    return cherryview;
}
