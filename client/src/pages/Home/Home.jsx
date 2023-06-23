import style from './home.module.scss';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
    const [data, setData] = useState([]);
    const [currentList, setCurrentList] = useState("");
    const [showList, setShowList] = useState({list: []});
    const input = useRef();

    const saveList = () => {
        const saveBody = {
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
                        text: showList.list
                    }
                ]
            })
        }

        fetch(`http://127.0.0.1:8000/todos/${showList.slug}`, saveBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        input.current.value = "";
    }

    // Creating slug
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
        fetch(`http://127.0.0.1:8000/todos`)
            .then(resp => resp.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        if(data?.length > 0) {
            const list = data.filter(list => list.slug == currentList);
            if(list) {
                setShowList(list[0]);
            }
        }
    }, [currentList])

    return (
        <>
            <main className={style.main}>
                <nav className={style.navbar}>
                    <div className={style.lists}>
                        <h1 className={style.sectionTitle}>Lists</h1>
                        <div className={style.content}>
                            {
                                data && data.map((list, index) => (
                                    <div key={index} onClick={() => setCurrentList(list.slug)} className={style.list}>{list.head}</div>
                                ))
                            }
                        </div>
                    </div>
                </nav>
                <section className={style.listView}>
                    <div className={style.list}>
                        <h1 className={style.title}>Recipes</h1>
                        <div className={style.items}>
                            {
                                showList?.list.map((item, index) => (
                                    <div key={index} className={style.item}>
                                        <input type="checkbox" slug={item.slug} defaultChecked={item.done} onChange={(e) => updateDone(e)} />
                                        <p className={style.text}>{item.text}</p>
                                    </div>
                                ))
                            }
                            {/* <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div> */}
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