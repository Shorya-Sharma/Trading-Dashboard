import pytest
import time
from unittest.mock import Mock, patch, MagicMock
from fastapi import HTTPException

from app.models.order import OrderCreateRequest, OrderResponse
from app.models.symbol import Symbol
from app.repositories.order_repository import OrderRepository
from app.services.order_service import OrderService


class TestOrderService:
    """Test cases for OrderService class."""

    @pytest.fixture
    def mock_repository(self):
        """Create a mock OrderRepository."""
        return Mock(spec=OrderRepository)

    @pytest.fixture
    def sample_symbols(self):
        """Create sample symbols for testing."""
        return [
            Symbol(
                symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
            ),
            Symbol(
                symbol="GOOGL",
                name="Alphabet Inc.",
                market="NASDAQ",
                close_price=2800.0,
            ),
            Symbol(
                symbol="MSFT",
                name="Microsoft Corp.",
                market="NASDAQ",
                close_price=300.0,
            ),
        ]

    @pytest.fixture
    def order_service(self, mock_repository, sample_symbols):
        """Create OrderService instance with mocked dependencies."""
        return OrderService(repository=mock_repository, symbols=sample_symbols)

    @pytest.fixture
    def valid_order_request(self):
        """Create a valid order request."""
        return OrderCreateRequest(symbol="AAPL", side="BUY", quantity=10, price=155.0)

    def test_init(self, mock_repository, sample_symbols):
        """Test OrderService initialization."""
        service = OrderService(repository=mock_repository, symbols=sample_symbols)

        assert service.repository == mock_repository
        assert len(service.symbols) == 3
        assert "AAPL" in service.symbols
        assert "GOOGL" in service.symbols
        assert "MSFT" in service.symbols
        assert service.symbols["AAPL"].close_price == 150.0

    def test_validate_order_valid_request(self, order_service, valid_order_request):
        """Test validation of a valid order request."""
        with patch("time.time", return_value=1640995200):  # Mock timestamp
            result = order_service._validate_order(valid_order_request)

        assert isinstance(result, OrderResponse)
        assert result.symbol == "AAPL"
        assert result.side == "BUY"
        assert result.quantity == 10
        assert result.price == 155.0
        assert result.id == 1640995200000  # time * 1000
        assert result.timestamp == 1640995200

    def test_validate_order_invalid_symbol(self, order_service):
        """Test validation fails with invalid symbol."""
        invalid_request = OrderCreateRequest(
            symbol="INVALID", side="BUY", quantity=10, price=155.0
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service._validate_order(invalid_request)

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Invalid symbol"

    def test_validate_order_price_too_low(self, order_service):
        """Test validation fails when price is too low."""
        low_price_request = OrderCreateRequest(
            symbol="AAPL",
            side="BUY",
            quantity=10,
            price=100.0,  # Below 80% of close_price (120.0)
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service._validate_order(low_price_request)

        assert exc_info.value.status_code == 400
        assert "Price 100.0 out of range for AAPL" in exc_info.value.detail
        assert "allowed: 120.00 - 180.00" in exc_info.value.detail

    def test_validate_order_price_too_high(self, order_service):
        """Test validation fails when price is too high."""
        high_price_request = OrderCreateRequest(
            symbol="AAPL",
            side="BUY",
            quantity=10,
            price=200.0,  # Above 120% of close_price (180.0)
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service._validate_order(high_price_request)

        assert exc_info.value.status_code == 400
        assert "Price 200.0 out of range for AAPL" in exc_info.value.detail
        assert "allowed: 120.00 - 180.00" in exc_info.value.detail

    def test_validate_order_price_at_min_boundary(self, order_service):
        """Test validation passes when price is at minimum boundary."""
        min_price_request = OrderCreateRequest(
            symbol="AAPL",
            side="BUY",
            quantity=10,
            price=120.0,  # Exactly 80% of close_price
        )

        with patch("time.time", return_value=1640995200):
            result = order_service._validate_order(min_price_request)

        assert result.price == 120.0

    def test_validate_order_price_at_max_boundary(self, order_service):
        """Test validation passes when price is at maximum boundary."""
        max_price_request = OrderCreateRequest(
            symbol="AAPL",
            side="BUY",
            quantity=10,
            price=180.0,  # Exactly 120% of close_price
        )

        with patch("time.time", return_value=1640995200):
            result = order_service._validate_order(max_price_request)

        assert result.price == 180.0

    def test_create_order_success(self, order_service, valid_order_request):
        """Test successful order creation."""
        with patch("time.time", return_value=1640995200):
            result = order_service.create_order(valid_order_request)

        assert isinstance(result, OrderResponse)
        assert result.symbol == "AAPL"
        assert result.side == "BUY"
        assert result.quantity == 10
        assert result.price == 155.0
        assert result.id == 1640995200000
        assert result.timestamp == 1640995200

        # Verify repository was called
        order_service.repository.save_order.assert_called_once_with(result)

    def test_create_order_repository_error(self, order_service, valid_order_request):
        """Test order creation fails when repository raises an exception."""
        order_service.repository.save_order.side_effect = Exception("Database error")

        with pytest.raises(Exception) as exc_info:
            order_service.create_order(valid_order_request)

        assert str(exc_info.value) == "Database error"

    def test_create_order_invalid_symbol(self, order_service):
        """Test order creation fails with invalid symbol."""
        invalid_request = OrderCreateRequest(
            symbol="INVALID", side="BUY", quantity=10, price=155.0
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service.create_order(invalid_request)

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Invalid symbol"

        # Verify repository was not called
        order_service.repository.save_order.assert_not_called()

    def test_create_order_invalid_price(self, order_service):
        """Test order creation fails with invalid price."""
        invalid_request = OrderCreateRequest(
            symbol="AAPL", side="BUY", quantity=10, price=200.0  # Too high
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service.create_order(invalid_request)

        assert exc_info.value.status_code == 400
        assert "Price 200.0 out of range" in exc_info.value.detail

        # Verify repository was not called
        order_service.repository.save_order.assert_not_called()

    def test_list_orders_success(self, order_service):
        """Test successful listing of orders."""
        mock_orders = [
            OrderResponse(
                id=1,
                symbol="AAPL",
                side="BUY",
                quantity=10,
                price=155.0,
                timestamp=1640995200,
            ),
            OrderResponse(
                id=2,
                symbol="AAPL",
                side="SELL",
                quantity=5,
                price=160.0,
                timestamp=1640995300,
            ),
        ]
        order_service.repository.load_orders.return_value = mock_orders

        result = order_service.list_orders("AAPL")

        assert result == mock_orders
        order_service.repository.load_orders.assert_called_once_with("AAPL")

    def test_list_orders_invalid_symbol(self, order_service):
        """Test listing orders fails with invalid symbol."""
        with pytest.raises(HTTPException) as exc_info:
            order_service.list_orders("INVALID")

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Invalid symbol"

        # Verify repository was not called
        order_service.repository.load_orders.assert_not_called()

    def test_list_orders_repository_error(self, order_service):
        """Test listing orders fails when repository raises an exception."""
        order_service.repository.load_orders.side_effect = Exception("File read error")

        with pytest.raises(Exception) as exc_info:
            order_service.list_orders("AAPL")

        assert str(exc_info.value) == "File read error"

    def test_different_symbols_price_ranges(self, order_service):
        """Test price validation works correctly for different symbols."""
        # GOOGL has close_price of 2800.0, so range is 2240.0 - 3360.0

        # Test valid price for GOOGL
        valid_googl_request = OrderCreateRequest(
            symbol="GOOGL", side="BUY", quantity=1, price=3000.0
        )

        with patch("time.time", return_value=1640995200):
            result = order_service._validate_order(valid_googl_request)

        assert result.symbol == "GOOGL"
        assert result.price == 3000.0

        # Test invalid price for GOOGL
        invalid_googl_request = OrderCreateRequest(
            symbol="GOOGL", side="BUY", quantity=1, price=2000.0  # Below minimum
        )

        with pytest.raises(HTTPException) as exc_info:
            order_service._validate_order(invalid_googl_request)

        assert exc_info.value.status_code == 400
        assert "Price 2000.0 out of range for GOOGL" in exc_info.value.detail

    def test_buy_and_sell_orders(self, order_service):
        """Test both BUY and SELL orders are handled correctly."""
        buy_request = OrderCreateRequest(
            symbol="AAPL", side="BUY", quantity=10, price=155.0
        )

        sell_request = OrderCreateRequest(
            symbol="AAPL", side="SELL", quantity=5, price=160.0
        )

        with patch("time.time", return_value=1640995200):
            buy_result = order_service._validate_order(buy_request)
            sell_result = order_service._validate_order(sell_request)

        assert buy_result.side == "BUY"
        assert sell_result.side == "SELL"
        assert buy_result.quantity == 10
        assert sell_result.quantity == 5

    def test_order_id_uniqueness(self, order_service, valid_order_request):
        """Test that order IDs are unique based on timestamp."""
        with patch(
            "time.time", side_effect=[1640995200, 1640995200, 1640995201, 1640995201]
        ):
            result1 = order_service._validate_order(valid_order_request)
            result2 = order_service._validate_order(valid_order_request)

        assert result1.id == 1640995200000
        assert result2.id == 1640995201000
        assert result1.id != result2.id
