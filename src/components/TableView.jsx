import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TableView = ({ data }) => {
    const { headers, rows } = data;

    if (!headers || !rows) {
        return <div className="text-sm text-muted-foreground">No table data available</div>;
    }

    return (
        <Card className="w-full">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                {headers.map((header, index) => (
                                    <th key={index} className="p-3 text-left font-medium">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b hover:bg-muted/30">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-3">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TableView;