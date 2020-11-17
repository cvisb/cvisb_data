from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import re

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
                return (datetime(1899, 12, 31) + timedelta(days = ordinal))
            else:
                # likely to be daysOnset, not IllnessOnset
                # Calculate IllnessOnset as days difference from the evalDate
                return(row.converted_evalDate - timedelta(days = ordinal))
        except:
            return(np.datetime64('NaT'))

def convertExcelDate(x):
    """
    Converts from an Excel formatted date like 12-Jun-19
    to a pythonic date object.
    Try/catch catches any NaNs or strings in a different (presumably non-date) format
    """
    try:
        return(datetime.strptime(x, "%d-%b-%y"))
    except:
        return(np.datetime64('NaT'))

def dates2String(x):
    try:
        return(x.strftime("%Y-%m-%d"))
    except:
        return(np.nan)

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
    est_infection = getYearfromDate(row.converted_onsetDate)
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

def calcOnsetDate(row):
    """
    calculate daysOnset-- the difference b/w presentation of symptoms and presentation in the hospital.
    Should be run after evaldate and infectionDate convert their respective variables to python dates
    """
    if((row.daysOnset == row.daysOnset) & (row.converted_evalDate == row.converted_evalDate)):
        return(row.converted_evalDate - timedelta(days = row.daysOnset))
    return(np.datetime64('NaT'))

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
    if((row.converted_onsetDate == row.converted_onsetDate) & (row.converted_dischargeDate == row.converted_dischargeDate)):
        return((row.converted_dischargeDate - row.converted_onsetDate).days)
    return(None)

def date2Range(date_string):
    if(date_string == date_string):
        return({"gte": date_string, "lte": date_string})

def year2Range(year):
    if(year == year):
        year_string = "{:.0f}".format(year)
        return({"gte": f"{year_string}-01-01", "lte": f"{year_string}-12-31"})

def getInfectionWeek(row, infectionVar = "DoEval"):
    if(row[infectionVar] == row[infectionVar]):
        isoweek = row[infectionVar].isocalendar()[1]
        if(row.Week == row.Week):
            if(row.Week != isoweek):
                print("Calculated week doesn't agree w/ Tulane calculated week")
        isodate = datetime.strptime(f"{row.infectionYear:.0f}-W{isoweek}" + '-1', "%Y-W%W-%w")
        enddate = isodate + timedelta(days = 6)
        return({"gte": isodate.strftime("%Y-%m-%d"), "lte": enddate.strftime("%Y-%m-%d")})
