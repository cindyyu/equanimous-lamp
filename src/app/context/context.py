from pinject import new_object_graph
from service.config import ConfigService
from service.spot_crud import SpotCrudService
from service.spot_validation import SpotValidationService

obj_graph = new_object_graph(modules=None, classes=[ConfigService,
                                                    SpotCrudService,
                                                    SpotValidationService])
config_service = obj_graph.provide(ConfigService)
spot_crud_service = obj_graph.provide(SpotCrudService)
spot_validation_service = obj_graph.provide(SpotValidationService)
