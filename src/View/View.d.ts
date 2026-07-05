import {RefElement,VritraProps,VritraElement} from "../VritraElement/VritraElement";


export default function View<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;

type ViewProps<Tag>=VritraProps&{
    id?:string,
    /**
     * @default "div"
     */
    tag?:Tag,
};
type View<Tag>=(
    (Tag extends keyof HTMLElementTagNameMap?HTMLElementTagNameMap[Tag]:HTMLDivElement)&
    VritraElement&IView&{
        [ref:string]:RefElement,
    }
);

interface IView {
    /**
     * Inserts the view before or after an element
     * @param element Element before/after which the view is inserted
     * @param before if true the view is inserted before the element otherwise after
     * @default false
     * @returns The current view
     */
    adjacentTo(element:Element,before?:boolean):this;
}

export type ExtendableViewProps<Tag>=Omit<ViewProps<Tag>,"tag">;
