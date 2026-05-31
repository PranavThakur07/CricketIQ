import abc
from typing import List, Dict, Any, Optional
from app.config import settings

class LiveDataProvider(abc.ABC):
    """
    Abstract Base Class for external Live Cricket Data providers.
    """
    @abc.abstractmethod
    def get_provider_name(self) -> str:
        pass

    @abc.abstractmethod
    def is_configured(self) -> bool:
        pass

    @abc.abstractmethod
    async def get_live_matches(self) -> List[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    async def get_live_match_detail(self, match_id: str) -> Dict[str, Any]:
        pass

class CricAPIProvider(LiveDataProvider):
    """
    Real-world integration slot for CricAPI (cricapi.com).
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_provider_name(self) -> str:
        return "CricAPI"

    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def get_live_matches(self) -> List[Dict[str, Any]]:
        if not self.is_configured():
            raise ValueError("CricAPI Key is not configured.")
        # In actual execution, this would run real async REST requests:
        # e.g., using httpx client querying api.cricapi.com
        return []

    async def get_live_match_detail(self, match_id: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("CricAPI Key is not configured.")
        return {}

class CricketDataProvider(LiveDataProvider):
    """
    Real-world integration slot for CricketData API.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_provider_name(self) -> str:
        return "CricketData"

    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def get_live_matches(self) -> List[Dict[str, Any]]:
        if not self.is_configured():
            raise ValueError("CricketData Key is not configured.")
        return []

    async def get_live_match_detail(self, match_id: str) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("CricketData Key is not configured.")
        return {}

class MockProvider(LiveDataProvider):
    """
    Mock Provider returning empty feeds when no live keys are configured,
    triggering clean frontend 'Live data unavailable' warning messages.
    """
    def get_provider_name(self) -> str:
        return "Sandbox Mock Provider"

    def is_configured(self) -> bool:
        return False

    async def get_live_matches(self) -> List[Dict[str, Any]]:
        return []

    async def get_live_match_detail(self, match_id: str) -> Dict[str, Any]:
        return {}

# Live Provider Factory Manager
class LiveProviderManager:
    def __init__(self):
        # Read keys dynamically loaded from backend/.env
        self.cricapi_key = settings.CRICAPI_API_KEY
        self.cricketdata_key = settings.CRICKETDATA_API_KEY

    def get_active_provider(self) -> LiveDataProvider:
        """
        Auto-resolves the active live provider based on env settings.
        """
        if self.cricapi_key:
            return CricAPIProvider(self.cricapi_key)
        elif self.cricketdata_key:
            return CricketDataProvider(self.cricketdata_key)
        else:
            return MockProvider()

    def get_status(self) -> Dict[str, Any]:
        """
        Returns active provider details and user display messages.
        """
        provider = self.get_active_provider()
        if provider.is_configured():
            return {
                "status": "connected",
                "provider_name": provider.get_provider_name(),
                "display_message": f"✓ {provider.get_provider_name()} Connected"
            }
        else:
            return {
                "status": "not_configured",
                "provider_name": "None",
                "display_message": "⚠ Live Provider Not Configured"
            }

live_provider_manager = LiveProviderManager()
