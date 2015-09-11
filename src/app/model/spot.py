from model.base import Base


class SpotData(Base):
    """longitude, latitude, price, score, max_stay, availability, origin"""
    def __init__(self,
                 longitude,
                 latitude,
                 price=0,
                 score=0,
                 max_stay=None,
                 availability=[],
                 origin='user'):
        Base.__init__(self)
        self.longitude = longitude
        self.latitude = latitude
        self.price = price
        self.score = score
        self.max_stay = max_stay
        self.availability = availability
        self.origin = origin
