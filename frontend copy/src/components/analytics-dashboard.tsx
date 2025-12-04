'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Briefcase, Calendar, Target, TrendingUp } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
type Month =
	| 'January'
	| 'February'
	| 'March'
	| 'April'
	| 'May'
	| 'June'
	| 'July'
	| 'August'
	| 'September'
	| 'October'
	| 'November'
	| 'December';

interface AnalyticsDataT {
	statusCount: Record<string, number> | undefined;
	monthlyCount: Record<string, number> | undefined;
	total: number | undefined;
	isLoading: boolean;
}
export function AnalyticsDashboard({
	monthlyCount,
	statusCount,
	total,
	isLoading,
}: AnalyticsDataT) {
	//

	if (!monthlyCount || !statusCount || !total) {
		<p>Loading data</p>;
		return;
	}
	const chartData = Object.entries(statusCount).map(([status, count]) => ({
		name: status,
		value: count,
	}));

	const statusData = [
		{ name: 'Applied', value: 0, color: '#3B82F6' },
		{ name: 'Interviewing', value: 0, color: '#F59E0B' },
		{ name: 'Offer', value: 0, color: '#10B981' },
		{ name: 'Rejected', value: 0, color: '#EF4444' },
	];

	const mergedData = statusData.map((item) => {
		const found = chartData.find(
			(d) => d.name.toLowerCase() === item.name.toLowerCase()
		);
		return {
			...item,
			value: found ? found.value : 0, // default 0 if missing
		};
	});

	const monthlyData = Object.entries(monthlyCount).map(
		([monthName, count]) => ({
			month: monthName,
			applications: count,
		})
	);

	const responseRate =
		statusCount['INTERVIEWING'] + statusCount['OFFER']
			? statusCount['OFFER']
			: 0 + statusCount['REJECTED'];

	const offerRate = statusCount['OFFER'] ? statusCount['OFFER'] : 0 / total;

	const interviewRate = (statusCount['APPLIED'] / total).toFixed();
	console.log(typeof offerRate);
	const metrics = [
		{
			label: 'Total Applications',
			value: total ? total : 0,
			icon: Briefcase,
		},
		{
			label: 'Interview Rate',
			value: interviewRate !== 'NaN' ? interviewRate + '%' : 0,
			icon: Calendar,
		},
		{
			label: 'Offer Rate',
			value: offerRate > 0 ? offerRate + '%' : 0,
			icon: Target,
		},
		{
			label: 'Response Rate',
			value: responseRate > 0 ? responseRate + '%' : 0,
			icon: TrendingUp,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<TrendingUp className="h-5 w-5" />
					<span>Analytics Dashboard</span>
				</CardTitle>
				<CardDescription>Track your job search performance</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Metrics */}
				<div className="grid grid-cols-2 gap-4">
					{metrics.map((metric, index) => (
						<div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
							<metric.icon className="h-6 w-6 mx-auto text-gray-600 mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{metric.value}
							</div>
							<div className="text-sm text-gray-600">{metric.label}</div>
						</div>
					))}
				</div>

				{/* Status Distribution */}
				<div>
					<h3 className="text-lg font-semibold mb-3">Application Status</h3>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={mergedData}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{statusData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Monthly Applications */}
				<div>
					<h3 className="text-lg font-semibold mb-3">Applications Over Time</h3>
					<ResponsiveContainer width="100%" height={200}>
						<BarChart data={monthlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="applications" fill="#3B82F6" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
