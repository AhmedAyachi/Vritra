import {ViewProps} from "../View/View";


export default function Fragment(props:FragmentProps):CherryFragment;

type FragmentProps=Pick<ViewProps,"parent"|"at">&{
    
};

interface CherryFragment extends DocumentFragment {
    /**
     * Removes All fragment nodes
     */
    remove():void,
}

