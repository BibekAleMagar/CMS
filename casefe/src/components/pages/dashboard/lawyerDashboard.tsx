"use client";

import { useLawyerDashboard } from "@/src/hooks/query/user";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const LawyerDashboard = () => {
  const { data, isLoading, error } = useLawyerDashboard();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;

  // 🔹 Case Status Data
  const caseStatusData = [
    { name: "Pending", value: data?.caseSummary?.byStatus?.pending || 0 },
    {
      name: "In Progress",
      value: data?.caseSummary?.byStatus?.inProgress || 0,
    },
    {
      name: "Under Review",
      value: data?.caseSummary?.byStatus?.underReview || 0,
    },
    { name: "Resolved", value: data?.caseSummary?.byStatus?.resolved || 0 },
    { name: "Closed", value: data?.caseSummary?.byStatus?.closed || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Client Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Clients", value: data?.clientOverview?.totalClients },
          {
            title: "New This Month",
            value: data?.clientOverview?.newClientsThisMonth,
          },
          {
            title: "Active Clients",
            value: data?.clientOverview?.activeClients,
          },
          {
            title: "Inactive Clients",
            value: data?.clientOverview?.inactiveClients,
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔥 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📊 Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Case Status (Bar)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={caseStatusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {caseStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🥧 Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Case Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={caseStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {caseStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📈 Line Chart */}
        {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Case Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* 📅 Upcoming Hearings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Hearings</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.caseSummary?.upcomingDeadlines?.length === 0 ? (
            <p>No upcoming hearings</p>
          ) : (
            data?.caseSummary.upcomingDeadlines.map((item: any) => (
              <div
                key={item.caseId}
                className="flex justify-between border-b py-2"
              >
                <span>Case #{item.caseId}</span>
                <span>{new Date(item.nextHearing).toLocaleString()}</span>
                <span className="font-medium">{item.status}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyerDashboard;
