import style from './listitem.module.scss';
import { useState, useEffect, createElement } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export default function ListItem({props, index, allData, listSlug, setCurrentItem, currentItem, setShowList, showList}) {
    const [operation, setOperation] = useState("");
    const [contextMenu, setContextMenu] = useState({x: null, y: null });
    const editInput = createElement(
        "input",
        {
            className: style.editInput,
            onKeyDown: (e) => {
                if(e.key == "Enter") {
                    saveEditedText(e);
                    setOperation("");
                }
            },
            onChange: () => {},
            onClick: (e) => {
                e.stopPropagation();
            },
            autoFocus: true,
            defaultValue: props.text
        }
    )


    // Necessary tools for DND-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.slug, disabled: true});

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

        setShowList({
            ...showList,
            list: [
                ...itemsTemp
            ]
        })

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        setCurrentItem("");
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

        setShowList({
            ...showList,
            list: [
                ...tempItems
            ]
        })

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log("removed", data))
            .catch(err => console.error(err));
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

        setShowList({
            ...showList,
            list: [
                ...itemsTemp
            ]
        })

    }

    // Function to move the item to another list
    const moveItem = (list, listBody) => {
        let tempItem = props;
        tempItem.slug = createSlug(8, listBody.list);
        
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...listBody,
                list: [
                    ...listBody.list,
                    tempItem
                ]
            })
        }


        fetch(`http://127.0.0.1:8000/todos/${list}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        deleteItem(props.slug);

    }

    /* 
        Setting a global event to close
        context-menu or "more" menu when clicked
        outside of menu frame
    */
    useEffect(() => {
        window.addEventListener("click", (e) => {
            setCurrentItem({slug: "", open: false});
            setContextMenu({x: null, y: null});
        })
    }, [])

    return (
        <div ref={setNodeRef} data-no-dnd="true" {...attributes} {...listeners} key={index} className={style.item} style={style2} onContextMenu={(e) => {e.preventDefault(); setContextMenu({x: e.pageX, y: e.pageY}); setCurrentItem({slug: props.slug, open: true})}}>
            <div className={`${style.itemContent} ${operation == "edit" && style.editVersion}`}>
                <input type="checkbox" id={props.slug} slug={props.slug} checked={props.done} onChange={(e) => updateDone(e)} />
                <label className={style.text} htmlFor={props.slug}>{props.text}</label>
                {operation == "edit" && editInput}
            </div>
            <div className={style.moreContainer} style={{position: contextMenu.x != null ? "unset" : "relative"}}>
                {/* Toggling context-menu via a shared state between ListItem and Home */}
                <div className={style.moreBtn} onClick={(e) => {e.stopPropagation(); setContextMenu({x: null, y: null}); setCurrentItem({slug: props.slug, open: currentItem.slug == props.slug && currentItem.open ? false : true});}}>more</div>
                <div className={`${style.contextMenu} ${currentItem.slug == props.slug && currentItem.open && style.open}`} onClick={(e) => e.stopPropagation()} style={{top: contextMenu.y !== null ? contextMenu.y : "auto", left: contextMenu.x !== null && window.innerWidth - contextMenu.x <= 100 ? "auto" : contextMenu.x}}>
                    <div className={style.option} onClick={() => {setOperation("edit"); setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null})}}>edit</div>
                    <div className={style.option} onClick={() => {navigator.clipboard.writeText(props.text); setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null})}}>copy</div>
                    <div className={style.option} onClick={() => deleteItem(props.slug)}>delete</div>
                    <div className={`${style.option} ${style.openable}`} onClick={() => {setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null})}}>
                        <p>move to</p>
                        <div className={`${style.innerSelection} ${!contextMenu.x ? style.leftVersion : window.innerWidth - contextMenu.x <= 400 && style.leftVersion}`}>
                            {
                                allData.map((list, index) => (
                                    list.slug !== listSlug && <div key={index} className={style.option} onClick={() => {moveItem(list.slug, list)}}>{list.head}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}