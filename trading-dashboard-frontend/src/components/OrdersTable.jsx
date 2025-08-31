import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  TextField,
  Skeleton,
  IconButton,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { fetchOrders } from '../api/orders';
import { useDispatch, useSelector } from 'react-redux';
import { loadSymbols } from '../store/symbolsSlice';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

/**
 * OrdersTable allows users to select a symbol and view its orders
 * with sorting, refresh, live mode, and skeleton loading.
 */
export default function OrdersTable({ defaultSymbol = null }) {
  const dispatch = useDispatch();
  const { list: symbols, status } = useSelector(state => state.symbols);

  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [orders, setOrders] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);

  const loadOrders = async () => {
    if (!selectedSymbol?.symbol) return;
    try {
      setLoading(true);
      const data = await fetchOrders(selectedSymbol.symbol);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadSymbols());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedSymbol?.symbol) {
      loadOrders();
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (!liveMode || !selectedSymbol?.symbol) return;
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [liveMode, selectedSymbol]);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Symbol', accessorKey: 'symbol' },
    {
      header: 'Side',
      accessorKey: 'side',
      cell: info => (
        <Typography
          sx={{
            fontWeight: 700,
            color: info.getValue() === 'BUY' ? '#00e676' : '#ff1744',
          }}
        >
          {info.getValue()}
        </Typography>
      ),
    },
    { header: 'Quantity', accessorKey: 'quantity' },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: info => (
        <Typography
          sx={{
            fontWeight: 600,
            color: info.row.original.side === 'BUY' ? '#00e676' : '#ff1744',
          }}
        >
          {info.getValue()}
        </Typography>
      ),
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: info => new Date(info.getValue() * 1000).toLocaleTimeString(),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 4,
        mt: 4,
        background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 1, color: '#00f5a0' }}
        >
          Orders Book
        </Typography>

        <Autocomplete
          options={symbols}
          getOptionLabel={option => `${option.symbol} — ${option.name}`}
          value={selectedSymbol}
          onChange={(e, newValue) => setSelectedSymbol(newValue)}
          renderInput={params => (
            <TextField
              {...params}
              label="Select Symbol"
              size="small"
              InputLabelProps={{ style: { color: 'white' } }}
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: '#00f5a0' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiSvgIcon-root': { color: 'white' },
              }}
            />
          )}
        />
      </Box>

      {/* Controls */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={loadOrders}
          disabled={!selectedSymbol}
          sx={{
            borderColor: '#00f5a0',
            color: '#00f5a0',
            '&:hover': {
              borderColor: '#00c6ff',
              background: 'rgba(0, 198, 255, 0.1)',
            },
          }}
        >
          Refresh
        </Button>

        <FormControlLabel
          control={
            <Switch
              checked={liveMode}
              onChange={e => setLiveMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-thumb': { backgroundColor: '#00f5a0' },
                '& .Mui-checked': { color: '#00f5a0' },
              }}
            />
          }
          label="Live Mode"
          sx={{ color: 'white' }}
        />
      </Box>

      {/* Table */}
      {selectedSymbol ? (
        loading ? (
          <Box>
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 1,
                }}
              >
                <Skeleton variant="rectangular" width="15%" height={30} />
                <Skeleton variant="rectangular" width="15%" height={30} />
                <Skeleton variant="rectangular" width="15%" height={30} />
                <Skeleton variant="rectangular" width="15%" height={30} />
                <Skeleton variant="rectangular" width="15%" height={30} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box component="thead" sx={{ background: '#1e293b' }}>
              {table.getHeaderGroups().map(headerGroup => (
                <Box
                  component="tr"
                  key={headerGroup.id}
                  sx={{
                    '& th': {
                      p: 1.5,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: '#e2e8f0',
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                    },
                  }}
                >
                  {headerGroup.headers.map(header => (
                    <Box
                      component="th"
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <IconButton size="small" sx={{ color: 'inherit' }}>
                          {{
                            asc: <ArrowUpwardIcon fontSize="small" />,
                            desc: <ArrowDownwardIcon fontSize="small" />,
                          }[header.column.getIsSorted()] ?? (
                            <UnfoldMoreIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>

            <Box component="tbody">
              {table.getRowModel().rows.map(row => (
                <Box
                  component="tr"
                  key={row.id}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': { background: 'rgba(255,255,255,0.08)' },
                    '& td': {
                      p: 1.5,
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <Box component="td" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        )
      ) : (
        <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
          Please select a symbol to view orders
        </Typography>
      )}
    </Paper>
  );
}
