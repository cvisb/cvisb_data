from pyparsing import (CaselessKeyword, Optional, Forward, Regex, operatorPrecedence, opAssoc, ParserElement)
from config_cvisb_endpoints import CVISB_ENDPOINTS

QUERY_CLAUSE_STOP_CHARACTER = r'\<\>'

_endpoints = CVISB_ENDPOINTS.keys()

ParserElement.enablePackrat()

and_ = CaselessKeyword("AND")
or_ = CaselessKeyword("OR")
not_ = CaselessKeyword("NOT")
keyword = and_ | or_ | not_

expression = Forward()

# set valid word regex
valid_word_regex = r'|'.join([r'({e}\..*?\:.*?{s})'.format(e=_endpoint,s=QUERY_CLAUSE_STOP_CHARACTER) for _endpoint in _endpoints])

valid_word = Regex(valid_word_regex).setName("word")
valid_word.setParseAction(
    lambda t : t[0].replace('\\\\',chr(127)).replace('\\','').replace(chr(127),'\\')
    )

term = Forward()

word_expr =  valid_word
term <<  word_expr

expression << operatorPrecedence(term,
    [
    ((not_ | '!').setParseAction(lambda:"NOT"), 1, opAssoc.RIGHT),
    ((and_ | '&&').setParseAction(lambda:"AND"), 2, opAssoc.LEFT),
    (Optional(or_ | '||').setParseAction(lambda:"OR"), 2, opAssoc.LEFT),
    ])

class CViSBQueryStringParser(object):
    pass
