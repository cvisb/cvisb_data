import logging
import pandas as pd

def setupLogging(fn):
    logging.basicConfig(filename=fn, filemode='w', format='%(message)s', level=logging.INFO)

def log_msg(msg, verbose, type="info"):
    logging.info(msg)
    if(verbose):
        print(msg)

def addError(df, condition, newError, verbose, logCols, errorCol="issue"):
    df.loc[condition, errorCol] = df.loc[condition, errorCol].apply(lambda x: updateError(x, newError))
    err_ct = len(df[condition])
    if(err_ct > 0):
        log_msg(f"{'-'*50}", verbose)
        log_msg(f"\t{newError}", verbose)
        log_msg(df.loc[condition, logCols], verbose)
        log_msg(f"{'-'*50}", verbose)
    return(df)

def updateError(origError, newError):
    if((newError == "") | pd.isnull(newError)):
        return(origError)
    if((origError == origError) & pd.notnull(origError)):
        return(origError + "; " + newError)
    return(newError)
