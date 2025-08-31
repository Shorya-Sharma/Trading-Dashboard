import pytest
from unittest.mock import Mock, patch, MagicMock
from typing import Dict

from app.models.symbol import Symbol
from app.repositories.symbol_repository import SymbolRepository
from app.services.symbol_service import SymbolService


class TestSymbolService:
    """Test cases for SymbolService class."""

    @pytest.fixture
    def mock_repository(self):
        """Create a mock SymbolRepository."""
        return Mock(spec=SymbolRepository)

    @pytest.fixture
    def sample_symbols_dict(self):
        """Create sample symbols dictionary for testing."""
        return {
            "AAPL": Symbol(
                symbol="AAPL",
                name="Apple Inc.",
                market="NASDAQ",
                close_price=150.0,
            ),
            "GOOGL": Symbol(
                symbol="GOOGL",
                name="Alphabet Inc.",
                market="NASDAQ",
                close_price=2800.0,
            ),
            "MSFT": Symbol(
                symbol="MSFT",
                name="Microsoft Corp.",
                market="NASDAQ",
                close_price=300.0,
            ),
        }

    @pytest.fixture
    def symbol_service(self, mock_repository):
        """Create SymbolService instance with mocked repository."""
        return SymbolService(repository=mock_repository)

    def test_init_with_repository(self, mock_repository):
        """Test SymbolService initialization with provided repository."""
        service = SymbolService(repository=mock_repository)
        assert service.repository == mock_repository

    def test_init_without_repository(self):
        """Test SymbolService initialization without repository (should create default)."""
        with patch("app.services.symbol_service.SymbolRepository") as mock_repo_class:
            mock_repo_instance = Mock()
            mock_repo_class.return_value = mock_repo_instance

            service = SymbolService()

            mock_repo_class.assert_called_once()
            assert service.repository == mock_repo_instance

    def test_get_all_symbols_success(
        self, symbol_service, mock_repository, sample_symbols_dict
    ):
        """Test successful retrieval of all symbols."""
        mock_repository.load_symbols.return_value = sample_symbols_dict

        result = symbol_service.get_all_symbols()

        assert len(result) == 3
        assert isinstance(result, list)

        # Check that all symbols are present
        symbols_by_name = {s.symbol: s for s in result}
        assert "AAPL" in symbols_by_name
        assert "GOOGL" in symbols_by_name
        assert "MSFT" in symbols_by_name

        # Check symbol details
        aapl = symbols_by_name["AAPL"]
        assert aapl.name == "Apple Inc."
        assert aapl.market == "NASDAQ"
        assert aapl.close_price == 150.0

        googl = symbols_by_name["GOOGL"]
        assert googl.name == "Alphabet Inc."
        assert googl.market == "NASDAQ"
        assert googl.close_price == 2800.0

        msft = symbols_by_name["MSFT"]
        assert msft.name == "Microsoft Corp."
        assert msft.market == "NASDAQ"
        assert msft.close_price == 300.0

        # Verify repository was called
        mock_repository.load_symbols.assert_called_once()

    def test_get_all_symbols_empty_dict(self, symbol_service, mock_repository):
        """Test handling of empty symbols dictionary."""
        mock_repository.load_symbols.return_value = {}

        result = symbol_service.get_all_symbols()

        assert result == []
        mock_repository.load_symbols.assert_called_once()

    def test_get_all_symbols_repository_error(self, symbol_service, mock_repository):
        """Test handling of repository errors."""
        mock_repository.load_symbols.side_effect = FileNotFoundError(
            "Symbols file not found"
        )

        with pytest.raises(FileNotFoundError) as exc_info:
            symbol_service.get_all_symbols()

        assert str(exc_info.value) == "Symbols file not found"
        mock_repository.load_symbols.assert_called_once()

    def test_get_all_symbols_json_decode_error(self, symbol_service, mock_repository):
        """Test handling of JSON decode errors from repository."""
        import json

        mock_repository.load_symbols.side_effect = json.JSONDecodeError(
            "Invalid JSON", "", 0
        )

        with pytest.raises(json.JSONDecodeError) as exc_info:
            symbol_service.get_all_symbols()

        assert "Invalid JSON" in str(exc_info.value)
        mock_repository.load_symbols.assert_called_once()

    def test_get_all_symbols_generic_exception(self, symbol_service, mock_repository):
        """Test handling of generic exceptions from repository."""
        mock_repository.load_symbols.side_effect = Exception("Unexpected error")

        with pytest.raises(Exception) as exc_info:
            symbol_service.get_all_symbols()

        assert str(exc_info.value) == "Unexpected error"
        mock_repository.load_symbols.assert_called_once()

    def test_get_all_symbols_preserves_order(self, symbol_service, mock_repository):
        """Test that symbol order is preserved when converting dict to list."""
        # Create symbols in specific order
        ordered_symbols = {
            "AAPL": Symbol(
                symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
            ),
            "GOOGL": Symbol(
                symbol="GOOGL",
                name="Alphabet Inc.",
                market="NASDAQ",
                close_price=2800.0,
            ),
            "MSFT": Symbol(
                symbol="MSFT",
                name="Microsoft Corp.",
                market="NASDAQ",
                close_price=300.0,
            ),
        }
        mock_repository.load_symbols.return_value = ordered_symbols

        result = symbol_service.get_all_symbols()

        # In Python 3.7+, dict order is preserved, so this should work
        assert len(result) == 3
        assert result[0].symbol == "AAPL"
        assert result[1].symbol == "GOOGL"
        assert result[2].symbol == "MSFT"

    def test_get_all_symbols_single_symbol(self, symbol_service, mock_repository):
        """Test handling of single symbol in dictionary."""
        single_symbol = {
            "AAPL": Symbol(
                symbol="AAPL", name="Apple Inc.", market="NASDAQ", close_price=150.0
            ),
        }
        mock_repository.load_symbols.return_value = single_symbol

        result = symbol_service.get_all_symbols()

        assert len(result) == 1
        assert result[0].symbol == "AAPL"
        assert result[0].name == "Apple Inc."
        assert result[0].market == "NASDAQ"
        assert result[0].close_price == 150.0
