from datetime import datetime

from context.database import db
from sqlalchemy.types import String, DateTime, Integer
from sqlalchemy.dialects.postgres import JSONB


class DaoBase(object):
    id = db.Column(String, primary_key=True)
    created = db.Column(DateTime)
    updated = db.Column(DateTime)
    data = db.Column(JSONB)
    version_id = db.Column(Integer, nullable=False)

    __mapper_args__ = {
        'version_id_col': version_id
    }

    def __init__(self, dao_id, data):
        self.id = dao_id
        self.created = datetime.utcnow()
        self.updated = datetime.utcnow()
        self.data = data

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created.isoformat(),
            'updated': self.updated.isoformat(),
            'data': self.data
        }

    def to_json_resource(self):
        return {
            'type': 'spots',
            'id': self.id,
            'attributes': self.data
        }


class Base(object):
    def __init__(self):
        pass

    def to_dict(self):
        result_dict = {}
        keys = self.__doc__.split(', ')
        for key in keys:
            result_dict[key] = getattr(self, key)
        return result_dict

    def from_dict(self, data_dict):
        for key in data_dict:
            setattr(self, key, data_dict[key])
        return self

