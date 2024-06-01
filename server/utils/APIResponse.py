from rest_framework.response import Response


class APIResponse(Response):
    def __init__(
        self, status=200, data=None, message="Success", success=True, **kwargs
    ):
        if data is None:
            data = {}
        response_data = {
            "status": status,
            "data": data,
            "message": message,
            "success": success,
        }
        super().__init__(data=response_data, status=status, **kwargs)

    def __str__(self):
        return str(
            {
                "status": self.status_code,
                "data": self.data.get("data"),
                "message": self.data.get("message"),
                "success": self.data.get("success"),
            }
        )
