from __future__ import annotations

from adapters.base import DataAdapter
from adapters.nocodb_adapter import NocoDBDataAdapter
from config import Settings


def create_data_adapter(settings: Settings) -> DataAdapter:
    return NocoDBDataAdapter.from_settings(settings)
