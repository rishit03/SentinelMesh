import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const DataTable = ({
  data,
  columns,
  loading,
  filterKey,
  onRowClick,
  emptyMessage = "No data available."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    let sortableData = [...data];

    if (sortColumn) {
      sortableData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
      });
    }
    return sortableData;
  }, [data, sortColumn, sortDirection]);

  const filteredData = useMemo(() => {
    if (!filterKey || !searchTerm) return sortedData;
    return sortedData.filter(item =>
      String(item[filterKey]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, filterKey, searchTerm]);

  return (
    <div className="w-full">
      {filterKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={`Search ${filterKey}...`}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
          <Search className="ml-2 h-4 w-4 text-slate-500" />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessor} onClick={() => column.sortable && handleSort(column.accessor)} className={column.sortable ? 'cursor-pointer' : ''}>
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortColumn === column.accessor && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={row.id || index} onClick={() => onRowClick && onRowClick(row)} className={onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''}>
                  {columns.map((column) => (
                    <TableCell key={column.accessor}>
                      {column.render ? column.render(row) : row[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;


