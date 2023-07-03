import style from './statistics.module.scss';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export default function Statistics({ showList }) {
    const [data, setData] = useState([]);
    const COLORS = ['#22c55e', '#fbbf24', '#ff4242'];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius - 10 + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        setData([
            { name: 'Done', value: showList.doneCount},
            { name: 'Pending', value: showList.pendingCount },
            { name: 'Undone', value: showList.undoneCount },
        ]);
    }, [showList])

    return (
        <div className={style.container}>
            <div className={style.top}>
                <h1 className={style.title}>Statistics</h1>
            </div>
            <div className={style.main}>
                <div className={style.pieChart}>
                    <ResponsiveContainer width={350} height={200}>
                        <PieChart width={500} height={100}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="100%"
                                animationDuration={0}
                                startAngle={180}
                                endAngle={0}
                                label
                                // labelLine={false}
                                innerRadius={80}
                                outerRadius={150}
                                // label={renderCustomizedLabel}
                                cornerRadius={6}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className={style.labels}>
                        <div className={style.label}>
                            <div className={`${style.number} ${style.done}`}>{showList.doneCount}</div>
                            <div className={style.text}>Done</div>
                        </div>
                        <div className={style.label}>
                            <div className={`${style.number} ${style.pending}`}>{showList.pendingCount}</div>
                            <div className={style.text}>Pending</div>
                        </div>
                        <div className={style.label}>
                            <div className={`${style.number} ${style.undone}`}>{showList.undoneCount}</div>
                            <div className={style.text}>Undone</div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    )
}