import style from './home.module.scss';
import { useState, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState({});

    useEffect(() => {
        fetch("http://localhost:8000/tshirt/")
            .then(resp => resp.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            <main className={style.main}>
                <nav className={style.navbar}>
                    <div className={style.lists}>
                        <h1 className={style.sectionTitle}>Lists</h1>
                        <div className={style.content}>
                            <div className={style.list}>Recipes</div>
                            <div className={style.list}>Recipes</div>
                            <div className={style.list}>Recipes</div>
                        </div>
                    </div>
                </nav>
                <section className={style.listView}>
                    <div className={style.list}>
                        <h1 className={style.title}>Recipes</h1>
                        <div className={style.items}>
                            <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div>
                            <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div>
                            <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div>
                            <div className={style.item}>
                                <input type="checkbox" />
                                <p className={style.text}>Recipe 1</p>
                            </div>
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