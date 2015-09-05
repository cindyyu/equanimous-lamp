import os, sys

from yaml import load


def get_config():
    python_path = os.environ['PYTHONPATH'].split(os.pathsep)[1]
    config_file = file(python_path + '/configuration/local.yaml', 'r')
    return load(config_file)
