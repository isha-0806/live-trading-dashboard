// modules
import { useState, useContext } from "react";
// context
import { SymbolContext } from "../context/SymbolContext";
// components
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
// constants
import { NOTIF_COLORS } from "../constants";
// services
import Orders from "../services/Orders";

export default function OrderForm() {
  const { symbol } = useContext(SymbolContext);
  const [qty, setQty] = useState(10);
  const [price, setPrice] = useState("");
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, text, side, bgColor) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, text, side, bgColor }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const placeOrder = async (side) => {
    console.log("Placing order:", { symbol, side, qty, price });
    try {
      const res = await Orders.placeOrder({ symbol, side, qty, price });
      const data = await res.json();

      console.log("Order response:", data);

      if (data.error) {
        addNotification("error", data.error, side, NOTIF_COLORS["error"]);
      } else {
        addNotification(
          "success",
          `${side} order placed successfully for ${symbol}!`,
          side,
          NOTIF_COLORS[side]
        );
      }
    } catch {
      addNotification(
        "error",
        "Failed to place order",
        side,
        NOTIF_COLORS["error"]
      );
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Place Order ({symbol})
          </Typography>

          <Stack spacing={2}>
            <Stack spacing={2}>
              <TextField
                size="small"
                type="number"
                label="Quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                type="number"
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => placeOrder("BUY")}
                fullWidth
                sx={{
                  bgcolor: "#16a34a",
                  "&:hover": { bgcolor: "#15803d" },
                }}
              >
                BUY
              </Button>
              <Button
                variant="contained"
                onClick={() => placeOrder("SELL")}
                fullWidth
                sx={{
                  bgcolor: "#ea580c",
                  "&:hover": { bgcolor: "#c2410c" },
                }}
              >
                SELL
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {notifications.map((notification, i) => (
        <Snackbar
          key={notification.id}
          open
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            top: `${i * 70}px !important`,
            m: 0,
          }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            sx={{
              bgcolor: notification.bgColor,
              color: "white",
              fontWeight: 600,
              width: "100%",
            }}
          >
            {notification.text}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
