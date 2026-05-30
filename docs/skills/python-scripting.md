---
name: python-scripting
description: Use this skill for general-purpose Python scripting tasks. Covers file I/O, data processing, automation, CLI tools, HTTP requests, concurrency, logging, testing, environment management, and packaging. Trigger when the user asks to write, fix, or improve a Python script, automate a workflow, process data with Python, build a CLI tool, or work with Python modules and packages. Do NOT use for web frameworks (Django/Flask), data science/ML pipelines, or tasks that have a more specific skill (pdf, xlsx, docx, etc.).
---

# Python General Scripting Guide

## Overview

This guide covers idiomatic, production-quality Python scripting patterns. Follow these conventions to write scripts that are readable, robust, and easy to maintain.

## Environment & Setup

### Always pin dependencies
```bash
# Create an isolated environment
python3 -m venv .venv
source .venv/bin/activate        # macOS/Linux
.venv\Scripts\activate           # Windows

# Pin dependencies
pip install <package>
pip freeze > requirements.txt

# Install from pin file
pip install -r requirements.txt --break-system-packages  # when inside container
```

### Standard project layout
```
my_script/
├── main.py            # Entry point
├── utils.py           # Shared helpers
├── requirements.txt   # Pinned deps
├── .env               # Secrets (never commit)
├── tests/
│   └── test_main.py
└── README.md
```

---

## File I/O

### Read / write text files
```python
from pathlib import Path

# Always use pathlib over os.path
data_dir = Path("data")
data_dir.mkdir(parents=True, exist_ok=True)

# Read
text = Path("input.txt").read_text(encoding="utf-8")

# Write (atomic-safe via temp file)
output = Path("output.txt")
output.write_text("Hello, world!\n", encoding="utf-8")
```

### Process a file line by line (memory-efficient)
```python
from pathlib import Path

with Path("big_file.txt").open(encoding="utf-8") as fh:
    for line in fh:
        process(line.rstrip("\n"))
```

### CSV reading and writing
```python
import csv
from pathlib import Path

# Read
with Path("data.csv").open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Write
fieldnames = ["name", "age", "city"]
with Path("out.csv").open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
```

### JSON
```python
import json
from pathlib import Path

# Read
data = json.loads(Path("config.json").read_text())

# Write (pretty-printed)
Path("output.json").write_text(
    json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
)
```

---

## Data Processing

### Work with collections efficiently
```python
from collections import defaultdict, Counter
from itertools import islice, chain

# Count occurrences
word_counts = Counter(words)
top10 = word_counts.most_common(10)

# Group items
groups: dict[str, list] = defaultdict(list)
for item in items:
    groups[item["category"]].append(item)

# Flatten nested lists
flat = list(chain.from_iterable(nested))

# Consume only first N items from a large iterable
first_100 = list(islice(big_iterator, 100))
```

### Dataclasses for structured data
```python
from dataclasses import dataclass, field, asdict

@dataclass
class Record:
    name: str
    value: float
    tags: list[str] = field(default_factory=list)

r = Record(name="foo", value=3.14, tags=["a", "b"])
print(asdict(r))  # {'name': 'foo', 'value': 3.14, 'tags': ['a', 'b']}
```

### Type hints (always include them)
```python
from typing import Iterator

def read_chunks(path: str, size: int = 1024) -> Iterator[str]:
    with open(path, encoding="utf-8") as fh:
        while chunk := fh.read(size):
            yield chunk
```

---

## CLI Tools

### argparse (stdlib — prefer for simple scripts)
```python
import argparse
import sys

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Process files.")
    p.add_argument("input", type=str, help="Path to input file")
    p.add_argument("-o", "--output", default="out.txt", help="Output path")
    p.add_argument("-v", "--verbose", action="store_true")
    p.add_argument("-n", "--count", type=int, default=10)
    return p

def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    # ... logic ...
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### click (third-party — prefer for complex CLIs)
```python
# pip install click
import click

@click.command()
@click.argument("input", type=click.Path(exists=True))
@click.option("--output", "-o", default="out.txt", show_default=True)
@click.option("--verbose", "-v", is_flag=True)
def cli(input: str, output: str, verbose: bool) -> None:
    """Process INPUT and write results to OUTPUT."""
    if verbose:
        click.echo(f"Processing {input}")

if __name__ == "__main__":
    cli()
```

---

## HTTP Requests

### httpx (preferred — sync and async, modern)
```python
# pip install httpx
import httpx

# Sync GET with timeout and retries
with httpx.Client(timeout=10.0) as client:
    resp = client.get("https://api.example.com/items", params={"page": 1})
    resp.raise_for_status()
    data = resp.json()

# POST with JSON body and headers
with httpx.Client() as client:
    resp = client.post(
        "https://api.example.com/create",
        json={"name": "foo"},
        headers={"Authorization": "Bearer TOKEN"},
    )
    resp.raise_for_status()
```

### Async HTTP
```python
import asyncio
import httpx

async def fetch_all(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

results = asyncio.run(fetch_all(["https://api.example.com/1", "https://api.example.com/2"]))
```

---

## Environment Variables & Secrets

### Use python-dotenv for local secrets
```python
# pip install python-dotenv
import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file

API_KEY = os.environ["API_KEY"]          # raise if missing (preferred)
DEBUG   = os.getenv("DEBUG", "false")    # default value fallback
```

### .env file format
```
API_KEY=sk-abc123
DATABASE_URL=postgresql://user:pass@localhost/db
DEBUG=true
```

---

## Logging

### Always use the logging module — never bare print() in production scripts
```python
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stderr),
        logging.FileHandler("app.log", encoding="utf-8"),
    ],
)

