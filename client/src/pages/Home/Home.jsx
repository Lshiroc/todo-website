import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import style from './home.module.scss';
import done from './../../assets/icons/done.svg';
import cross from './../../assets/icons/cross.svg';
import waiting from './../../assets/icons/waiting.svg';

export default function Home() {
    const [items, setItems] = useState([
        {id: "1", status: "done", text: "Keep Doin' It while your plans are organized"},
        {id: "2", status: "pending", text: "Change your way of thinking"},
        {id: "3", status: "undone", text: "Don't forget to touch some grass"},
    ]);

    const changeStatus = (id, status) => {
        let tempItems = items;
        
        tempItems.map((item) => {
            if(item.id == id) {
                switch(status) {
                    case "done":
                        item["status"] = "undone";
                        break;
                    case "pending":
                        item["status"] = "done";
                        break;
                    case "undone":
                        item["status"] = "pending";
                }
            }
        })

        setItems([...tempItems]);
    }

    return (
        <>
            <Helmet>
                <title>Doin' It</title>
            </Helmet>
            <nav className={style.navbar}>
                <div className={style.container}>
                    <div className={style.logo}>Doin' It!</div>
                </div>
            </nav>
            <main className={style.main}>
                <div className={style.content}>
                    {
                        items.map((item) => (
                            <a key={item.id} className={style.item} onClick={() => changeStatus(item.id, item.status)}>
                                <div className={style.itemContent}>
                                    <span className={`${style.customCheckBox} ${style[item.status]}`}>
                                        <img src={done} alt="Done" className={`${style.checkmark} ${style.maru}`} draggable="false" />
                                        <img src={cross} alt="Undone" className={`${style.checkmark} ${style.batsu}`} draggable="false" />
                                        <img src={waiting} alt="Pending" className={`${style.checkmark} ${style.sankaku}`} draggable="false" />
                                    </span>
                                    <label className={style.text}>{item.text}</label>
                                </div>
                            </a>
                        ))
                    }
                </div>
                <Link to="/login" className={style.btn}>Get Started</Link>
                <div className={`${style.backgroundGrids} ${style.first}`}>
                    <div className={style.grid}>
                        <div className={style.top}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                        <div className={style.left}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                    </div>
                </div>
                <div className={`${style.backgroundGrids} ${style.second}`}>
                    <div className={style.grid}>
                        <div className={style.top}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                        <div className={style.left}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                    </div>
                </div>
                <div className={`${style.backgroundGrids} ${style.third}`}>
                    <div className={style.grid}>
                        <div className={style.top}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                        <div className={style.left}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                    </div>
                </div>
                <div className={`${style.backgroundGrids} ${style.fourth}`}>
                    <div className={style.grid}>
                        <div className={style.top}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                        <div className={style.left}>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                            <div className={style.stroke}></div>
                        </div>
                    </div>
                </div>
           </main>
        </>
    )
}
