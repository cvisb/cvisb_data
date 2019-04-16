from datetime import datetime, timedelta
import pandas as pd

def convertExcelDateNum(row):
    """
    Converts from an Excel formatted date like 12-Jun-19
    to a pythonic date object.
    Try/catch catches any NaNs or strings in a different (presumably non-date) format

    Also catches any numbers <= 60 -- presumably these are daysOnset (days b/w onset of symptons and admission to hospitalization)
    For those cases, the difference b/w the evalDate and IllnessOnset are calculated.
    """
    if(row.IllnessOnset == row.IllnessOnset):
        try:
            ordinal = int(row.IllnessOnset)
            # All of our dates should be >>> 1900.
            # However... some seem to be daysOnset, rather than a date. Filter those suckers out.
            if ordinal > 60:
                if ordinal > 59:
                    ordinal -= 1  # Excel leap year bug, 1900 is not a leap year!
                return (datetime(1899, 12, 31) + timedelta(days=ordinal))
            else:
                # likely to be daysOnset, not IllnessOnset
                # Calculate IllnessOnset as days difference from the evalDate
                return(row.converted_evalDate - timedelta(days = ordinal))
        except:
            return(pd.np.datetime64('NaT'))

def convertExcelDate(x):
    """
    Converts from an Excel formatted date like 12-Jun-19
    to a pythonic date object.
    Try/catch catches any NaNs or strings in a different (presumably non-date) format
    """
    try:
        return(datetime.strptime(x, "%d-%b-%y"))
    except:
        return(pd.np.datetime64('NaT'))

def getYearfromDate(pythondate):
    """
    Assuming the input is a python date... return just the year.

    If not a python date, empty return.
    """
    try:
        return(pythondate.year)
    except:
        return(None)

def getInfectionYear(row):
    """
    Pulling out infectionYear: estimated year of infection.

    Order of preference:
    1. year from infectionDate
    2. year from presentationYear (first two digits of public ID)
    3. year from evalDate
    4. year from dischargeDate
    """
    est_infection = getYearfromDate(row.infectionDate)
    eval_date = getYearfromDate(row.converted_evalDate)
    discharge_date = getYearfromDate(row.converted_dischargeDate)
    if(est_infection == est_infection):
        return(est_infection)
    elif(row.presentationYear == row.presentationYear):
        return(row.presentationYear)
    elif(eval_date == eval_date):
        return(eval_date)
    elif(discharge_date == discharge_date):
        return(discharge_date)

def calcOnset(row):
    """
    calculate daysOnset-- the difference b/w presentation of symptoms and presentation in the hospital.
    Should be run after evaldate and infectionDate convert their respective variables to python dates
    """
    if((row.converted_evalDate == row.converted_evalDate) & (row.infectionDate == row.infectionDate)):
        return((row.converted_evalDate - row.infectionDate).days)
    elif((row.IllnessOnset == row.IllnessOnset)):
        # Some of the IllnessOnset seem to be b/w 0-60-- presumably these are already daysOnset (?)
        # For these observations, infectionDate is None
        try:
            ordinal = int(row.IllnessOnset)
            if(ordinal < 61):
                return(ordinal)
        except:
            return(None)

def calcHospitalStay(row):
    """
    calculate number of days in hospital (discharge - eval)
    """
    if((row.converted_evalDate == row.converted_evalDate) & (row.converted_dischargeDate == row.converted_dischargeDate)):
        return((row.converted_dischargeDate - row.converted_evalDate).days)
    return(None)

def calcOnsetDischargeGap(row):
    """
    calculate number of days between discharge and est. onset (discharge - infectionDate)
    """
    if((row.infectionDate == row.infectionDate) & (row.converted_dischargeDate == row.converted_dischargeDate)):
        return((row.converted_dischargeDate - row.infectionDate).days)
    return(None)
