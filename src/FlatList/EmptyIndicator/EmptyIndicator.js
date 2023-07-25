import {Fragment} from "../../index";
import css from "./EmptyIndicator.module.css";


export default function EmptyIndicator(props){
    const {parent,message}=props;
    const emptyindicator=Fragment({parent});

    emptyindicator.innateHTML=`
        ${message?`
            <text class="${css.emptymsg}">
                ${typeof(message)==="string"?message:"no data"}
            </text>
        `:""}
    `;

    return emptyindicator;
}
