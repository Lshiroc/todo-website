import style from './listitem.module.scss';
import { useState, useEffect } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import dragIcon from './../../assets/icons/drag-icon.svg';

export default function ListItem({props, allData, listSlug, setSlowCollectedData, slowCollectedData, setCurrentItem, currentItem, setShowList, showList, dndDisable}) {
    const [contextMenu, setContextMenu] = useState({x: null, y: null, slug: '', open: false, operation: null});

    // Necessary tools for DND-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props, disabled: dndDisable});

    const style2 = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    // Function for creating unique slug
    function createSlug(n, listToCheck) {
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "q", "Q", "w", "W", "e", "E", "r", "R", "t", "T", "y", "Y", "u", "U", "i", "I", "o", "O", "p", "P", "a", "A", "s", "S", "d", "D", "f", "F", "g", "G", "h", "H", "j", "J", "k", "K", "l", "L", "z", 'Z', "x", "X", "c", "C", "v", "V", "b", "B", "n", "N", "m", "M"];
        let newSlug = "";
        for(let i = 0; i < n; i++) {
            newSlug += chars[Math.floor((chars.length - 1)*Math.random(1, chars.length))];
        }

        let checkList = listToCheck.filter(slug => newSlug == slug);
        if(checkList.length == 0) {
            return newSlug;
        }
        
        return createSlug(n);
    }

    // Function to dave edited item text
    function saveEditedText(e) {
        let itemsTemp = showList.list;
        itemsTemp.map((item) => {
            if(item.slug == props.slug) {
                item.text = e.target.value.trim();
            }
        })

        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...showList,
                list: [
                    ...itemsTemp
                ]
            })
        }
        
        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[props.slug] = {...showList, list: [...itemsTemp]}
        setSlowCollectedData(newData);

        setCurrentItem("");
        setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
    }

    // Delete item with according slug
    function deleteItem(itemSlug) {
        let tempItems = showList.list.filter(item => item.slug != itemSlug);
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...showList,
                list: [
                    ...tempItems
                ]
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log("removed", data))
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[showList.slug] = {...showList, list: [...tempItems]}
        setSlowCollectedData(newData);

        setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
        setCurrentItem({slug: "", open: false});
    }   

    // Update the done status of item
    const updateDone = (e) => {
        const slug = e.target.getAttribute("slug");
        let itemsTemp = showList.list;
        
        itemsTemp.map((item) => {
            if(item.slug == slug) {
                item.done = e.target.checked;
            }
        })

        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                head: showList.head,
                description: showList.description,
                list: [
                    ...itemsTemp
                ]
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(newdata => console.log(newdata))
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[showList.slug] = {...showList, list: [...itemsTemp]};
        setSlowCollectedData(newData);
        console.log("Changed Done and Cached");
    }

    // Function to move the item to another list
    const moveItem = async (list) => {
        const resp = await fetch(`http://127.0.0.1:8000/todos/${list}`);
        const listBody = await resp.json();

        let tempItem = props;
        tempItem.slug = createSlug(8, await listBody[0].list);
        
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...listBody[0],
                list: [
                    ...listBody[0].list,
                    tempItem
                ]
            })
        }

        let newData = slowCollectedData;
        newData[list] = JSON.parse(newBody.body);
        setSlowCollectedData(newData);

        fetch(`http://127.0.0.1:8000/todos/${list}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        deleteItem(props.slug);
        
        console.log("moved item and cached");
    }

    /* 
        Setting a global event to close
        context-menu or "more" menu when clicked
        outside of menu frame
    */
    useEffect(() => {
        const handleContext = () => {
            if(contextMenu.open) {
                setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
                setCurrentItem({slug: "", open: false});
            }
        }

        window.addEventListener("click", handleContext);
        window.addEventListener("contextmenu", handleContext);

        return () => {
            window.removeEventListener("click", handleContext);
            window.removeEventListener("contextmenu", handleContext);
        }
    }, [contextMenu, currentItem])

    return (
        <div ref={setNodeRef} data-no-dnd="true" style={style2} className={style.item} onContextMenu={(e) => {e.preventDefault(); e.stopPropagation(); setContextMenu({x: e.pageX, y: e.pageY, slug: props.slug, open: true, operation: null}); setCurrentItem({slug: props.slug, open: true})}}>
            <button {...attributes} {...listeners} className={`${style.dragBtn} ${!dndDisable && style.active}`}>
                <img src={dragIcon} alt="Drag" draggable="false" />
            </button>
            <div className={`${style.itemContent} ${contextMenu.operation == "edit" && contextMenu.slug == props.slug && style.editVersion}`}>
                <input type="checkbox" id={props.slug} slug={props.slug} checked={props.done} style={{display: dndDisable ? "block" : "none"}} onChange={(e) => {updateDone(e)}} />
                <label className={style.text} htmlFor={dndDisable ? props.slug : 'none'} onClick={(e) => {e.preventDefault()}} >{props.text}</label>
                {contextMenu.operation == "edit" && contextMenu.slug == props.slug && <input className={style.editInput} defaultValue={props.text} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => {e.key == "Enter" && saveEditedText(e);}} />}
            </div>
            <div className={style.moreContainer} style={{position: contextMenu.x != null ? "unset" : "relative"}}>
                
                {/* Toggling context-menu via a shared state between ListItem and Home */}
                <div className={style.moreBtn} onClick={(e) => {e.stopPropagation(); setContextMenu({x: null, y: null, slug: "", open: false, operation: null}); setCurrentItem({slug: props.slug, open: currentItem.slug == props.slug && currentItem.open ? false : true});}}>more</div>
                <div className={`${style.contextMenu} ${currentItem.slug == props.slug && currentItem.open && style.open}`} onClick={(e) => e.stopPropagation()} style={{top: contextMenu.y !== null ? contextMenu.y : "auto", left: contextMenu.x !== null && window.innerWidth - contextMenu.x <= 100 ? "auto" : contextMenu.x}}>
                    
                    {/* Options for context-menu */}
                    <div className={style.option} onClick={() => {setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null, slug: props.slug, open: false, operation: "edit"})}}>edit</div>
                    <div className={style.option} onClick={() => {navigator.clipboard.writeText(props.text); setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null, slug: "", open: false, operation: null})}}>copy</div>
                    <div className={style.option} onClick={() => deleteItem(props.slug)}>delete</div>
                    <div className={`${style.option} ${style.openable}`} onClick={() => {setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null, slug: "", open: false, operation: null})}}>
                        <p>move to</p>
                        <div className={`${style.innerSelection} ${!contextMenu.x ? style.leftVersion : window.innerWidth - contextMenu.x <= 400 && style.leftVersion}`}>
                            {
                                allData.map((list, index) => (
                                    list.slug !== listSlug && <div key={index} className={style.option} onClick={() => {moveItem(list.slug)}}>{list.head}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}