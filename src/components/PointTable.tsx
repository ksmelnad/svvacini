"use client"
import React from 'react';
import { Point } from 'peaks.js';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface PointTableProps {
  points: Point[];
}

const PointTable: React.FC<PointTableProps> = ({ points }) => {
  if (!points || points.length === 0) return null;

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold">Points</h2>
      <Table className="max-w-sm mt-2 table-auto">
        <TableHeader className="bg-gray-200">
          <TableRow>
            {/* <th>ID</th> */}
            <TableHead>Label</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {points.map(point => (
            <TableRow key={point.id}>
              {/* <td>{point.id}</td> */}
              <TableCell>{point.labelText}</TableCell>
              <TableCell>{point.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PointTable;
