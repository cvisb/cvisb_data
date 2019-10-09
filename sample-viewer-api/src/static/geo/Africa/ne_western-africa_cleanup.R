# Map from Natural Earth, downlaoded 8 October 2019; smplified in map shaper.



library(tidyverse)
library(sf)

df = read_sf("GitHub/cvisb_data/sample-viewer-api/src/static/geo/Africa/ne_10m_admin_0_countries.json")

# west africa + surrounding area for basemap
countries = c("Sierra Leone", "Guinea", "Liberia", "Ivory Coast", "Mali", 
              "Senegal", "Nigeria", "Benin", "Niger", "Burkina Faso", "Togo", 
              "Ghana", "Guinea-Bissau", "Mauritania", "Gambia",
              "Western Sahara", "Morocco", "Libya", "Niger", "Algeria", "Chad",
              "Central African Republic", "Cameroon")

wafr = df %>% 
  filter(ADMIN %in% countries) %>% 
  select(geometry, country = NAME, identifier = ISO_A3, subregion = SUBREGION)

write_sf(wafr, "GitHub/cvisb_data/sample-viewer/src/assets/geo/naturalearth_west-africa.json", delete_dsn=TRUE, driver = "GeoJSON")

ggplot(wafr, aes(fill=country)) +
  geom_sf() 

# africa polygon
afr = df %>% filter(CONTINENT == "Africa", NAME != "Madagascar") %>% select(geometry)
afr = st_union(afr)
ggplot(afr) +
  geom_sf() 

write_sf(afr, "GitHub/cvisb_data/sample-viewer/src/assets/geo/naturalearth_africa.json", delete_dsn=TRUE, driver = "GeoJSON")
