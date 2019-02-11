from tornado.web import RequestHandler
from tornado.auth import GoogleOAuth2Mixin
from tornado.httputil import url_concat
import json
import logging

def encode_user(user_obj):
    if user_obj:
        return json.dumps(user_obj)

def decode_user(user_enc):
    if user_enc:
        return json.loads(user_enc.decode('utf-8'))

class BaseHandler(RequestHandler):
    def get_current_user(self):
        user_json = decode_user(self.get_secure_cookie("user"))
        if not user_json:
            return None
        return user_json

    def set_cors(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.set_header("Access-Control-Allow-Headers","Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Authorization")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Max-Age", "60")

    def return_json(self, data):
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.set_cors()
        self.write(data)

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/"))

class UserInfoHandler(BaseHandler):
    def initialize(self, web_settings):
        self.web_settings = web_settings

    def get(self):
        current_user = self.get_current_user() or {}
        if current_user:
            current_user['read'] = False
            current_user['write'] = False
            if current_user['email'] in self.web_settings.MASTER_READ_LIST:
                current_user['read'] = True
            if current_user['email'] in self.web_settings.MASTER_WRITE_LIST:
                current_user['write'] = True
        self.return_json(current_user)

class GoogleOAuth2LoginHandler(RequestHandler, GoogleOAuth2Mixin):
    def initialize(self, web_settings):
        self.web_settings = web_settings

    async def get(self):
        redirect_uri = url_concat("https://" + self.request.host +
                                  self.web_settings.GOOGLE_CALLBACK_PATH, {})

        if self.get_argument('code', False):
            access = await self.get_authenticated_user(
                redirect_uri=redirect_uri,
                code=self.get_argument('code'))
            user = await self.oauth2_request(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                access_token=access["access_token"])
            # Save the user and access token with
            # e.g. set_secure_cookie.
            if user:
                logging.info('logged in user from google: ' + str(user))
                self.set_secure_cookie("user", encode_user(user))
            else:
                self.clear_cookie("user")
            # change/remove this when handled by front end
            self.redirect(self.get_argument('state', '/'))
        else:
            await self.authorize_redirect(
                redirect_uri=redirect_uri,
                client_id=self.settings['google_oauth']['key'],
                scope=['profile', 'email'],
                response_type='code',
                extra_params={'state': self.get_argument('next', '/'),
                              'prompt': 'select_account'})
