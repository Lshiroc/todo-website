import style from './listitem.module.scss';
import { useState, useEffect, createElement } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


export default function ListItem({props, index, setCurrentItem, currentItem, setShowList, showList}) {
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
    } = useSortable({id: props.slug});

    const style2 = {
        transform: CSS.Transform.toString(transform),
        transition
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
            .then(data => console.log(data))
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

    /* 
        Setting a global event to close
        context-menu or "more" menu when clicked
        outside of menu frame
    */
    useEffect(() => {
        window.addEventListener("click", (e) => {
            setCurrentItem({slug: "", open: false});
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
                <div className={`${style.contextMenu} ${currentItem.slug == props.slug && currentItem.open && style.open}`} onClick={(e) => e.stopPropagation()} style={{top: contextMenu.y !== null ? contextMenu.y : "auto", left: contextMenu.x !== null ? contextMenu.x : "auto"}}>
                    <div className={style.option} onClick={() => {setOperation("edit"); setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null})}}>edit</div>
                    <div className={style.option} onClick={() => {navigator.clipboard.writeText(props.text); setCurrentItem({ slug: "", open: false }); setContextMenu({x: null, y: null})}}>copy</div>
                    <div className={style.option} onClick={() => deleteItem(props.slug)}>delete</div>
                </div>
            </div>
        </div>
    )
}