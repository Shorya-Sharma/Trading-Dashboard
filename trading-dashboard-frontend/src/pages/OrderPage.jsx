import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSymbols } from '../store/symbolsSlice';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from '@mui/material';
import Header from '../components/Header';
import { submitOrder } from '../api/orders';
import { showNotification, NotificationType } from '../store/notificationSlice';

/**
 * OrderPage allows users to place BUY/SELL orders for a selected symbol
 * with quantity and price inputs. Includes validation with live updates
 * after a field has been touched and ensures all fields validate on submit.
 */
export default function OrderPage() {
  const dispatch = useDispatch();
  const { list: availableSymbols, status: symbolsStatus } = useSelector(
    state => state.symbols
  );

  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [orderSide, setOrderSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    symbol: '',
    quantity: '',
    price: '',
  });

  const [fieldTouched, setFieldTouched] = useState({
    symbol: false,
    quantity: false,
    price: false,
  });

  useEffect(() => {
    if (symbolsStatus === 'idle') {
      dispatch(loadSymbols());
    }
  }, [symbolsStatus, dispatch]);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'symbol':
        return !value ? 'Symbol is required' : '';
      case 'quantity':
        return !value || Number(value) <= 0
          ? 'Quantity must be greater than 0'
          : '';
      case 'price':
        return !value || Number(value) <= 0
          ? 'Price must be greater than 0'
          : '';
      default:
        return '';
    }
  };

  const validateAllFields = () => {
    const newErrors = {
      symbol: validateField('symbol', selectedSymbol),
      quantity: validateField('quantity', quantity),
      price: validateField('price', orderPrice),
    };
    setFieldErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleFieldBlur = (field, value) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }));
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleFieldChange = (field, value) => {
    if (field === 'symbol') setSelectedSymbol(value);
    if (field === 'quantity') setQuantity(value);
    if (field === 'price') setOrderPrice(value);

    if (fieldTouched[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleSubmitOrder = async () => {
    setFieldTouched({ symbol: true, quantity: true, price: true });

    if (!validateAllFields()) return;

    try {
      const order = {
        symbol: selectedSymbol,
        side: orderSide,
        qty: Number(quantity),
        price: Number(orderPrice),
      };

      const response = await submitOrder(order);

      dispatch(
        showNotification({
          message: `Order placed successfully! ID: ${response.id}`,
          type: NotificationType.SUCCESS,
        })
      );

      setSelectedSymbol('');
      setQuantity('');
      setOrderPrice('');
      setFieldErrors({ symbol: '', quantity: '', price: '' });
      setFieldTouched({ symbol: false, quantity: false, price: false });
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.error || 'Error placing order',
          type: NotificationType.ERROR,
        })
      );
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 480,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Place Order
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Box component="form" noValidate autoComplete="off">
            <Autocomplete
              options={availableSymbols.map(s => s.symbol)}
              value={selectedSymbol}
              onChange={(e, newValue) => handleFieldChange('symbol', newValue)}
              onBlur={() => handleFieldBlur('symbol', selectedSymbol)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Symbol"
                  placeholder="Select a symbol"
                  error={fieldTouched.symbol && !!fieldErrors.symbol}
                  helperText={fieldTouched.symbol && fieldErrors.symbol}
                />
              )}
              sx={{ mb: 3 }}
            />

            <ToggleButtonGroup
              value={orderSide}
              exclusive
              onChange={(e, newSide) => newSide && setOrderSide(newSide)}
              sx={{ mb: 3, width: '100%' }}
            >
              <ToggleButton
                value="BUY"
                sx={{ flex: 1, fontWeight: 700, color: '#2e7d32' }}
              >
                BUY
              </ToggleButton>
              <ToggleButton
                value="SELL"
                sx={{ flex: 1, fontWeight: 700, color: '#c62828' }}
              >
                SELL
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={e => handleFieldChange('quantity', e.target.value)}
              onBlur={() => handleFieldBlur('quantity', quantity)}
              error={fieldTouched.quantity && !!fieldErrors.quantity}
              helperText={fieldTouched.quantity && fieldErrors.quantity}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Price"
              type="number"
              fullWidth
              value={orderPrice}
              onChange={e => handleFieldChange('price', e.target.value)}
              onBlur={() => handleFieldBlur('price', orderPrice)}
              error={fieldTouched.price && !!fieldErrors.price}
              helperText={fieldTouched.price && fieldErrors.price}
              sx={{ mb: 4 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitOrder}
              sx={{
                py: 1.5,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
                },
              }}
            >
              Submit Order
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
