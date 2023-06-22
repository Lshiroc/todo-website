import style from './home.module.scss';
import { useState, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState([]);
    const [currentList, setCurrentList] = useState("");
    const [showList, setShowList] = useState({list: []});

    useEffect(() => {
        fetch('http://127.0.0.1:8000/todos/')
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
                                        <input type="checkbox" />
                                        <p className={style.text}>{item}</p>
                                    </div>
                                ))
                            }
                            {/* <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div> */}
                        </div>
                        <div className={style.addItem}>
                            <input type="text" placeholder="I'll shave my head off" />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}