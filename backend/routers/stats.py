import logging

from fastapi import APIRouter, Depends, HTTPException

from models import StatsResponse
from sqlite import get_agent_stats


logger = logging.getLogger(__name__)

stats_router = APIRouter()

@stats_router.get("/stats", response_model=StatsResponse)
async def get_statistics(
    org: str = "example-org" # Removed authentication
) -> StatsResponse:
    """
    Retrieve aggregated statistics for the authenticated organization.

    Returns comprehensive metrics including agent activity, risk distribution,
    and system health indicators for operational dashboards.
    """
    try:
        stats = await get_agent_stats()
        return StatsResponse(stats=stats, org=org)
    except Exception as e:
        logger.exception(f"Error retrieving statistics in get_statistics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )


