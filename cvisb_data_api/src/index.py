from biothings.web.index_base import main, options
from api.settings import APISettings

# Instantiate settings class to configure biothings web
web_settings = APISettings(config='config')

settings = {
    "cookie_secret": web_settings.COOKIE_SECRET,
    "login_url": "/login",
    "google_oauth": {"key": web_settings.GOOGLE_CLIENT_ID, "secret": web_settings.GOOGLE_CLIENT_SECRET}
}

if __name__ == '__main__':
    # set debug level on app settings
    web_settings.set_debug_level(options.debug)
    main(web_settings.generate_app_list(), debug_settings={"STATIC_PATH": web_settings.STATIC_PATH, "debug": True},
         sentry_client_key=web_settings.SENTRY_CLIENT_KEY, app_settings=settings)
