import pytest
import sys
import os
from pathlib import Path

# Add the app directory to the Python path so we can import modules
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configure logging for tests
import logging
logging.basicConfig(level=logging.WARNING)  # Reduce log noise during tests
