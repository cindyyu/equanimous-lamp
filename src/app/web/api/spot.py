import json
from flask import Blueprint, request
from util.jsonapi import jsonapi
from context.context import config_service, \
    spot_validation_service, \
    spot_crud_service


api_bp = Blueprint('api_bp', __name__, url_prefix='/api/' + str(config_service.flask_api_config['version']))


@api_bp.route('/spots', methods=['POST'])
@jsonapi
def create_spot():
    request_data = json.loads(request.data)
    attributes = spot_validation_service.validate_create(request_data)
    spot = spot_crud_service.create_spot(**attributes)
    return spot.to_json_resource(), 201


@api_bp.route('/spots', methods=['GET'])
@jsonapi
def get_spots():
    spots = spot_crud_service.get_spot_by_location(float(request.args.get('longitude')),
                                                   float(request.args.get('latitude')),
                                                   float(request.args.get('radius')),
                                                   request.args.get('day'),
                                                   request.args.get('time')) \
        if len(request.args) > 0 else spot_crud_service.get_spot()
    return [spot.to_json_resource() for spot in spots], 200


@api_bp.route('/spots/<spot_id>', methods=['GET'])
@jsonapi
def get_spot(spot_id=None):
    spot = spot_crud_service.get_spot(spot_id)
    return spot.to_json_resource() if spot is not None else None, 200


@api_bp.route('/spots/<spot_id>', methods=['PATCH'])
@jsonapi
def update_spot(spot_id=None):
    request_data = json.loads(request.data)
    attributes = spot_validation_service.validate_update(request_data)
    spot = spot_crud_service.update_spot(spot_id, attributes)
    return spot.to_json_resource(), 200


@api_bp.route('/spots/<spot_id>', methods=['DELETE'])
@jsonapi
def delete_spot(spot_id=None):
    spot_crud_service.delete_spot(spot_id)
    return None, 204
