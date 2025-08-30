import { useEffect, useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { fetchOrders } from '../api/orders';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function OrdersTable() {
  const symbol = useStore(s => s.selectedSymbol);
  const [rows, setRows] = useState([]);

  const loadOrders = useCallback(() => {
    if (symbol) fetchOrders(symbol).then(setRows);
  }, [symbol]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (!symbol) return null;

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'side', headerName: 'Side', width: 100 },
    { field: 'qty', headerName: 'Qty', width: 100 },
    { field: 'price', headerName: 'Price', width: 120 },
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 200,
      valueFormatter: params => new Date(params.value * 1000).toLocaleString(),
    },
  ];

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Orders for {symbol}</Typography>
        <Button onClick={loadOrders} variant="outlined" sx={{ mb: 2 }}>
          Refresh
        </Button>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} getRowId={row => row.id} />
        </div>
      </CardContent>
    </Card>
  );
}
