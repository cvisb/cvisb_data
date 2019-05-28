from pyparsing import (CaselessKeyword, Optional, Forward, Regex, operatorPrecedence, opAssoc, ParserElement)
from biothings.utils.common import is_str
import re

ParserElement.enablePackrat()

and_ = CaselessKeyword("AND")
or_ = CaselessKeyword("OR")
not_ = CaselessKeyword("NOT")
keyword = and_ | or_ | not_

expression = Forward()

valid_word = Regex(r'\[\[.*?\]\]').setName("word")
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

def parseElisaString(elisa):
    def buildSubQuery(l):
        if isinstance(l, list) and len(l) == 1 and isinstance(l[0], list):
            return buildSubQuery(l[0])

        if is_str(l) or (isinstance(l, list) and len(l) == 1 and is_str(l[0])):
            if is_str(l):
                _l = l
            else:
                _l = l[0]
            match = re.fullmatch(r'\[\[\s*(?P<clause>.*)\s*\]\]', _l)
            clause = _l
            if match:
                clause = match.groupdict()['clause']
            return {
                "nested": {
                    "path": "elisa",
                    "query": {
                        "query_string": {
                            "query": clause
                         }
                    }
               }
            }
        
        # unary operator
        if isinstance(l[0], str) and l[0].lower() == 'not':
            # check unary operations
            return {
                "bool": {
                    "must_not": [buildSubQuery(l[1])]
                }
            }
        if len(l) >= 3:
            # assume operations are never mixed in one stage...
            if l[1].lower() == 'and':
                return {
                    "bool": {
                        "must": [buildSubQuery(x) for x in l[::2]]
                    }
                }
            elif l[1].lower() == 'or':
                return {
                    "bool": {
                        "should": [buildSubQuery(x) for x in l[::2]]
                    }
                }
        return None

    parsed_expression = expression.parseString(elisa, parseAll=True)
    
    try:
        query = buildSubQuery(parsed_expression.asList())
    except Exception:
        query = None
    
    query = buildSubQuery(parsed_expression.asList())
    
    if query:
        return {"query": query}
    else:
        return {"query": {"nested": {"path": "elisa", "query": {"query_string": {"query": elisa}}}}}
