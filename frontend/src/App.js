import React, { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import {
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "./api";
import { Link, Routes, Route } from "react-router-dom";
import QuantityHistoryPage from "./pages/QuantityHistory";

export default function App() {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mediums, setMediums] = useState([]);

  const refreshData = async () => {
    try {
      const [itemRes, locationRes, mediumRes] = await Promise.all([
        api.get("items/"),
        api.get("storage-locations/"),
        api.get("storage-mediums/"),
      ]);
      setData(itemRes.data);
      setLocations(locationRes.data);
      setMediums(mediumRes.data);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Item Name",
        enableEditing: true,
        Cell: ({ cell }) => cell.getValue() ?? "—",
      },
      {
        accessorKey: "codename",
        header: "Codename",
        enableEditing: true,
        Cell: ({ cell }) => cell.getValue() ?? "—",
      },
      {
        accessorKey: "storage_medium",
        header: "Storage Medium",
        accessorFn: (row) => {
          const med = mediums.find((m) => m.id === row.storage_medium);
          return med?.name ?? row.storage_medium;
        },
        Cell: ({ cell }) => cell.getValue() ?? "—",
        enableEditing: true,
      },
      {
        accessorKey: "storage_location",
        header: "Storage Location",
        accessorFn: (row) => {
          const loc = locations.find((l) => l.id === row.storage_location);
          return loc?.name ?? row.storage_location;
        },
        Cell: ({ cell }) => cell.getValue() ?? "—",
        enableEditing: true,
      },
      {
        accessorKey: "tracked",
        header: "Tracked",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        Edit: ({ cell, row, column }) => {
          const value = cell.getValue();
          return (
            <FormControl fullWidth size="small">
              <InputLabel id={`tracked-label-${row.id}`}>Tracked?</InputLabel>
              <Select
                labelId={`tracked-label-${row.id}`}
                id={`tracked-select-${row.id}`}
                value={value ? "true" : "false"}
                label="Tracked?"
                onChange={(e) => {
                  row._valuesCache[column.id] = e.target.value === "true";
                }}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        editVariant: "text",
        Cell: ({ cell }) => cell.getValue() ?? "—",
      },
    ],
    [locations, mediums]
  );

  const table = useMaterialReactTable({
    data,
    columns,
    createDisplayMode: "modal",
    enableRowActions: true,
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((oldData) =>
          oldData.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },

    onCreatingRowSave: async ({ values, table }) => {
      try {
        await api.post("items/", values);
        table.setCreatingRow(null);
        await refreshData();
      } catch (error) {
        console.error("Failed to create item", error);
      }
    },

    onEditingRowSave: async ({ values, row, table }) => {
      try {
        const itemId = row.original.id;
        await api.put(`items/${itemId}/`, values);
        await refreshData();
        table.setEditingRow(null);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },

    muiCreateRowModalProps: {
      title: "Add Item",
    },
    muiEditRowModalProps: {
      title: "Edit Item",
    },

    renderRowActions: ({ row, table }) => (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => table.setEditingRow(row)}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={async () => {
            if (window.confirm("Delete this item?")) {
              await api.delete(`items/${row.original.id}/`);
              await refreshData();
            }
          }}
        >
          Delete
        </Button>
      </Stack>
    ),
  });

  if (!locations.length || !mediums.length) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: "2rem" }}>
            <h1 style={{ fontWeight: "600", marginBottom: "1rem" }}>
              Inventory Tracking System
            </h1>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => table.setCreatingRow(true)}
              sx={{ marginBottom: "1.5rem" }}
            >
              Add Item
            </Button>

            <Button
              variant="outlined"
              component={Link}
              to="/history"
              sx={{ marginBottom: "1.5rem", marginLeft: "1rem" }}
            >
              View Quantity History
            </Button>

            <MaterialReactTable table={table} />
          </div>
        }
      />

      <Route path="/history" element={<QuantityHistoryPage />} />
    </Routes>
  );
}
