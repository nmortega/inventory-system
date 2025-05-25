import React, { useEffect, useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import api from "../api"; // Adjust the path if needed

export default function QuantityHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [items, setItems] = useState([]);

  // Fetch quantity history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("quantity-history/");
        setHistoryData(res.data);
      } catch (error) {
        console.error("Error fetching quantity history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Fetch item names
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("items/");
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "item",
        header: "Item",
        Cell: ({ cell }) => {
          const itemId = cell.getValue();
          const item = items.find((i) => i.id === itemId);
          return item?.name || `Item #${itemId}`;
        },
      },
      {
        accessorKey: "change",
        header: "Change",
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        Cell: ({ cell }) =>
          new Date(cell.getValue()).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
    ],
    [items]
  );

  const table = useMaterialReactTable({
    columns,
    data: historyData,
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: "600", marginBottom: "1rem" }}>
        Quantity History Log
      </h2>
      <MaterialReactTable table={table} />
    </div>
  );
}
