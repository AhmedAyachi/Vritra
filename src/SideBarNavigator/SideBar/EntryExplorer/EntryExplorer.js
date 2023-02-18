import {useId,FlatList} from "../../../index";
import css from "./EntryExplorer.module.css";
import EntryView from "./EntryView/EntryView";


export default function EntryExplorer(props){
    const {parent,id=useId("entryexplorer"),entries}=props;
    const entryexplorer=FlatList({
        parent,id,
        className:`${css.entryexplorer} ${props.className||""}`,
        containerClassName:css.container,
        data:entries,
        renderItem:({parent,item})=>EntryView({...props,parent,entry:item}),
    });

    entryexplorer.beforeEndHTML=`
    `;

    return entryexplorer;
}
