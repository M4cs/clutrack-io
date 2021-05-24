from omegaconf import OmegaConf
import os

conf = OmegaConf.load('config.yaml')
if os.getenv('ENV') == 'local':
    conf.app.host = conf.app.local_host