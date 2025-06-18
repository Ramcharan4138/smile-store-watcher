
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface DataTableProps {
  data: any[];
}

const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmotion, setFilterEmotion] = useState("all");

  // Generate some sample data if none provided
  const sampleData = data.length > 0 ? data : [
    { id: 1, timestamp: "10:15:32", emotion: "Happy", location: "Entry Door", confidence: 85 },
    { id: 2, timestamp: "10:18:45", emotion: "Neutral", location: "Checkout Area", confidence: 72 },
    { id: 3, timestamp: "10:22:10", emotion: "Surprised", location: "Exit Door", confidence: 68 },
    { id: 4, timestamp: "10:25:33", emotion: "Happy", location: "Entry Door", confidence: 91 },
    { id: 5, timestamp: "10:28:22", emotion: "Sad", location: "Checkout Area", confidence: 76 },
  ];

  const filteredData = sampleData.filter(row => {
    const matchesSearch = row.emotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEmotion === "all" || row.emotion === filterEmotion;
    return matchesSearch && matchesFilter;
  });

  const getEmotionColor = (emotion: string) => {
    const colors = {
      "Happy": "bg-green-100 text-green-800",
      "Neutral": "bg-gray-100 text-gray-800",
      "Surprised": "bg-yellow-100 text-yellow-800",
      "Sad": "bg-blue-100 text-blue-800",
      "Angry": "bg-red-100 text-red-800"
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detection Records</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-input rounded-md px-3 py-2 text-sm"
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
            >
              <option value="all">All Emotions</option>
              <option value="Happy">Happy</option>
              <option value="Neutral">Neutral</option>
              <option value="Surprised">Surprised</option>
              <option value="Sad">Sad</option>
              <option value="Angry">Angry</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium">Location</th>
                <th className="text-left py-3 px-4 font-medium">Expression</th>
                <th className="text-left py-3 px-4 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{row.timestamp}</td>
                  <td className="py-3 px-4">{row.location}</td>
                  <td className="py-3 px-4">
                    <Badge className={getEmotionColor(row.emotion)}>
                      {row.emotion}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${row.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{row.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No records found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
