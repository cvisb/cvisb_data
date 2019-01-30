from config_web import *
from web.handlers import GoogleOAuth2LoginHandler

COOKIE_SECRET = "sM&!7*ol@{!olaa@|E$,Qwc@?(_MU4"

# for cyrus owned app
#GOOGLE_CLIENT_ID = "2187098090-jsqrao2i7i5180kubpg7lc8bfvl9md3s.apps.googleusercontent.com"
#GOOGLE_CLIENT_SECRET = "gaouXpRK7pUwjvuK8o-H8SB7"

# for cvisbgroup owned dev app
GOOGLE_CLIENT_ID = "531071038443-i0loif711h407sr3gc847p5d7l1p3j5u.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "EosHvmZfJyjek4hUIvmfmU99"

GOOGLE_CALLBACK_PATH = r"/oauth"

# gmail addresses of users allowed to write to database
MASTER_WRITE_LIST = ['laura.d.hughes@gmail.com', 'cyrus.afrasiabi@gmail.com', 
                     'kga1978@gmail.com', 'mpauthner@gmail.com', 'xraydiffraction@gmail.com',
                     'reillywu@gmail.com']
# gmail addresses of users allowed to read from database
MASTER_READ_LIST = ['laura.d.hughes@gmail.com', 'cyrus.afrasiabi@gmail.com', 
                    'andrew.su@gmail.com', 'kga1978@gmail.com', 'mpauthner@gmail.com', 
                    'xraydiffraction@gmail.com', 'reillywu@gmail.com']

# for now, just make a list for every endpoint populated from a master list....should
# possibly change if number of users grows considerably
for endpoint, config_dict in CVISB_ENDPOINTS.items():
    config_dict['permitted_writer_list'] = MASTER_WRITE_LIST
    config_dict['permitted_reader_list'] = MASTER_READ_LIST

APP_LIST += [(GOOGLE_CALLBACK_PATH, GoogleOAuth2LoginHandler)]
