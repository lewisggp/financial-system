// Table.tsx
import React from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Button } from "@mui/material";

type TableProps<T> = {
  columns: any;
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

const Table = <T,>({ columns, data, onEdit, onDelete }: TableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{
                  textAlign: "center",
                  padding: "8px",
                  borderBottom: "2px solid #ddd",
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th
                key={"acciones"}
                style={{
                  textAlign: "center",
                  padding: "8px",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Acciones
              </th>
            )}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  textAlign: "center",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
            <td
              style={{
                textAlign: "center",
                padding: "8px",
                borderBottom: "1px solid #ddd",
              }}
            >
              {onEdit && (
                <Button color="primary" onClick={() => onEdit(row.original)}>
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button color="error" onClick={() => onDelete(row.original)}>
                  Eliminar
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
