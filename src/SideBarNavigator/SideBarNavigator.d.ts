import {ViewProps,View} from "../View/View";


export default function SideBarNavigator(props:ViewProps&{
    sidebarClassName?:string,
    containerClassName?:string,
    entries:SideBarNavigatorEntry[],
    /**
     * Endpoint color when active
     * @default "dodgerblue"
     */
    tintColor?:string,
    /**
     * @default "black"
     */
    folderColor?:string,
    /**
     * @default rgba(0,0,0,0.35)
     */
    endpointColor?:string,
    onNavigate(currentId:String,previousId:String|null):void,
}):SideBarNavigator;

interface SideBarNavigator extends View {
    /**
     * Toggles the entry with such id
     * 
     * If the entry is a folder, it's expanded.
     * @param entryId 
     * @param triggerOnNavigate default true
     */
    navigate(entryId:string,triggerOnNavigate?:boolean):void,
    getCurrentEntryId():String|null,
    /**
     * 
     * @param shown default: toggling behavior
     */
    toggleSideBar(shown?:boolean):void,
}

type SideBarNavigatorEntry={
    id:string,
    /**
     * If no name is supplied, the id is used as a name
     */
    name?:string,
    icon?:string|((color:String,weight:Number)=>String),
    /**
     * If entries are supplied, the entry is a folder, else an endpoint.
     */
    entries?:SideBarNavigatorEntry[],
    /**
     * Only for endpoint entries
     * @param container Content container
     * @returns The content element
     */
    renderContent:(container:HTMLElement)=>HTMLElement,
    /**
     * If true, the content element returned by renderContent is used
     */
    memorize?:boolean,
}
