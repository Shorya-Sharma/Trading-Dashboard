#!/usr/bin/env python3
"""
Simple launcher script for the FastAPI backend server.
Double-click this file or run it to start the server.
"""

import os
import subprocess
import sys


def main():
    print("🚀 Starting Trading Dashboard Backend...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API docs will be at: http://localhost:8000/docs")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)

    try:
        # Change to the project directory
        project_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(project_dir)

        # Start the server
        subprocess.run(
            [
                sys.executable,
                "-m",
                "uvicorn",
                "app.main:app",
                "--reload",
                "--host",
                "0.0.0.0",
                "--port",
                "8000",
            ]
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        input("Press Enter to exit...")


if __name__ == "__main__":
    main()
