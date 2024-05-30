from rest_framework.exceptions import APIException


class APIError(APIException):
    def __init__(self, status=400, message="Error", success=False, **kwargs):
        self.status = status
        self.message = message
        self.success = success
        self.kwargs = kwargs
        super().__init__(status=status, message=message, **kwargs)

    def __str__(self):
        return str(
            {
                "status": self.status_code,
                "message": self.detail,
                "success": self.success,
            }
        )
