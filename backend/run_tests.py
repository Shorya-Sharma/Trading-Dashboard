#!/usr/bin/env python3
"""
Test runner script for the trading dashboard backend.
"""

import subprocess
import sys
import os
from pathlib import Path


def run_tests():
    """Run the test suite with coverage reporting."""
    # Change to the backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)

    # Install test dependencies if not already installed
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements-test.txt"],
            check=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError:
        print("Warning: Could not install test dependencies. Tests may fail.")

    # Run tests with coverage
    cmd = [
        sys.executable,
        "-m",
        "pytest",
        "tests/",
        "-v",
        "--cov=app",
        "--cov-report=term-missing",
        "--cov-report=html:htmlcov",
        "--tb=short",
    ]

    result = subprocess.run(cmd)

    if result.returncode == 0:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)


if __name__ == "__main__":
    run_tests()
