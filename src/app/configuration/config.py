import os

from yaml import load


def get_config():
    python_path = os.environ['PYTHONPATH']
    # python_path = os.environ['PYTHONPATH'].split(':')[1]
    config_file = file(python_path + '/configuration/prod.yaml', 'r')
    return load(config_file)
