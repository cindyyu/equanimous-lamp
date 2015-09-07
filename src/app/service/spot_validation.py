from pinject import copy_args_to_internal_fields

from model.spot import SpotData
from util.exception import UsageError


class SpotValidationService(object):
    @copy_args_to_internal_fields
    def __init__(self):
        pass

    @staticmethod
    def validate_request(request_data):
        if 'data' not in request_data:
            raise UsageError(title='Invalid Request', detail='Missing data field.')
        if 'attributes' not in request_data['data']:
            raise UsageError(title='Invalid Request', detail='Missing attributes field.')
        request_type = request_data['data'].get('type')
        if request_type != 'spots':
            raise UsageError(title='Invalid Request', detail='Incorrect type for endpoint.')
        return True

    def validate_create(self, request_data):
        self.validate_request(request_data)
        required_fields = ['longitude', 'latitude']
        attributes = request_data['data']['attributes']
        for field in required_fields:
            if field not in attributes:
                raise UsageError(title='Invalid POST Request', detail='Missing %s field.' % field)
        return attributes

    def validate_update(self, request_data):
        self.validate_request(request_data)
        attributes = request_data['data']['attributes']
        for attribute in attributes:
            if attribute not in SpotData.__doc__.split(', '):
                raise UsageError(title='Invalid PUT Request', detail='Invalid field %s.' % attribute)
        return attributes
