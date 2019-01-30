from jsonschema import FormatChecker
from jsonschema.validators import validator_for
from datetime import datetime
from itertools import product
#import logging

ALLOWED_DAY_FORMATS = ['%d', '%-d']
ALLOWED_MONTH_FORMATS = ['%b', '%B', '%m', '%-m']
ALLOWED_YEAR_FORMATS = ['%Y', '%y']
ALLOWED_SEPARATORS = ['-', '/']

# defines date patterns...order matters.  can add more to this if we want to allow more flexible date types, though this comes with some ambiguity.
ALLOWED_DATE_FORMATS = list(product(ALLOWED_YEAR_FORMATS, ALLOWED_MONTH_FORMATS, ALLOWED_DAY_FORMATS)) # + \
    #list(product(ALLOWED_MONTH_FORMATS, ALLOWED_DAY_FORMATS, ALLOWED_YEAR_FORMATS)) + \
    #list(product(ALLOWED_DAY_FORMATS, ALLOWED_MONTH_FORMATS, ALLOWED_YEAR_FORMATS))

ALLOWED_DATE_FORMATS = [separator.join(i) for i in ALLOWED_DATE_FORMATS for separator in ALLOWED_SEPARATORS]

#logging.debug('ALLOWED_DATE_FORMATS: {}'.format(ALLOWED_DATE_FORMATS))

# validate with an error iterator...
def iter_validate(instance, schema, cls=None, *args, **kwargs):
    ''' Iterates over all errors in schema '''
    if cls is None:
        cls = validator_for(schema)
    cls.check_schema(schema)
    yield from cls(schema, *args, **kwargs).iter_errors(instance)

# validates new formats
@FormatChecker.cls_checks("cvisb-date", ValueError)
def is_cvisb_date(inst):
    if not (isinstance(inst, str)):
        raise ValueError("Incorrect type for cvisb-date.  String type required.")
        return False
    for _format in ALLOWED_DATE_FORMATS:
        try:
            _date = datetime.strptime(inst, _format)
            return True
        except ValueError:
            pass
    raise ValueError("Incorrect format for cvisb-date.  Allowed formats: {}".format(ALLOWED_DATE_FORMATS))
    return False
