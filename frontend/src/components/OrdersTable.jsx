// modules
import { useEffect, useState, useMemo, useContext } from "react";
// context
import { SymbolContext } from "../context/SymbolContext";
// components
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Table, Column, AutoSizer } from "react-virtualized";
// styles
import "react-virtualized/styles.css";
import Orders from "../services/Orders";

export default function OrdersTable() {
  const { symbol } = useContext(SymbolContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [live, setLive] = useState(false);

  const fetchOrders = async () => {
    const res = await Orders.fetchOrders(symbol);
    setOrders(res);
  };

  useEffect(() => {
    fetchOrders();

    // if auto-refresh is enabled, refresh every 3 seconds
    if (live) {
      const id = setInterval(() => {
        fetchOrders();
      }, 3000);
      return () => clearInterval(id);
    }
  }, [symbol, live]);

  const filteredOrders = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.side === filter)),
    [orders, filter]
  );

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: "70vh" }}>
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Orders ({symbol})</Typography>

          <Stack direction="row" spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={live}
                  onChange={(e) => setLive(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label="Live Mode"
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: "1rem",
                  lineHeight: "30px",
                },
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={fetchOrders}
              sx={{
                padding: "2px 10px",
                fontSize: "0.75rem",
                minWidth: "auto",
                height: 30,
              }}
            >
              Refresh
            </Button>

            <Select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                fontSize: "0.75rem",
                height: 30, // match button height
                ".MuiSelect-select": {
                  padding: "2px 10px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="BUY">BUY</MenuItem>
              <MenuItem value="SELL">SELL</MenuItem>
            </Select>
          </Stack>
        </Stack>

        <div style={{ flex: 1 }}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                width={width}
                height={height}
                headerHeight={40}
                rowHeight={40}
                rowCount={filteredOrders.length}
                rowGetter={({ index }) => filteredOrders[index]}
                overscanRowCount={10}
                rowStyle={({ index }) => ({
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                })}
                gridStyle={{
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              >
                <Column label="ID" dataKey="id" width={60} />
                <Column
                  label="Side"
                  dataKey="side"
                  width={80}
                  cellRenderer={({ cellData }) => (
                    <span
                      style={{
                        color: cellData === "BUY" ? "#16a34a" : "#ea580c",
                        fontWeight: 600,
                      }}
                    >
                      {cellData}
                    </span>
                  )}
                />
                <Column label="Qty" dataKey="qty" width={80} />
                <Column label="Price" dataKey="price" width={100} />
                <Column
                  label="Time"
                  dataKey="timestamp"
                  width={160}
                  cellRenderer={({ cellData }) =>
                    new Date(cellData * 1000).toLocaleTimeString()
                  }
                />
              </Table>
            )}
          </AutoSizer>
        </div>
      </CardContent>
    </Card>
  );
}
