'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type ScoreData = {
    name: string;
    value: number;
    color: string;
};

export default function AccessibilityScoreChart({ score }: { score: number }) {
    const data: ScoreData[] = [
        { name: 'Score', value: score, color: '#10B981' }, // Green for success
        { name: 'Remaining', value: 100 - score, color: '#E5E7EB' }, // Grey for remaining
    ];

    return (
        <div style={{ width: '100%', height: 300, position: 'relative' }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            {/* Centered Text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {score}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Avg. Score
                </div>
            </div>
        </div>
    );
}
