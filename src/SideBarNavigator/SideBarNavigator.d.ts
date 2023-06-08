import {ExtendableViewProps,View} from "../View/View";
import {CherryIcon} from "../ActionSetView/ActionSetView";


export default function SideBarNavigator(props:SideBarNavigatorProps):SideBarNavigator;

interface SideBarNavigatorProps extends ExtendableViewProps<"div"> {
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
    /**
     * @default "dark"
     */
    sideBarScrollTheme:"light"|"dark",
    onNavigate(
        current:{id:String,name:String},
        previousId:{id:String,name:String}|null,
    ):void,
}

interface SideBarNavigator extends View<"div"> {
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
    /**
     * Should be unique among all entries
     */
    id:string,
    /**
     * If no name is supplied, the id is used as a name
     */
    name?:string,
    icon?:CherryIcon,
    /**
     * If entries are supplied, the entry is a folder, else an endpoint.
     */
    entries?:SideBarNavigatorEntry[],
    /**
     * Only for endpoint entries
     * @param container Content container
     * @returns The content element
     */
    renderContent(container:HTMLElement):HTMLElement,
    /**
     * If true, the content element returned by renderContent is used
     * @default true
     */
    memorize?:boolean,
    /**
     * For folder entries only.
     * 
     * Parent-folders are automatically expanded
     * @default false
     * @see If the first entry is a folder entry, it's expanded by default
     */
    expanded?:boolean,
}
