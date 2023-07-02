import style from './statistics.module.scss';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export default function Statistics({ showList }) {

    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

    return (
        <div className={style.container}>
            <div className={style.top}>
                <h1 className={style.title}>Statistics</h1>
            </div>
            <div className={style.main}>
                <div className={style.pieChart}>
                    <ResponsiveContainer  width="100%" height="100%">
                        <PieChart width={500} height={500}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
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
                </div> 
            </div>
        </div>
    )
}