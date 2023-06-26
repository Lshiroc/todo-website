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

export default function Home() {
    const [data, setData] = useState([]);
    const [currentList, setCurrentList] = useState("");
    const [showList, setShowList] = useState({list: []});
    const [currentItem, setCurrentItem] = useState({slug: "", open: false});
    const input = useRef();

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
                        done: false,
                        slug: createSlug(8)
                    }
                ]
            })
        }

        setShowList({
            ...showList,
            list: [
                ...JSON.parse(newBody.body).list
            ]
        })

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        input.current.value = "";
    }

    // Fetch List when demanded
    const fetchList = (listSlug) => {
        fetch(`http://127.0.0.1:8000/todos/${listSlug}`)
            .then(resp => resp.json())
            .then(data => setShowList(data[0]))
            .catch(err => console.error(err));
    }

    // Initial List fetch on page load
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/todos/heads`)
            .then(resp => resp.json())
            .then(data => setData(data))
            .catch(err => console.error(err));

        window.addEventListener("click", () => {
            setCurrentItem({slug: "", open: false});
        })
    }, [])

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
            setShowList((items) => {
                let activeIndex;
                let overIndex;
                let index = 0;
                
                // Getting indexes of active and over to use in arrayMove()
                items.list.map((item) => {
                    if(item.slug == active.id) {
                        activeIndex = index;
                    } else if(item.slug == over.id) {
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
                            ...arrayMove(items.list, activeIndex, overIndex)
                        ]
                    })
                }
        
                // Sending request
                fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, saveBody)
                    .then(resp => resp.json())
                    .then(data => console.log(data))
                    .catch(err => console.error(err));


                // Returning new version to state itself
                return {
                    ...showList,
                    list: [
                        ...arrayMove(items.list, activeIndex, overIndex)
                    ]
                }
            })
        }
    }

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
                                    <div key={index} onClick={() => {fetchList(list.slug); setCurrentList(list.slug)}} className={style.list}>{list.head}</div>
                                ))
                            }
                        </div>
                    </div>
                </nav>
                <section className={style.listView}>
                    <div className={style.list}>
                        <h1 className={style.title}>Recipes</h1>
                        <div className={style.items}>
                            {/* Draggable Part with DND-Kit */}
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                sensors={sensors}
                            >
                                <SortableContext
                                    items={showList?.list.map(item => item.slug)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {
                                        showList?.list.map((item, index) => (
                                            <ListItem setCurrentItem={setCurrentItem} listSlug={showList?.slug} allData={data} currentItem={currentItem} props={item} showList={showList} setShowList={setShowList} key={index} />
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