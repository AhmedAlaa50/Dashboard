"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

export default function AgeChart() {
    const users = useSelector((state: RootState) => state.users.users)

    // Group ages into ranges (like 0–10, 11–20, etc.)
    const groupedAges: Record<string, number> = {}
    users.forEach((user) => {
        const rangeStart = Math.floor(user.age / 10) * 10
        const rangeLabel = `${rangeStart}-${rangeStart + 9}`
        groupedAges[rangeLabel] = (groupedAges[rangeLabel] || 0) + 1
    })

    const chartData = Object.entries(groupedAges).map(([range, count]) => ({
        ageRange: range,
        users: count,
    }))

    return (
        <div className="w-full h-96 mt-6">
            <h2 className="text-xl font-semibold mb-4">User Age Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
