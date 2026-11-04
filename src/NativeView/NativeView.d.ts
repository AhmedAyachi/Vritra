import {ViewTagPropsMap,ViewProps,View} from "../View/View";


/**
 * Same as the View component with a default global styling
 */
export default function NativeView<Tag extends keyof ViewTagPropsMap="div">(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;

