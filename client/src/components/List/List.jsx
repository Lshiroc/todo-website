import style from './list.module.scss';
import { useRef, useEffect } from 'react';
import ListItem from './../../components/ListItem/ListItem.jsx';
import editIcon from './../../assets/icons/edit2.svg';
import dragIcon from './../../assets/icons/drag-icon.svg';
import menuIcon from './../../assets/icons/menu.svg';
import closeIcon from './../../assets/icons/close.svg';

import {
    DndContext,
    closestCenter,
    useSensors,
    PointerSensor,
    useSensor
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';


export default function List({setIsMenuOpen, setContextMenu, setColorPicker, fetchHeads, setSlowCollectedData, slowCollectedData, currentItem, setCurrentItem, data, setShowList, showList, setDndDisable, dndDisable, setIsEditing, isEditing}) {

    // Settings to make DND-kit clickable
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
            })
        )
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const input = useRef();
    
    /*
    Drag event function to keep track of 
    items which will be changed via arrayMove()
    and will be send to API, to update list
    */
    function handleDragEnd(e) {
        /* 
        active - the item we are planning to change
            over - the item we want change places with 
        */
        const {active, over} = e;

        if(active.id !== over.id) {
            let activeIndex;
            let overIndex;
            let index = 0;

            // Getting indexes of active and over to use in arrayMove()
            showList.list.map((item) => {
                if(item == active.id) {
                    activeIndex = index;
                } else if(item == over.id) {
                    overIndex = index;
                }
                index++;
            });

            // Saving new version of list to APi
            const saveBody = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    head: showList.head,
                    description: showList.description,
                    list: [
                        ...arrayMove(showList.list, activeIndex, overIndex)
                    ]
                })
            }

            // Sending request
            fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, saveBody)
                .then(resp => resp.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));

            let newData = {...slowCollectedData};
            newData[showList.slug] = {...showList, list: [...JSON.parse(saveBody.body).list]};
            setSlowCollectedData(newData);
            console.log("DND changed and cached");
        }
    }

    // Function for creating unique slug
    function createSlug(n) {
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "q", "Q", "w", "W", "e", "E", "r", "R", "t", "T", "y", "Y", "u", "U", "i", "I", "o", "O", "p", "P", "a", "A", "s", "S", "d", "D", "f", "F", "g", "G", "h", "H", "j", "J", "k", "K", "l", "L", "z", 'Z', "x", "X", "c", "C", "v", "V", "b", "B", "n", "N", "m", "M"];
        let newSlug = "";
        for(let i = 0; i < n; i++) {
            newSlug += chars[Math.floor((chars.length - 1)*Math.random(1, chars.length))];
        }

        let checkList = showList.list.filter(slug => newSlug == slug);
        if(checkList.length == 0) {
            return newSlug;
        }
        
        return createSlug(n);
    }

    // Function to add new item to according list
    const addText = (e) => {
        const newBody = {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json",
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                head: showList.head,
                description: showList.description,
                list: [
                    ...showList.list,
                    {
                        text: e.target.value.trim(),
                        status: "undone",
                        slug: createSlug(8),
                    }
                ],
                count: showList.list.length + 1
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => fetchHeads())
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[showList.slug] = {...showList, list: [...JSON.parse(newBody.body).list], count: JSON.parse(newBody.body).count};
        setSlowCollectedData(newData);
        console.log("added item and cached");

        input.current.value = "";
    }

    // Save Edited List description
    const saveEditedDescription = (e) => {
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                head: showList.head,
                description: e.target.value.trim(),
                color: showList.color
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => fetchHeads())
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[showList.slug] = {...newData[showList.slug], ...JSON.parse(newBody.body)};
        setSlowCollectedData(newData);
        setIsEditing(false);
        setContextMenu({x: null, y: null, slug: "", element: "", open: false, operation: null});
        setColorPicker({open: false, color: ""});
    }
    useEffect(() => {
        setIsEditing(false);
    }, [showList])

    return (
        <div className={style.list}>
            <div className={style.title} style={{backgroundColor: showList.color}}>
                <p className={style.text}>{showList.head}</p>
                <div className={style.menuBtn} onClick={() => setIsMenuOpen(prevVal => !prevVal)}>
                    <img src={menuIcon} alt="Menu" />
                </div>
            </div>
            <div className={style.info}>
                <div className={style.infoItem}>
                    {showList.count} items
                </div>
                <div className={style.seperator}></div>
                <div className={style.infoItem}>
                    <p>{months[(new Date(showList.creationDate).getMonth())]}</p>
                    <p>{(new Date(showList.creationDate).getDate())}</p>
                    <p>{(new Date(showList.creationDate).getFullYear())}</p>
                </div>
            </div>
            <div className={`${style.description} ${isEditing && style.editing}`}>
                <div className={style.text}>
                    {showList.description}
                    <div className={style.editBtn} onClick={() => setIsEditing(true)}>
                        <img src={editIcon} alt="Edit Description" />
                    </div>
                </div>
                <div className={style.edit}>
                    <input key={showList.description} defaultValue={showList.description} className={style.editInput} onKeyDown={(e) => e.key == "Enter" && saveEditedDescription(e)} />
                </div>
            </div>
            <div className={`${style.dragBtn} ${!dndDisable && style.active}`} onClick={() => setDndDisable(prevVal => !prevVal)}>
                <img src={dragIcon} alt="Drag" draggable="false" />
            </div>
            <div className={style.itemsContainer}>
                <div className={style.items}>
                    {/* Draggable Part with DND-Kit */}
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                    >
                        <SortableContext
                            items={showList.list}
                            strategy={verticalListSortingStrategy}
                            useDragOverlay={false}
                        >
                            {
                                showList?.list.map((item) => (
                                    <ListItem key={item.slug} fetchHeads={fetchHeads} setSlowCollectedData={setSlowCollectedData} slowCollectedData={slowCollectedData} currentItem={currentItem} setCurrentItem={setCurrentItem} dndDisable={dndDisable} listSlug={showList?.slug} allData={data} props={item} showList={showList} setShowList={setShowList} />
                                ))
                            }
                        </SortableContext>
                    </DndContext>
                </div>

            </div>
            <div className={style.addItem}>
                <input type="text" ref={input} slug="d23FD67s" placeholder="I'll shave my head off" onKeyDown={(e) => {e.key == "Enter" && addText(e)}} />
            </div>
        </div>
    )
}
