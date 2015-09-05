from pinject import new_object_graph
from service.config import ConfigService

obj_graph = new_object_graph(modules=None, classes=[ConfigService])
config_service = obj_graph.provide(ConfigService)
