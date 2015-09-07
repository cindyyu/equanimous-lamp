from configuration.config import get_config


class ConfigService(object):
    def __init__(self):
        self.config = get_config()
        self.flask_config = self.config['flask']
        self.flask_api_config = self.flask_config['api']
        self.model_config = self.config['model']

    def config_flask(self, app):
        for config_key in self.flask_config:
            app.config[config_key] = self.flask_config[config_key]