log = logging.getLogger(__name__)

log.info("Starting up")
log.warning("Something looks odd: %s", value)
log.error("Failed to process %s", path, exc_info=True)  # includes traceback
```

---

## Error Handling

### Be specific — never bare `except:`
```python
import sys
from pathlib import Path

def load_config(path: str) -> dict:
    try:
        import json
        return json.loads(Path(path).read_text())
    except FileNotFoundError:
        print(f"Config not found: {path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON in {path}: {exc}", file=sys.stderr)
        sys.exit(1)
```

### Custom exceptions
```python
class AppError(Exception):
    """Base error for this application."""

class ConfigError(AppError):
    """Raised when configuration is invalid."""

class NetworkError(AppError):
    """Raised when a remote request fails."""
```

---

## Concurrency

### CPU-bound work → ProcessPoolExecutor
```python
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

def process_file(path: Path) -> int:
    return sum(1 for _ in path.open())

files = list(Path("data").glob("*.txt"))

with ProcessPoolExecutor() as pool:
    results = list(pool.map(process_file, files))
```

### I/O-bound work → ThreadPoolExecutor or asyncio
```python
from concurrent.futures import ThreadPoolExecutor

def download(url: str) -> bytes:
    import httpx
    return httpx.get(url).content

with ThreadPoolExecutor(max_workers=8) as pool:
    all_bytes = list(pool.map(download, urls))
```

---

## Testing

### pytest (always prefer over unittest)
```python
# pip install pytest pytest-cov
# tests/test_utils.py

import pytest
from my_script.utils import add, divide

def test_add():
    assert add(1, 2) == 3

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)

@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
```

```bash
# Run tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=my_script --cov-report=term-missing
```

### Mocking
```python
from unittest.mock import patch, MagicMock

def test_fetch(monkeypatch):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"id": 1}
    monkeypatch.setattr("httpx.get", lambda *a, **kw: mock_resp)
    result = fetch_item(1)
    assert result["id"] == 1
```

---

## Subprocess & Shell Commands

```python
import subprocess
import sys

# Run a command, raise on failure, capture output
result = subprocess.run(
    ["git", "log", "--oneline", "-5"],
    capture_output=True,
    text=True,
    check=True,          # raises CalledProcessError on non-zero exit
)
print(result.stdout)

# Stream output live (no capture)
subprocess.run(["make", "build"], check=True)

# Shell pipeline (avoid when possible — use Python instead)
proc = subprocess.run(
    "find . -name '*.py' | wc -l",
    shell=True, capture_output=True, text=True, check=True
)
```

---

## Working with Dates & Times

```python
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo  # Python 3.9+

# Always store as UTC internally
now_utc = datetime.now(tz=timezone.utc)

# Convert to a local timezone for display only
eastern = now_utc.astimezone(ZoneInfo("America/New_York"))
print(eastern.strftime("%Y-%m-%d %H:%M %Z"))

# Parse ISO 8601
ts = datetime.fromisoformat("2025-06-01T12:00:00+00:00")

# Arithmetic
deadline = now_utc + timedelta(days=7, hours=3)
```

---

## Packaging & Distribution

### pyproject.toml (modern standard — use instead of setup.py)
```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-tool"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["httpx>=0.27", "click>=8.1"]

[project.scripts]
my-tool = "my_tool.main:cli"
```

```bash
pip install -e .     # editable install
my-tool --help       # script entry point works immediately
```

---

## Quick Reference

| Task | Best Choice | Notes |
|------|-------------|-------|
| File paths | `pathlib.Path` | Never `os.path` |
| CLI (simple) | `argparse` | Stdlib, no deps |
| CLI (complex) | `click` | Third-party, composable |
| HTTP requests | `httpx` | Sync + async |
| Secrets | `python-dotenv` + `os.environ` | Never hardcode |
| Logging | `logging` module | Never bare `print()` |
| Testing | `pytest` | Parametrize liberally |
| CPU parallelism | `ProcessPoolExecutor` | Bypasses GIL |
| I/O parallelism | `ThreadPoolExecutor` / `asyncio` | Choose based on style |
| Type hints | Always | Helps editors + readers |
| Data containers | `@dataclass` | Prefer over plain dicts |
| Dates/times | `datetime` + `zoneinfo` | Always store UTC |
| Shell commands | `subprocess.run(..., check=True)` | Avoid `shell=True` |
| Packaging | `pyproject.toml` | Modern standard |

## Common Pitfalls to Avoid

- **Mutable default arguments**: use `def f(x=None): x = x or []` not `def f(x=[]):`
- **Bare `except:`**: always catch specific exception types
- **`os.path` instead of `pathlib`**: `pathlib` is cleaner and cross-platform
- **Hardcoded secrets**: always load from environment variables
- **`print()` for logging**: use the `logging` module for any script that runs unattended
- **`shell=True` in subprocess**: pass a list of args instead; use `shell=True` only when piping is truly necessary
- **Naive datetimes**: always attach a timezone; store UTC, display local
