class UsageError(Exception):
    status_code = 400

    def __init__(self, title, detail, status_code=None):
        Exception.__init__(self)
        self.title = title
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code

    def to_dict(self):
        return {
            'errors': [
                {
                    'title': self.title,
                    'detail': self.detail,
                    'status': str(self.status_code)
                }
            ]
        }
