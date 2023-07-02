import style from './details.module.scss';

export default function Details({ showList }) {
    console.log(showList)

    const handleDate = (date) => {
        let tempDate = new Date(date);
        let formattedDate = "";
        
        if(tempDate.getMonth() < 10) {
            formattedDate += "0" + tempDate.getMonth();
        } else {
            formattedDate += tempDate.getMonth();
        }

        if(tempDate.getDate() < 10) {
            formattedDate += "/0" + tempDate.getDate();
        } else {
            formattedDate += "/" + tempDate.getDate();
        }

        formattedDate += "/" + tempDate.getFullYear();

        return formattedDate;
    }

    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.top}>
                    <h1 className={style.title}>Details</h1>
                </div>
                <div className={style.main}>
                    <div className={style.brief}>
                        <p className={style.line}>Title: <span className={style.lineInfo}>{showList.head}</span></p>
                        <p className={style.line}>Description: <span className={style.lineInfo}>{showList.description}</span></p>
                        <p className={style.line}>AuthorID: <span className={style.lineInfo}>{showList.userID}</span></p>
                        <p className={style.line}>ListID: <span className={style.lineInfo}>{showList.slug}</span></p>
                        <p className={style.line}>Items: <span className={style.lineInfo}>{showList.count}</span></p>
                        <p className={`${style.line} ${style.theme} `}>Theme: <span className={style.colorPreview} style={{backgroundColor: showList.color}}></span><span className={style.lineInfo}>{showList.color}</span></p>
                        <p className={style.line}>Creation date: <span className={style.lineInfo}>{handleDate(showList.creationDate)}</span></p>
                        <p className={style.line}>Moderation date: <span className={style.lineInfo}>{handleDate(showList.moderationDate)}</span></p>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
