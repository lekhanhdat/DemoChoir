from __future__ import annotations

from adapters.base import DataAdapter
from adapters.mock_adapter import MockDataAdapter
from adapters.nocodb_adapter import NocoDBDataAdapter
from config import Settings


def create_data_adapter(settings: Settings) -> DataAdapter:
    adapter_name = settings.normalized_data_adapter

    if adapter_name == "mock":
        return MockDataAdapter()

    if adapter_name == "nocodb":
        return NocoDBDataAdapter.from_settings(settings)

    raise RuntimeError(f"DATA_ADAPTER không hợp lệ: {settings.data_adapter}")
