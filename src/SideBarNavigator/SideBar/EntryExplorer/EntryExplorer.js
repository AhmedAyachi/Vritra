import {useId,View,FlatList} from "../../../index";
import css from "./EntryExplorer.module.css";
import EntryView from "./EntryView/EntryView";


export default function EntryExplorer(props){
    const {parent,id=useId("entryexplorer"),lazy,entries,onExpanded}=props;
    const entryexplorer=(lazy?FlatList:View)({
        parent,id,
        className:`${css.entryexplorer} ${props.className||""}`,
        ...(lazy&&{
            containerClassName:css.container,
            data:entries,emptymessage:"",
            renderItem:({parent,item})=>EntryView({...props,parent,entry:item}),
            onReachEnd:onExpanded&&(()=>{onExpanded()}),
        }),
    });

    entryexplorer.beforeEndHTML=`
        ${lazy?"":`
            <div class="${css.container}" ref="container"></div>
        `}
    `;

    if(!lazy){
        const {container}=entryexplorer;
        entries.forEach(entry=>{
            EntryView({...props,parent:container,entry});
        });
    }

    return entryexplorer;
}
