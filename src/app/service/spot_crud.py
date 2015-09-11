from pinject import copy_args_to_internal_fields
from sqlalchemy.exc import DatabaseError
from sqlalchemy.types import Float, Integer
from datetime import datetime

from model.orm import Spot
from model.spot import SpotData
from context.database import session
from util.rand import random_id
from util.exception import UsageError
from util.date import weekdays


class SpotCrudService(object):
    @copy_args_to_internal_fields
    def __init__(self):
        pass

    @staticmethod
    def get_spot_by_location(longitude,
                             latitude,
                             radius,
                             day,
                             time):
        now = datetime.now()
        if day is None:
            day = weekdays[now.weekday()]
        if time is None:
            time = now.strftime('%H%M')
        time = int(time)

        spots = session.query(Spot).filter(
            longitude - radius <= Spot.data['longitude'].cast(Float),
            Spot.data['longitude'].cast(Float) <= longitude + radius,
            latitude - radius <= Spot.data['latitude'].cast(Float),
            Spot.data['latitude'].cast(Float) <= latitude + radius
        ).all()

        results = []
        for spot in spots:
            beg = spot.data['availability'][day]['beg']
            end = spot.data['availability'][day]['end']
            if beg is None and end is None:
                results.append(spot)
            else:
                beg = int(beg)
                end = int(end)
                if time > end or time < beg:
                    results.append(spot)
        return results

    @staticmethod
    def get_spot(spot_id=None):
        if spot_id is not None:
            return session.query(Spot).get(spot_id)
        return session.query(Spot).all()

    @staticmethod
    def create_spot(longitude,
                    latitude,
                    price=0,
                    score=0,
                    max_stay=None,
                    availability=[],
                    origin='user'):
        arguments = locals()
        data = SpotData(**arguments)
        spot_id = random_id(10)
        while session.query(Spot).get(spot_id) is not None:
            spot_id = random_id(10)
        spot = Spot(spot_id, data.to_dict())
        session.add(spot)
        session.commit()
        return spot

    def update_spot(self, spot_id, updated_data):
        spot = self.get_spot(spot_id)
        if spot is None:
            raise UsageError(title='Spot Not Found', detail='Spot with ID %s does not exist.' % spot_id)
        data = spot.data
        for field in updated_data:
            data[field] = updated_data[field]
        session.query(Spot).filter(Spot.id == spot_id).update({'data': data})
        session.commit()
        session.refresh(spot)
        return spot

    def delete_spot(self, spot_id):
        spot = self.get_spot(spot_id)
        if spot is None:
            raise UsageError(title='Spot Not Found', detail='Spot with ID %s does not exist.' % spot_id)
        # todo: investigate this a bit more
        try:
            session.query(Spot).filter(Spot.id == spot_id).delete()
            session.commit()
            return True
        except DatabaseError:
            raise UsageError(title='Failed Request', detail='Delete request failed.')
