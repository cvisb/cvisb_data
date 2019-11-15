import logging

def setupLogging(fn):
    logging.basicConfig(filename=fn, filemode='w', format='%(message)s', level=logging.INFO)

def log_msg(msg, verbose, type="info"):
    logging.info(msg)
    if(verbose):
        print(msg)
