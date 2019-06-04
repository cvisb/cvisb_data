from biothings.web.settings.default import *
from config_cvisb_endpoints import CVISB_ENDPOINTS
from api.query_builder import ESQueryBuilder
from api.query import ESQuery
from api.transform import ESResultTransformer
from api.handlers import EntityHandler, QueryHandler, SchemaHandler
from web.handlers import UserInfoHandler, LogoutHandler
import os

SCHEMA_DIR = os.path.join(os.path.split(os.path.abspath(__file__))[0], 'static', 'schemas', 'jsonschema', 'test_schema', 'modified')

# *****************************************************************************
# Elasticsearch variables
# *****************************************************************************
# elasticsearch server transport url
ES_HOST = 'localhost:9200'

# *****************************************************************************
# App URL Patterns
# *****************************************************************************
APP_LIST = [
    (r"/api/(.+)/query/?", QueryHandler),
    (r"/api/(.+)/(.+)/?", EntityHandler),
    (r"/api/(.+)/?$", EntityHandler),
    (r"/jsonschema/(.+).json$", SchemaHandler),
    (r"/jsonschema$", SchemaHandler),
    (r"/user", UserInfoHandler),
]

# patterns that don't require access to settings
UNINITIALIZED_APP_LIST = [
    (r"/logout", LogoutHandler),
]

ALLOW_NESTED_AGGS = True

ACCESS_CONTROL_ALLOW_METHODS = 'GET,POST,PUT,DELETE,OPTIONS'

QUERY_GET_ESQB_KWARGS['patientID'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['patientQuery'] = {'default': None, 'type': str}
QUERY_GET_ESQB_KWARGS['sampleQuery'] = {'default': None, 'type': str}
QUERY_GET_ESQB_KWARGS['experimentQuery'] = {'default': None, 'type': str}
#QUERY_GET_ESQB_KWARGS['relatedTo'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['outcome'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['cohort'] = {'default': None, 'type': list}
#QUERY_GET_ESQB_KWARGS['availableData'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['country'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['elisa'] = {'default': None, 'type': str}
QUERY_GET_ESQB_KWARGS['infectionYear'] = {'default': None, 'type': str}
QUERY_GET_ESQB_KWARGS['measurementTechnique'] = {'default': None, 'type': list}
QUERY_GET_ESQB_KWARGS['length'] = {'default': None, 'type': str}
QUERY_GET_ESQB_KWARGS['facet_size']['max'] = 10000
#QUERY_GET_ES_KWARGS['_source']['default'] = {"includes": ["*"], "excludes": []}
#QUERY_POST_ES_KWARGS['_source']['default'] = {"includes": ["*"], "excludes": []}
#ANNOTATION_GET_ES_KWARGS['_source']['default'] = {"includes": ["*"], "excludes": []}
#ANNOTATION_POST_ES_KWARGS['_source']['default'] = {"includes": ["*"], "excludes": []}

###############################################################################
#    app-specific query builder, query, and result transformer classes
###############################################################################

# *****************************************************************************
# Subclass of biothings.web.api.es.query_builder.ESQueryBuilder to build
# queries for this app
# *****************************************************************************
ES_QUERY_BUILDER = ESQueryBuilder
# *****************************************************************************
# Subclass of biothings.web.api.es.query.ESQuery to execute queries for this app
# *****************************************************************************
ES_QUERY = ESQuery
# *****************************************************************************
# Subclass of biothings.web.api.es.transform.ESResultTransformer to transform
# ES results for this app
# *****************************************************************************
ES_RESULT_TRANSFORMER = ESResultTransformer

GA_ACTION_QUERY_GET = 'query_get'
GA_ACTION_QUERY_POST = 'query_post'
GA_ACTION_ANNOTATION_GET = 'sample_get'
GA_ACTION_ANNOTATION_POST = 'sample_post'
GA_TRACKER_URL = 'cvisb.org'
