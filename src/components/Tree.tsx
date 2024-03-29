import React, { Fragment, useEffect, useState, useRef, DragEvent, MutableRefObject } from 'react';
import { Dispatch } from "redux"
import { useSelector, useDispatch } from 'react-redux';
import { setItemInMove, setInsertDestination } from '../store/actions'
import { useAppSelector } from '../hooks/storeHooks';


type treeProps = {
    members: dragList[];
    listId?: string;
    updateRoot?: (action: string, selectedItem: itemInMove, target: Element) => void;
    onChange?: (message: string) => void;
    passedTimer?: MutableRefObject<NodeJS.Timeout | null>;
};


const Tree: React.FC<treeProps> = ({members, listId='master-list', updateRoot, onChange, passedTimer}) => {

    const [membersCopy, setMembersCopy] = useState<dragList[]>(members);
    const [openState, setOpenState] = useState<{[key:string]: boolean}>({});
    const [dropAction, setDropAction] = useState<boolean>(false);

    const itemInMove = useAppSelector(state => state.movingItem);
    const insertDestination = useAppSelector(state => state.insertDestination);

    const timer = useRef<NodeJS.Timeout | null>(null);
    const masterTimer: MutableRefObject<NodeJS.Timeout | null> = passedTimer || timer;
    const dispatch = useDispatch<Dispatch<any>>();


    useEffect(() =>{
        setMembersCopy(members);
    },[members])


    const updateRootFunction = (action: string, selectedItem: itemInMove, target: Element): void => {
        const nestedListsRootClone: dragList[] = [...membersCopy]
        if (action === "insert") {
            deleteElement(nestedListsRootClone, selectedItem.data);
            insertElement(nestedListsRootClone, selectedItem.data, target.id, 'child');
            setMembersCopy(nestedListsRootClone);
        } else if (action === "order") {
            deleteElement(nestedListsRootClone, selectedItem.data);
            (target.parentElement !== null && target.parentElement.tagName === 'UL') &&
                insertElement(nestedListsRootClone, selectedItem.data, target.id, 'sibling', getListItemIndex(target));
                setMembersCopy(nestedListsRootClone);
        }
        dispatch(setItemInMove({ origin: "", invalidDestinations: [], data: {name: "", value: "", children: []} }));
        dispatch(setInsertDestination(""));
    };
    const updateRootAction: (action: string, selectedItem: itemInMove, target: Element) => void = updateRoot || updateRootFunction;


    const getListItemIndex = (target: Element): number => {
        let itemIndex: number = 0;
        while ( target.previousElementSibling ) {
            target = target.previousElementSibling;
            itemIndex += 1;   
        }
        return itemIndex;
    }


    const insertElement = (rootlist: dragList[], objectToAdd: dragList, insertionPoint: string, heirachy?: string, siblingPoint?: number): void => {
        let loopCondition: boolean = true;
        rootlist.forEach((element: dragList, index: number, parentList: dragList[]) => {
            if (loopCondition) {
                if (element.name === insertionPoint) {
                    if (heirachy === 'child') {
                        hasChildren(element) ?
                            parentList.splice(index, 1, {...element, children:[...element.children!, objectToAdd]}) :
                            parentList.splice(index, 1, {...element, children:[objectToAdd]})
                    } else {
                        parentList.splice(siblingPoint!, 0, objectToAdd);
                        loopCondition = false;
                    }
                } else {
                    (element.children != null) && insertElement(element.children, objectToAdd, insertionPoint, heirachy, siblingPoint);
                }
            }
        })
    }


    const deleteElement = (rootlist: dragList[], objectToRemove: dragList): void => {
        rootlist.forEach((element: dragList, index: number, parentList: dragList[]) => {
            if (element === objectToRemove) {
                parentList.splice(index, 1);
            } else {
                (element.children != null) && deleteElement(element.children, objectToRemove);
            }
        })
    }


    const hasChildren = (member: dragList): boolean => {
        return Object.keys(member).length > 0 && member.constructor === Object && member.children != null;
    }


    const expand = (list: string): void => {
        setOpenState({...openState, [list]: !openState[list]});
    }


    function getDescendants(source: string): string[] {
        const parentList = document.querySelector("#"+source)
        if (parentList !== null) {
            const invalidDescendants: string[] = [];
            const descendants: NodeListOf<Element> = (parentList.querySelectorAll("*"));
            if (descendants !== null) {
                descendants.forEach(function(descendant) {
                    invalidDescendants.push(descendant.id);
                });
                return invalidDescendants;
            }
        }
        return [];
    }


    const outOfBoundsDrop = (): void => {
        dispatch(setItemInMove({ origin: "", invalidDestinations: [], data: {name: "", value: "", children: []} }));
    }


    const dragHandle = (e: DragEvent<HTMLUListElement>): void => {
        e.stopPropagation();
        e.preventDefault();
    }


    const dragStartHandle = (e: DragEvent<HTMLLIElement>, list: dragList): void => {
        document.addEventListener("dragend", outOfBoundsDrop);
        const target: Element = e.target as Element;
        const source: string = target.id+"-list";
        const invalidDestinations = (getDescendants(source));
        dispatch(setItemInMove({
            origin: target.id,
            invalidDestinations: invalidDestinations,
            data: list,
        }));
    }


    const dragenter = (e: DragEvent<HTMLLIElement>, list: dragList) => {
        e.preventDefault();
        e.stopPropagation();
        const target: Element = e.target as Element;
        clearTimeout(masterTimer.current as NodeJS.Timeout);
        masterTimer.current = setTimeout(() => {
            if (Object.keys(itemInMove).length !== 0 && itemInMove.origin !== target.id) {
                setDropAction(true);
                hasChildren(list) && setOpenState({...openState, [target.id]: true});
                dispatch(setInsertDestination(target.id));
            } 
        }, 750);
    }


    const dragleave = (e: DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(masterTimer.current as NodeJS.Timeout);
        masterTimer.current = null;
        setDropAction(false);
        (insertDestination !== "") && dispatch(setInsertDestination(""));
    };


    const dropHandle = (e: DragEvent<HTMLLIElement>) => {
        e.stopPropagation();
        document.removeEventListener("dragend", outOfBoundsDrop);
        const target: Element = e.target as Element;
        if (target.tagName === "LI" && Object.keys(itemInMove).length !== 0) {
            if (itemInMove.origin !== (target.id)) {
                if (itemInMove.invalidDestinations.includes(target.id) !== true) {
                    if (dropAction) {
                        setDropAction(false);
                        updateRootAction("insert", itemInMove, target);
                        (openState[target.id] !== true) && setOpenState({...openState, [target.id]: true});
                        onChange && onChange(itemInMove.origin + " inserted under " + target.id);
                    } else {
                        updateRootAction("order", itemInMove, target);
                        onChange && onChange(itemInMove.origin + " added as a sibling to " + target.id);
                    }
                }
            }
        }
        clearTimeout(masterTimer.current as NodeJS.Timeout);
    }

    return (
        <ul id={listId} onDragOver={dragHandle}>
            { membersCopy.map((member: dragList, index: number) => (
                <Fragment key={index}>
                    <li draggable className={(insertDestination === member.name) ? "nested-title insert" : "nested-title"} id={member.name}
                        onClick={() => expand(member.name)}
                        onDragStart={(e) => dragStartHandle(e, member)}
                        onDragEnter={(e) => dragenter(e, member)}
                        onDragLeave={dragleave}
                        onDrop={dropHandle}>
                            {member.name}
                    </li>
                    { openState[member.name] && hasChildren(member) && <Tree members={member.children!} listId={member.name+"-list"} updateRoot={updateRootAction} onChange={onChange} passedTimer={masterTimer}/> }
                </Fragment>
            ))}
        </ul>
    )
}


export default Tree;