import style from './home.module.scss';
import { useState, useEffect, useRef, createElement } from 'react';
import ListItem from './../../components/ListItem/ListItem.jsx';
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

import editIcon from './../../assets/icons/edit2.svg';

export default function Home() {
    const [data, setData] = useState([]);
    const [showList, setShowList] = useState({list: []});
    const [currentItem, setCurrentItem] = useState({slug: "", open: false});
    const [contextMenu, setContextMenu] = useState({x: null, y: null, slug: "", element: "", open: false, operation: null});
    const [dndDisable, setDndDisable] = useState(true);
    const [colorPicker, setColorPicker] = useState({open: false, color: ""});
    const input = useRef();

    /*
        slowCollectedData - state will be updated whenever new information fetched,
        this way if we want to get the past data that we have visited,
        we won't need to refetch it from API, instead it will be 
        using it from 'slowCollectedData'
    */
    const [slowCollectedData, setSlowCollectedData] = useState({});

    // Settings to make DND-kit clickable
    const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
      })
    )

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                head: showList.head,
                description: showList.description,
                list: [
                    ...showList.list,
                    {
                        text: e.target.value.trim(),
                        status: "undone",
                        slug: createSlug(8)
                    }
                ]
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        let newData = {...slowCollectedData};
        newData[showList.slug] = {...showList, list: [...JSON.parse(newBody.body).list]};
        setSlowCollectedData(newData);
        console.log("added item and cached");

        input.current.value = "";
    }

    // Fetch List when demanded
    const fetchList = (listSlug) => {
        if(Object.hasOwn(slowCollectedData, listSlug)) {
            console.log("cached");
            setShowList(slowCollectedData[listSlug]);
        } else {
            fetch(`http://127.0.0.1:8000/todos/${listSlug}`)
                .then(resp => resp.json())
                .then(data => {
                    setShowList(data[0]);
                    let tempData = slowCollectedData;
                    tempData[listSlug] = data[0];
                    setSlowCollectedData({...tempData});
                })
                .catch(err => console.error(err));

            console.log("fetched and added to cache")
        }

    }

    // Delete List
    const deleteList = (listSlug) => {
        const newBody = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(`http://127.0.0.1:8000/todos/${listSlug}`, newBody)
            .then(resp => resp.json())
            .then(data => fetchHeads())
            .catch(err => console.error(err));
    }

    // Save Edited List title
    const saveEditedList = (e, list, defaultColor) => {
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                head: e.target.value.trim(),
                description: list.description,
                color: colorPicker.color == "" ? defaultColor : colorPicker.color
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${list.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => fetchHeads())
            .catch(err => console.error(err));

        setContextMenu({x: null, y: null, slug: "", element: "", open: false, operation: null});
        setColorPicker({open: false, color: ""});
    }

    // Fetch heads
    const fetchHeads = () => {
        fetch(`http://127.0.0.1:8000/todos/heads`)
        .then(resp => resp.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    }

    // Create new list
    const createNewList = () => {
        const newBody = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                head: "New List",
                description: "description for list",
                list: [],
                color: "#22c55e"
            })
        }

        fetch('http://127.0.0.1:8000/todos/', newBody)
            .then(resp => resp.json())
            .then(data => fetchHeads())
            .catch(err => console.error(err));
    }

    // Transfer List to another List
    const transferListTo = async (fromSlug, toSlug) => {
        // Fetching the Lists if they are not in the cache
        const fetchAll = async () => {
            let needToFetch = [];
            let tempData = slowCollectedData;

            if(!slowCollectedData[fromSlug]) {
                needToFetch.push(`http://127.0.0.1:8000/todos/${fromSlug}`);
            }
            if(!slowCollectedData[toSlug]) {
                needToFetch.push(`http://127.0.0.1:8000/todos/${toSlug}`);
            }

            try {
                let res = await Promise.all(needToFetch.map((e) => fetch(e)));
                let resJson = await Promise.all(res.map((e) => e.json()));
                resJson.map((list) => {
                    if(list[0].slug == fromSlug) {
                        tempData[fromSlug] = list[0];
                    }
                    if(list[0].slug == toSlug) {
                        tempData[toSlug] = list[0];
                    }
                })
                return tempData;
            } catch(err) {
                console.error(err);
            }

            return false;
        }

        // Editing and saving the final version, and caching
        const transfer = async (data) => {
            let tempData = await data;
            let tempItems = await tempData[toSlug];
            let transferedItems = await tempData[fromSlug];

            if(tempItems.list.length > 0) {
                tempItems.list = [...tempItems.list, ...transferedItems.list];
            } else {
                tempItems.list = [...transferedItems.list];
            }

            let newBody = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...tempItems
                })
            }

            let newData = tempData;
            newData[toSlug] = tempItems;
            setShowList(newData[toSlug]);
            setSlowCollectedData(newData);

            fetch(`http://127.0.0.1:8000/todos/${toSlug}`, newBody)
                .then(resp => resp.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));

            deleteList(fromSlug);
            setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
            console.log("transferred and cached");
        }

        transfer(await fetchAll());
    }

    // Initial List fetch on page load
    useEffect(() => {
        fetchHeads();
    }, [])

    /* 
        Setting a global event to close
        context-menu or "more" menu when clicked
        outside of menu frame
    */
   const handleContext = (e) => {
        let listSlug = e.target.getAttribute("slug");
        if(listSlug) {
            setContextMenu({x: e.pageX, y: e.pageY, slug: listSlug, open: true, operation: null});
            setColorPicker({open: false, color: ""});
        } else {
            setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
            setCurrentItem({slug: "", open: false});
        }
    }

    const handleContextClick = () => {
        if(contextMenu.open || currentItem.slug != "" || currentItem.open) {
            setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
            setCurrentItem({slug: "", open: false});
        }
    }
    useEffect(() => {
        window.addEventListener("click", handleContextClick);
        window.addEventListener("contextmenu", handleContext);

        return () => {
            window.removeEventListener("click", handleContextClick);
            window.removeEventListener("contextmenu", handleContext);
        }
    }, [contextMenu, currentItem])

    useEffect(() => {
        if(currentItem.open || currentItem.slug != "") {
            setContextMenu({x: null, y: null, slug: "", open: false, operation: null});
        }
    }, [currentItem])


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

    useEffect(() => {
        if(slowCollectedData[showList.slug]) {
            setShowList(slowCollectedData[showList.slug]);
        }
    }, [slowCollectedData])

    useEffect(() => {
        console.log(colorPicker)
    }, [colorPicker])

    return (
        <>
            <main className={style.main}>
                <nav className={style.navbar}>
                    <div className={style.lists}>
                        <h1 className={style.sectionTitle}>Lists</h1>
                        
                        {/* Lists */}
                        <div className={style.content}>
                            {
                                data && data.map((list, index) => (
                                    contextMenu.slug == list.slug && contextMenu.element == "list" && contextMenu.operation == "edit" ?
                                    <div key={index} className={style.editing}>
                                        <div className={style.color} style={{backgroundColor: colorPicker.color == "" ? list.color : colorPicker.color}} onClick={() => setColorPicker({...colorPicker, open: !colorPicker.open})}>
                                            <img src={editIcon} alt="Edit color" />
                                        </div>
                                        <input className={style.editInput} defaultValue={list.head} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => {e.key == "Enter" && saveEditedList(e, list, list.color);}} />
                                        <div className={style.description}>{list.description}</div>
                                        <div className={`${style.colorpicker} ${colorPicker.open && style.open}`}>
                                            <div className={`${style.theme} ${style.red}`} onClick={() => {setColorPicker({open: false, color: "#ef4444"})}}></div>
                                            <div className={`${style.theme} ${style.orange}`} onClick={() => {setColorPicker({open: false, color: "#f97316"})}}></div>
                                            <div className={`${style.theme} ${style.amber}`} onClick={() => {setColorPicker({open: false, color: "#f59e0b"})}}></div>
                                            <div className={`${style.theme} ${style.yellow}`} onClick={() => {setColorPicker({open: false, color: "#eab308"})}}></div>
                                            <div className={`${style.theme} ${style.lime}`} onClick={() => {setColorPicker({open: false, color: "#84cc16"})}}></div>
                                            <div className={`${style.theme} ${style.green}`} onClick={() => {setColorPicker({open: false, color: "#22c55e"})}}></div>
                                            <div className={`${style.theme} ${style.emerald}`} onClick={() => {setColorPicker({open: false, color: "#10b981"})}}></div>
                                            <div className={`${style.theme} ${style.teal}`} onClick={() => {setColorPicker({open: false, color: "#14b8a6"})}}></div>
                                            <div className={`${style.theme} ${style.cyan}`} onClick={() => {setColorPicker({open: false, color: "#06b6d4"})}}></div>
                                            <div className={`${style.theme} ${style.sky}`} onClick={() => {setColorPicker({open: false, color: "#0ea5e9"})}}></div>
                                            <div className={`${style.theme} ${style.blue}`} onClick={() => {setColorPicker({open: false, color: "#3b82f6"})}}></div>
                                            <div className={`${style.theme} ${style.indigo}`} onClick={() => {setColorPicker({open: false, color: "#6366f1"})}}></div>
                                            <div className={`${style.theme} ${style.violet}`} onClick={() => {setColorPicker({open: false, color: "#8b5cf6"})}}></div>
                                            <div className={`${style.theme} ${style.purple}`} onClick={() => {setColorPicker({open: false, color: "#a855f7"})}}></div>
                                            <div className={`${style.theme} ${style.fuchsia}`} onClick={() => {setColorPicker({open: false, color: "#d946ef"})}}></div>
                                            <div className={`${style.theme} ${style.pink}`} onClick={() => {setColorPicker({open: false, color: "#ec4899"})}}></div>
                                            <div className={`${style.theme} ${style.rose}`} onClick={() => {setColorPicker({open: false, color: "#f43f5e"})}}></div>
                                        </div>
                                    </div>
                                    :
                                    <div key={index} slug={list.slug} onClick={() => {fetchList(list.slug)}} onContextMenu={(e) => {e.preventDefault(); setContextMenu({x: e.pageX, y: e.pageY, slug: list.slug, open: true, operation: null})}} className={style.list}>
                                        <div className={style.color} style={{backgroundColor: list.color}}>4</div>
                                        <div slug={list.slug} className={style.head}>{list.head}</div>
                                        <div slug={list.slug} className={style.description}>{list.description}</div>
                                    </div>                                    
                                ))
                            }
                            <div className={style.addListBtn} onClick={() => createNewList()}>Add List</div>
                        </div>
                        <div className={`${style.contextMenu} ${contextMenu.open && style.open}`} onClick={(e) => e.stopPropagation()} style={{top: contextMenu.y ? contextMenu.y : 'auto', left: contextMenu.x ? contextMenu.x : 'auto'}}>
                            <div className={style.option} onClick={() => {setContextMenu({x: null, y: null, slug: contextMenu.slug, element: "list", open: false, operation: "edit"})}}>Edit</div>
                            <div className={`${style.option} ${style.deleteOption}`} onClick={() => {deleteList(contextMenu.slug); setContextMenu({x: null, y: null, slug: "", element: "", open: false, operation: null})}}>Delete</div>
                            <div className={`${style.option} ${style.openable}`}>
                                <p>Transfer to</p>
                                <div className={`${style.innerSelection}`}>
                                    {
                                        data.map((list, index) => (
                                            list.slug !== contextMenu.slug && <div key={index} className={style.option} onClick={() => {transferListTo(contextMenu.slug, list.slug)}}>{list.head}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <section className={style.listView}>
                    <div className={style.list}>
                        <h1 className={style.title}>{showList.head}</h1>
                        <p onClick={() => setDndDisable(prevVal => !prevVal)}>activate dnd</p>
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
                                            <ListItem key={item.slug} setSlowCollectedData={setSlowCollectedData} slowCollectedData={slowCollectedData} currentItem={currentItem} setCurrentItem={setCurrentItem} dndDisable={dndDisable} listSlug={showList?.slug} allData={data} props={item} showList={showList} setShowList={setShowList} />
                                        ))
                                    }
                                </SortableContext>
                            </DndContext>
                        </div>
                        <div className={style.addItem}>
                            <input type="text" ref={input} slug="d23FD67s" placeholder="I'll shave my head off" onKeyDown={(e) => {e.key == "Enter" && addText(e)}} />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}