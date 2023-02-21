import {useId,View} from "../../index";
import css from "./EmptyIndicator.module.css";


export default function EmptyIndicator(props){
    const {parent,id=useId("emptyindicator"),message}=props;
    const emptyindicator=View({parent,id,className:css.emptyindicator});

    emptyindicator.innateHTML=`
        <p class="${css.emptymsg}">${typeof(message)==="string"?message:"no data"}</p>
    `;



    return emptyindicator;
}
