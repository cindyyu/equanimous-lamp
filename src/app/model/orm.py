from context.database import db

from model.base import DaoBase


class Spot(db.Model, DaoBase):
    __tablename__ = 'spot'

    def __init__(self, id, data):
        DaoBase.__init__(self, id, data)
