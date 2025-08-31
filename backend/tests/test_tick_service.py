import pytest
import random
import time
from unittest.mock import Mock, patch, MagicMock

from app.models.symbol import Symbol
from app.services.symbol_service import SymbolService
from app.services.tick_service import TickService


class TestTickService:
    """Test cases for TickService class."""

    @pytest.fixture
    def mock_symbol_service(self):
        """Create a mock SymbolService."""
        return Mock(spec=SymbolService)

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
    def tick_service(self, mock_symbol_service):
        """Create TickService instance with mocked dependencies."""
        service = TickService()
        service.symbol_service = mock_symbol_service
        return service

    def test_init(self):
        """Test TickService initialization."""
        with patch(
            "app.services.tick_service.SymbolService"
        ) as mock_symbol_service_class:
            mock_symbol_service_instance = Mock()
            mock_symbol_service_class.return_value = mock_symbol_service_instance

            service = TickService()

            mock_symbol_service_class.assert_called_once()
            assert service.symbol_service == mock_symbol_service_instance

    def test_get_tick_for_symbol_valid_symbol(
        self, tick_service, mock_symbol_service, sample_symbols
    ):
        """Test successful tick generation for valid symbol."""
        # Mock the symbol service to return our sample symbols
        mock_symbol_service.get_all_symbols.return_value = sample_symbols

        # Mock random and time for predictable results
        with patch("random.uniform", return_value=157.5), patch(
            "random.randint", return_value=500
        ), patch("time.time", return_value=1640995200):

            result = tick_service.get_tick_for_symbol("AAPL")

        assert isinstance(result, dict)
        assert result["symbol"] == "AAPL"
        assert result["price"] == 157.5
        assert result["volume"] == 500
        assert result["timestamp"] == 1640995200

        # Verify symbol service was called
        mock_symbol_service.get_all_symbols.assert_called_once()

    def test_get_tick_for_symbol_invalid_symbol(
        self, tick_service, mock_symbol_service, sample_symbols
    ):
        """Test tick generation for invalid symbol returns error."""
        mock_symbol_service.get_all_symbols.return_value = sample_symbols

        result = tick_service.get_tick_for_symbol("INVALID")

        assert isinstance(result, dict)
        assert "error" in result
        assert result["error"] == "Invalid symbol: INVALID"

        # Verify symbol service was called
        mock_symbol_service.get_all_symbols.assert_called_once()

    def test_get_tick_for_symbol_case_sensitive(
        self, tick_service, mock_symbol_service, sample_symbols
    ):
        """Test that symbol matching is case sensitive."""
        mock_symbol_service.get_all_symbols.return_value = sample_symbols

        result = tick_service.get_tick_for_symbol("aapl")  # lowercase

        assert isinstance(result, dict)
        assert "error" in result
        assert result["error"] == "Invalid symbol: aapl"

    def test_get_tick_for_symbol_empty_symbols_list(
        self, tick_service, mock_symbol_service
    ):
        """Test tick generation when no symbols are available."""
        mock_symbol_service.get_all_symbols.return_value = []

        result = tick_service.get_tick_for_symbol("AAPL")

        assert isinstance(result, dict)
        assert "error" in result
        assert result["error"] == "Invalid symbol: AAPL"

    def test_get_tick_for_symbol_symbol_service_error(
        self, tick_service, mock_symbol_service
    ):
        """Test handling of symbol service errors."""
        mock_symbol_service.get_all_symbols.side_effect = Exception(
            "Symbol service error"
        )

        with pytest.raises(Exception) as exc_info:
            tick_service.get_tick_for_symbol("AAPL")

        assert str(exc_info.value) == "Symbol service error"

    def test_generate_tick_price_range(self, tick_service):
        """Test that generated tick price is within ±5% range of base price."""
        symbol = Symbol(
            symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
        )

        # Test multiple random generations
        for _ in range(100):
            with patch("random.uniform") as mock_uniform, patch(
                "random.randint", return_value=100
            ), patch("time.time", return_value=1640995200):

                # Mock random.uniform to return a value within our expected range
                mock_uniform.return_value = 155.0  # Within ±5% range

                result = tick_service._generate_tick(symbol)

                assert result["symbol"] == "AAPL"
                assert result["price"] == 155.0
                assert result["volume"] == 100
                assert result["timestamp"] == 1640995200

    def test_generate_tick_price_calculation(self, tick_service):
        """Test that price calculation uses correct base price and range."""
        symbol = Symbol(
            symbol="GOOGL", name="Alphabet Inc.", market="NASDAQ", close_price=2800.0
        )

        with patch("random.uniform") as mock_uniform, patch(
            "random.randint", return_value=200
        ), patch("time.time", return_value=1640995200):

            # Mock random.uniform to verify it's called with correct range
            mock_uniform.return_value = 2900.0

            result = tick_service._generate_tick(symbol)

            # Verify random.uniform was called with correct range (±5% of 2800)
            expected_min = 2800.0 * 0.95  # 2660.0
            expected_max = 2800.0 * 1.05  # 2940.0
            mock_uniform.assert_called_once_with(expected_min, expected_max)

            assert result["price"] == 2900.0
            assert result["volume"] == 200

    def test_generate_tick_volume_range(self, tick_service):
        """Test that generated volume is within expected range (1-1000)."""
        symbol = Symbol(
            symbol="MSFT", name="Microsoft Corp.", market="NASDAQ", close_price=300.0
        )

        # Test multiple volume generations
        volumes = []
        for _ in range(50):
            with patch("random.uniform", return_value=310.0), patch(
                "random.randint"
            ) as mock_randint, patch("time.time", return_value=1640995200):

                mock_randint.return_value = 500
                result = tick_service._generate_tick(symbol)
                volumes.append(result["volume"])

                # Verify random.randint was called with correct range
                mock_randint.assert_called_with(1, 1000)

        # All volumes should be 500 (our mocked value)
        assert all(v == 500 for v in volumes)

    def test_generate_tick_timestamp(self, tick_service):
        """Test that timestamp is correctly set."""
        symbol = Symbol(
            symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
        )

        test_timestamp = 1640995200
        with patch("random.uniform", return_value=155.0), patch(
            "random.randint", return_value=100
        ), patch("time.time", return_value=test_timestamp):

            result = tick_service._generate_tick(symbol)

            assert result["timestamp"] == test_timestamp

    def test_generate_tick_rounding(self, tick_service):
        """Test that price is rounded to 2 decimal places."""
        symbol = Symbol(
            symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
        )

        with patch("random.uniform", return_value=155.123456), patch(
            "random.randint", return_value=100
        ), patch("time.time", return_value=1640995200):

            result = tick_service._generate_tick(symbol)

            assert result["price"] == 155.12  # Should be rounded to 2 decimal places

    def test_generate_tick_edge_cases(self, tick_service):
        """Test tick generation with edge case prices."""
        # Test with very low price
        low_symbol = Symbol(
            symbol="PENNY", name="Penny Stock", market="OTC", close_price=0.01
        )
        with patch("random.uniform", return_value=0.0095), patch(
            "random.randint", return_value=1
        ), patch("time.time", return_value=1640995200):

            result = tick_service._generate_tick(low_symbol)
            assert result["price"] == 0.01  # Should be rounded to 2 decimal places

        # Test with very high price
        high_symbol = Symbol(
            symbol="EXPENSIVE",
            name="Expensive Stock",
            market="NYSE",
            close_price=10000.0,
        )
        with patch("random.uniform", return_value=10500.0), patch(
            "random.randint", return_value=1000
        ), patch("time.time", return_value=1640995200):

            result = tick_service._generate_tick(high_symbol)
            assert result["price"] == 10500.0

    def test_get_tick_for_symbol_multiple_calls(
        self, tick_service, mock_symbol_service, sample_symbols
    ):
        """Test that multiple calls work correctly and don't interfere with each other."""
        mock_symbol_service.get_all_symbols.return_value = sample_symbols

        with patch("random.uniform", side_effect=[155.0, 2850.0, 305.0]), patch(
            "random.randint", side_effect=[100, 200, 300]
        ), patch("time.time", return_value=1640995200):

            # Get ticks for different symbols
            result1 = tick_service.get_tick_for_symbol("AAPL")
            result2 = tick_service.get_tick_for_symbol("GOOGL")
            result3 = tick_service.get_tick_for_symbol("MSFT")

            assert result1["symbol"] == "AAPL"
            assert result1["price"] == 155.0
            assert result1["volume"] == 100

            assert result2["symbol"] == "GOOGL"
            assert result2["price"] == 2850.0
            assert result2["volume"] == 200

            assert result3["symbol"] == "MSFT"
            assert result3["price"] == 305.0
            assert result3["volume"] == 300

    def test_get_tick_for_symbol_symbol_not_found_after_filter(
        self, tick_service, mock_symbol_service
    ):
        """Test case where symbol service returns symbols but the specific symbol is not found."""
        # Return symbols that don't include the requested symbol
        other_symbols = [
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
        mock_symbol_service.get_all_symbols.return_value = other_symbols

        result = tick_service.get_tick_for_symbol("AAPL")

        assert isinstance(result, dict)
        assert "error" in result
        assert result["error"] == "Invalid symbol: AAPL"
