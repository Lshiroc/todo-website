import style from './dashboard.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import List from '../../components/List/List';
import Details from '../../components/Details/Details';

import moreIcon from './../../assets/icons/more.svg';
import editIcon from './../../assets/icons/edit2.svg';
import menuIcon from './../../assets/icons/menuBlack.svg';
import closeIcon from './../../assets/icons/close.svg';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [showList, setShowList] = useState({list: []});
    const [currentItem, setCurrentItem] = useState({slug: "", open: false});
    const [contextMenu, setContextMenu] = useState({x: null, y: null, slug: "", element: "", open: false, operation: null});
    const [dndDisable, setDndDisable] = useState(true);
    const [colorPicker, setColorPicker] = useState({open: false, color: ""});
    const [isEditing, setIsEditing] = useState(false);
    const [pageOpen, setPageOpen] = useState('');
    const [moreSection, setMoreSection] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const listCount = Number(localStorage.getItem('listCount')) || 3;
    const listPreviewArr = Array(listCount).fill("1");

    /*
        slowCollectedData - state will be updated whenever new information fetched,
        this way if we want to get the past data that we have visited,
        we won't need to refetch it from API, instead it will be 
        using it from 'slowCollectedData'
    */
    const [slowCollectedData, setSlowCollectedData] = useState({});

    // Fetch List when demanded
    const fetchList = (listSlug) => {
        console.log("fetcching", listSlug)
        if(Object.hasOwn(slowCollectedData, listSlug) && slowCollectedData[listSlug].creationDate) {
            console.log("cached", slowCollectedData[listSlug]);
            setShowList(slowCollectedData[listSlug]);
        } else {
            let request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            }

            fetch(`http://127.0.0.1:8000/todos/${listSlug}`, request)
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
                "Content-Type": "application/json",
                'authorization': localStorage.getItem('token')
            }
        }

        let tempData = data.filter(list => list.slug !== listSlug);
        setData(tempData);

        let temp = slowCollectedData;
        delete temp[listSlug];
        setSlowCollectedData({...temp});

        fetch(`http://127.0.0.1:8000/todos/${listSlug}`, newBody)
            .then(resp => resp.json())
            .then(data => {})
            .catch(err => console.error(err));
    }

    // Save Edited List title
    const saveEditedList = (e, list, defaultColor) => {
        const newBody = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                head: e.target.value.trim(),
                description: list.description,
                color: colorPicker.color == "" ? defaultColor : colorPicker.color
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${list.slug}`, newBody)
            .then(resp => resp.json())
            .then(data => {})
            .catch(err => console.error(err));

        if(slowCollectedData[list.slug]) {
            let newData = {...slowCollectedData};
            newData[list.slug] = {...newData[list.slug], ...JSON.parse(newBody.body)};
            setSlowCollectedData(newData);

            let tempData = data;
            tempData.map(item => {
                if(item.slug == list.slug) {
                    item = {...item, ...JSON.parse(newBody.body)};
                }
            })
            setData([...tempData]);
        }
        setContextMenu({x: null, y: null, slug: "", element: "", open: false, operation: null});
        setColorPicker({open: false, color: ""});
    }

    // Fetch heads
    const fetchHeads = () => {
        let request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        }

        fetch(`http://127.0.0.1:8000/todos/heads`, request)
        .then(resp => resp.json())
        .then(data => {
            setData(data);
            let temp = slowCollectedData;
            console.log("lol", data)
            data.map(item => {
                temp[item.slug] = item;
                if(!item.list) {
                    temp[item.slug].list = [];
                }
            })
            setSlowCollectedData({...temp});
        })
        .catch(err => console.error(err));
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

    // Create new list
    const createNewList = () => {
        const newBody = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                slug: createSlug(8),
                head: "New List",
                description: "description for list",
                list: [],
                count: 0,
                color: "#22c55e",
                userID: localStorage.getItem('userID')
            })
        }

        let temp = slowCollectedData;
        temp[JSON.parse(newBody.body).slug] = JSON.parse(newBody.body);
        setSlowCollectedData({...temp});
        setData([...data, {...JSON.parse(newBody.body)}])
        console.log("hmm", data)
        console.log("log", JSON.parse(newBody.body))

        fetch('http://127.0.0.1:8000/todos/', newBody)
            .then(resp => resp.json())
            .then(data => {})
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
                    "Content-Type": "application/json",
                    'authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ...tempItems,
                    count: tempItems.list.length
                })
            }

            let newData = tempData;
            newData[toSlug] = {...tempItems};
            newData[toSlug]["count"] = tempItems.list.length;
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

    // Checking Token
    const checkToken = async () => {
        const token = localStorage.getItem('token');

        let requestBody = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        }

        let loginData;

        loginData = await fetch(`http://127.0.0.1:8000/users/verifytoken`, requestBody)
            .then(resp => resp.json())
            .then(data => data)
            .catch(err => console.error(err));

        localStorage.setItem("userID", loginData.userID);
        
    }

    // Initial List fetch on page load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            checkToken();
            fetchHeads();
        } else {
            navigate('/login', { replace: true });
        }

        window.addEventListener("click", () => {
            setMoreSection(false);
        })
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

    // Log Out
    const logOut = () => {
        localStorage.clear();
        navigate('/login');
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

    useEffect(() => {
        if(slowCollectedData[showList.slug]) {
            setShowList(slowCollectedData[showList.slug]);
        }
    }, [slowCollectedData])

    useEffect(() => {
        localStorage.setItem('listCount', data.length);
    }, [data])

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <main className={style.main}>
                <nav className={`${style.navbar} ${isMenuOpen && style.open}`}>
                    <div className={style.lists}>
                        <div className={style.userSection}>
                            <div className={style.profile}></div>
                            <div className={style.item} onClick={(e) => {e.stopPropagation(); setMoreSection(prevVal => !prevVal)}}>
                                <img src={moreIcon} alt="More" draggable="false" />
                                <div className={`${style.moreSection} ${moreSection && style.open}`} onClick={(e) => e.stopPropagation()}>
                                    <div className={style.option} onClick={() => logOut()}>Log out</div>
                                </div>
                            </div>
                            <div className={`${style.item} ${style.closeBtn}`} onClick={() => setIsMenuOpen(false)}>
                                <img src={closeIcon} alt="Close" />
                            </div>
                        </div>
                        
                        {/* Lists */}
                        <div className={style.content}>
                            {
                                data[0]?.head ? data.map((list, index) => (
                                    contextMenu.slug == list.slug && contextMenu.element == "list" && contextMenu.operation == "edit" ?
                                    <div key={index} className={style.editing}>
                                        <div className={style.color} style={{backgroundColor: colorPicker.color == "" ? slowCollectedData[list.slug].color : colorPicker.color}} onClick={() => setColorPicker({...colorPicker, open: !colorPicker.open})}>
                                            <img src={editIcon} alt="Edit color" />
                                        </div>
                                        <input className={style.editInput} defaultValue={slowCollectedData[list.slug].head} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => {e.key == "Enter" && saveEditedList(e, slowCollectedData[list.slug], slowCollectedData[list.slug].color);}} />
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
                                    <div key={index} slug={list.slug} onClick={() => {setPageOpen(''); fetchList(list.slug)}} onContextMenu={(e) => {e.preventDefault(); setContextMenu({x: e.pageX, y: e.pageY, slug: list.slug, open: true, operation: null})}} className={`${style.list} ${showList.slug == list.slug && style.current}`}>
                                        <div slug={list.slug} className={style.color} style={{backgroundColor: slowCollectedData[list.slug].color}}>{slowCollectedData[list.slug].count}</div>
                                        <div slug={list.slug} className={style.head}>{slowCollectedData[list.slug].head}</div>
                                        <div slug={list.slug} className={style.description}>{slowCollectedData[list.slug].description}</div>
                                    </div>                                    
                                )) : listPreviewArr.map((item, index) => (
                                        <div key={index} className={style.loadingItem}>
                                            <div className={style.color}><div className={style.load}></div></div>
                                            <div className={style.head}><div className={style.load}></div></div>
                                            <div className={style.description}><div className={style.load}></div></div>
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
                            <div className={style.option} onClick={() => {setPageOpen('details'); fetchList(contextMenu.slug); setContextMenu({x: null, y: null, slug: "", element: "", open: false, operation: null})}}>Detail</div>
                        </div>
                    </div>
                </nav>
                <section className={style.listView}>
                    {pageOpen == 'details' ? (
                        <Details showList={showList} setPageOpen={setPageOpen} />
                    ) : 
                    showList.slug ? (
                        <List setIsMenuOpen={setIsMenuOpen} setContextMenu={setContextMenu} setPageOpen={setPageOpen} setColorPicker={setColorPicker} colorPicker={colorPicker} fetchHeads={fetchHeads} setSlowCollectedData={setSlowCollectedData} slowCollectedData={slowCollectedData} setCurrentItem={setCurrentItem} currentItem={currentItem} data={data} showList={showList} setShowList={setShowList} setIsEditing={setIsEditing} isEditing={isEditing} setDndDisable={setDndDisable} dndDisable={dndDisable} />
                    ) : (
                        <div className={style.blank}>
                            <div className={style.menuBtn} onClick={() => setIsMenuOpen(prevVal => !prevVal)}>
                                <img src={menuIcon} alt="Menu" />
                            </div>
                            <div className={style.text}>Not displaying a List</div>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}