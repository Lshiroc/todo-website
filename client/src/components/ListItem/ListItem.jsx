import style from './listitem.module.scss';
import { useState, useEffect, createElement } from 'react';

export default function ListItem({props, index, setCurrentItem, currentItem}) {
    const [operation, setOperation] = useState("");
    const [contextMenuOpen, setContextMenuOpen] = useState({open: false, mouseDependent: false})
    const editInput = createElement(
        "input",
        {
            className: style.editInput,
            onKeyDown: (e) => {
                if(e.key == "Enter") {
                    saveEditedText(e);
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

    function saveEditedText(e) {
        let itemsTemp = showList.list;
        itemsTemp.map((item) => {
            if(item.slug == currentItem.slug) {
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

        setCurrentItem("");
    }

    function deleteItem (itemSlug) {
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

    useEffect(() => {
        window.addEventListener("click", (e) => {
            setCurrentItem({slug: "", open: false});
        })
    }, [])

    return (
        <div key={index} className={style.item}>
            <div className={`${style.itemContent}`}>
                <input type="checkbox" id={props.slug} slug={props.slug} defaultChecked={props.done} />
                <label className={style.text} htmlFor={props.slug}>{props.text}</label>
                {operation == "edit" && editInput}
            </div>
            <div className={style.moreContainer}>
                {/* Toggling context-menu via a shared state between ListItem and Home */}
                <div className={style.moreBtn} onClick={(e) => {e.stopPropagation(); setCurrentItem({slug: props.slug, open: currentItem.slug == props.slug && currentItem.open ? false : true});}}>more</div>
                <div className={`${style.contextMenu} ${currentItem.slug == props.slug && currentItem.open && style.open}`} onClick={(e) => e.stopPropagation()}>
                    <div className={style.option}>edit</div>
                    <div className={style.option} onClick={() => {navigator.clipboard.writeText(props.text)}}>copy</div>
                    <div className={style.option}>delete</div>
                </div>
            </div>

                {/* <div key={index} className={style.item} onContextMenu={(e) => {e.preventDefault(); setCurrentItem({x: e.pageX, y: e.pageY, slug: item.slug, context: props.text, operation: null, open: true})}}>
<div className={`${style.itemContent} ${currentItem.operation == "edit" && currentItem.slug == props.slug && style.editVersion}`}>
    <input type="checkbox" id={props.slug} slug={props.slug} defaultChecked={item.done} onChange={(e) => updateDone(e)} />
    <label className={style.text} htmlFor={props.slug}>{props.text}</label>
    {currentItem.operation == "edit" && currentItem.slug == props.slug && editInput}
</div>
<div className={style.moreContainer}>
    <div className={style.moreBtn} onClick={(e) => {e.stopPropagation(); currentItem.open ? setCurrentItem({x: null, y: null, slug: item.slug, context: item.text, operation: null, open: false}) : setCurrentItem({x: null, y: null, slug: item.slug, context: item.text, operation: null, open: true})}}>more</div>
    <div className={`${style.contextMenu} ${currentItem.x == null && currentItem.open && currentItem.slug == props.slug && style.open}`} onClick={(e) => e.stopPropagation()}>
        <div className={style.option} onClick={() => {setCurrentItem({...currentItem, slug: props.slug, context: props.text, operation: "edit", open: false}); setCurrentContextMenu("")}}>edit</div>
        <div className={style.option} onClick={() => {navigator.clipboard.writeText(props.text); setCurrentContextMenu("")}}>copy</div>
        <div className={style.option} onClick={() => {deleteItem(item.slug); setCurrentContextMenu("")}}>delete</div>
    </div>
</div>
</div> */}
        </div>


    )
}