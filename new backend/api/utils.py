from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # call DRF's default handler first
    response = exception_handler(exc, context)

    if response is None:
        # unexpected (unhandled) exception -> log and return generic message
        logger.exception("Unhandled exception in view %s", context.get("view"))
        return Response({"detail": "Internal server error."}, status=500)

    # you can customize known errors here if you want
    return response
