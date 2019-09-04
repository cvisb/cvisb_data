# Imports all villages (plus associated chiefdoms, districts)
# Goal: create a gazetteer lookup dictionary for all locations within the KGH dataset.
# 1) Standardizes names to common case, spelling -- based on fuzzy data matching to various sources
# 2) Geocodes the points based off of a bunch of different sources.


# Sources -----------------------------------------------------------------
# Boundary data: UN-OCHA admin1-4 boundaries
# • SLE census (for population, Admin2/3 official names)
# • OSM places (based off of OpenStreetMap)
# • UN/OCHA pull of populated places, based on NGA data
# • GeoNames gazetteer, based primarily on NGA data
# • Who's on First gazeteer, primarily based on NGA data but incorporating other places too.
# • Google Geocoding API


# load libraries ----------------------------------------------------------
library(sf)
library(tidyverse)
library(fuzzyjoin)
library(readxl)
library(data.table)
library(ggmap)
library(RSQLite)

SLE_crs = "+proj=longlat +datum=WGS84 +no_defs"

# Administrative area polygons --------------------------------------------
# SLE from https://data.humdata.org/dataset/sierra-leone-all-ad-min-level-boundaries
# UN-OCHA data

# provinces
sl1 = sf::read_sf("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_admbnda_adm1_1m_gov_ocha/")

# districts
sl2 = sf::read_sf("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_admbnda_adm2_1m_gov_ocha/")

# chiefdoms
sl3 = sf::read_sf("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_admbnda_adm3_1m_gov_ocha.shp/")

# counties
sl4 = sf::read_sf("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_admbnda_adm4_1m_gov_ocha/")


# AltName is useless
# sl4 %>% filter(!is.na(admin4AltN))
# sl4 %>% filter(!is.na(admin3))

# UN-OCHA settlements -----------------------------------------------------
# populated places
# https://data.humdata.org/dataset/sierra-leone-settlements
cities = sf::read_sf("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_pplp_nga_20170523/")

cities = cities %>% mutate(village = str_to_title(featureRef))




# df = st_drop_geometry(sl4)
# 
# df = df %>% select(admin1Name, admin1Pcod, admin2Name, admin2Pcod, admin3Name, admin3Pc_1, admin4Name, admin4Pc_1)
# write_csv(df, "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_adm4_UNOCHA.csv")


# population from 2015 census ---------------------------------------------
# Downloaded from https://www.statistics.sl/images/StatisticsSL/Documents/final-results_-2015_population_and_housing_census.pdf
# on 2019-07-24
census_raw = read_csv("~/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/tabula-SLE_-2015_population_and_housing_census_population.csv", skip = 1)


clean_value = function (value) {
  return(as.integer(str_replace_all(value, " ", "")))
}

census = census_raw %>% 
  # replace dashes with NA
  na_if("-") %>% 
  mutate(location = ifelse(X1 %in% c("TMS", "BKM"), X1, str_to_title(X1)), 
         total = clean_value(Total),
         male = clean_value(Male), 
         female = clean_value(Female), 
         rural = clean_value(Total_1), 
         rural_male = clean_value(Male_1), 
         rural_female = clean_value(Female_1),
         urban = clean_value(Total_2), 
         urban_male = clean_value(Male_2), 
         urban_female = clean_value(Female_2),
         adminUnit = ifelse(X1 == "Total country", "admin0",
                            ifelse(X1 %in% c("TMS", "BKM"), "admin3", 
                                   ifelse(
                                     (str_count(X1,"[A-Z]") + str_count(X1, "\\s") + str_count(X1, "-")) == str_length(X1),
                                     ifelse(X1 %in% c("EASTERN", "NORTHERN", "SOUTHERN", "WESTERN"), "admin1", "admin2"), 
                                     "admin3"))),
         admin1Name = ifelse(adminUnit == "admin1", location, NA_character_),
         admin2Name = ifelse(adminUnit == "admin2", location, NA_character_)
  )

# fill down values
census = census %>% fill(admin1Name, admin2Name) %>% 
  mutate(admin2Name = ifelse(adminUnit == "admin1", NA_character_, admin2Name))

adm2_pop = census %>% 
  filter(adminUnit == "admin2") %>% 
  mutate(location = ifelse(location == "Bo-South", "Bo", location)) %>% 
  select(admin1Name, admin2Name, total, male, female, rural, rural_male, rural_female, urban, urban_female, urban_male)

adm3_pop = census %>% 
  filter(adminUnit == "admin3") %>% 
  # mutate(location = ifelse(location == "Bo-South", "Bo", location)) %>% 
  select(admin1Name, admin2Name, admin3Name = location, total, male, female, rural, rural_male, rural_female, urban, urban_female, urban_male)

# left_join(sl2, adm2_pop, by="admin2Name") %>% 
#   ggplot(aes(fill = log10(total))) +
#   geom_sf() +
#   scale_fill_viridis_c()  
# 
# x %>% 
#   ggplot(aes(fill = log10(total))) +
#   geom_sf() +
#   scale_fill_viridis_c()


# join w/ patients --------------------------------------------------------

lsv = read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_metadata_v2_2019-06-12_PRIVATE.csv")
ebv = read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/ebolaSurvivors_metadata_v2_2019-03-13_PRIVATE.xlsx")

lsv = lsv %>%
  mutate(
    district = ifelse(is.na(District), NA_character_, str_to_title(District)),
    chiefdom = ifelse(is.na(Chiefdom), NA_character_, str_to_title(Chiefdom)),
    village = ifelse(is.na(Village), NA_character_, str_to_title(Village)))


ebv = ebv %>%
  mutate(
    district = ifelse(is.na(district), NA_character_, str_to_title(district)),
    village = ifelse(is.na(village), NA_character_, str_to_title(village))
  )

# lsv = read_csv("GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_viral_seq/exploratory_scripts/2019-08-08_raphaelle_geo_matches.csv")
# lsv = lsv %>%
#   filter(!is.na(Village)) %>%
#   mutate(chiefdom = ifelse(Chiefdom %in% c("L/B", "L/Bambara", "Lower bombara", "Lowerbambara"), "Lower Bambara", 
#                            ifelse(Chiefdom %in% c("Wandoh"), "Wandor", Chiefdom)))
  


# Trying to geocode Lassa viral seq ---------------------------------------




lsv %>% glimpse()
# villages to clean up ----------------------------------------------------
comb = bind_rows(lsv %>% select(district, chiefdom, village), 
                 ebv %>% select(district, village))

villages = comb %>% count(district, chiefdom, village)


# stage 1: clean up districts ---------------------------------------------
districts = villages %>% group_by(district) %>% summarise(n = sum(n))
city_districts = cities %>% count(admin2Name)
district_match = stringdist_left_join(districts %>% filter(!is.na(district)), city_districts, by=c("district" = "admin2Name"), distance_col="admin2_dist", method="osa")

district_kgh = districts %>% right_join(adm2_pop, by=c("district" = "admin2Name")) %>% mutate(pct_kgh = n/sum(n, na.rm=TRUE), pct_sle = total/sum(total))

# After reviewing the matches by hand, looks like the fuzzy matches make sense
# The only ones that don't match well are the Western Areas-- but unclear if they're urban or rural, so better wait.
villages = district_match %>% filter((admin2_dist < 2 )) %>% 
  select(district, admin2Name) %>% right_join(villages, by = "district")



# stage 2: merge villages and admin2 together -----------------------------
chiefs = villages %>% group_by(admin2Name, chiefdom) %>% summarise(n = sum(n))
city_chiefs = cities %>% count(admin2Name, admin3Name)

chiefdom_match = stringdist_left_join(chiefs %>% filter(!is.na(chiefdom)), city_chiefs, by=c("chiefdom" = "admin3Name"), distance_col="admin3_dist", method="osa") %>% 
  mutate(admin2Agree = admin2Name.x == admin2Name.y)


villages =  chiefdom_match %>% ungroup() %>% 
  filter((admin3_dist < 3 ) & admin2Agree) %>% 
  mutate(admin2Name = admin2Name.y) %>% 
  select(admin2Name, chiefdom, admin3Name) %>% right_join(villages, by = c("chiefdom", "admin2Name"))


merged = left_join(villages, cities,  by=c("admin2Name", "admin3Name", "village"))


merged %>% count(is.na(admin3Pcod))

ggplot(merged, aes(fill=n)) +
  geom_sf(aes(geometry=geometry), colour="white", size = 0.2) +
  scale_fill_viridis_c(limits=c(0,8)) +
  # theme(legend.position = "none") +
  facet_wrap(~year1)

# dl method --> # mismatches in the match
# adm4_match = 
stringdist_left_join(villages %>% filter(!is.na(admin4Name)), df, by="admin4Name", distance_col="admin4_dist", method="jaccard") %>% select(admin4Name.x, admin4Name.y, admin4_dist) %>% glimpse()
adm3_match = stringdist_left_join(villages %>% filter(!is.na(admin3Name)), df, by="admin3Name", distance_col="admin3_dist", method="dl") 

# Lookup API key at https://console.cloud.google.com/google/maps-apis/apis/geocoding-backend.googleapis.com/credentials?project=cvisb-226923&duration=PT1H
ggmap::register_google(key=mykey)
x = ggmap::geocode("kenema, sierra leone", output="all")


getCoords = function(village, chiefdom, district) {
  location_string = str_c(village, district, "Sierra Leone", sep = ", ")
  print(location_string)
  
  geocoded = ggmap::geocode(location_string, output="all")
  
  if(!is.null(geocoded$status)){
    lat = geocoded$results[[1]]$geometry$location$lat
    lon = geocoded$results[[1]]$geometry$location$lng
    partial = geocoded$results[[1]]$partial_match
    if(is.null(partial)) {
      partial = FALSE
    }
    num_locations = length(geocoded$results[[1]]$address_components)
    result_type = geocoded$results[[1]]$geometry$location_type
    matched_name = geocoded$results[[1]]$address_components[[1]]$long_name
    matched_type = geocoded$results[[1]]$address_components[[1]]$types[[1]]
    
    # preset to be NULL
    
    other = NA_character_
    othertype = NA_character_
    country = NA_character_
    admin1 = NA_character_
    admin1type = NA_character_
    admin2 = NA_character_
    admin2type = NA_character_
    
    for(i in 1:num_locations) {
      if(geocoded$results[[1]]$address_components[[i]]$types[[1]]   == "country") {
        country = geocoded$results[[1]]$address_components[[i]]$long_name
      } else if(geocoded$results[[1]]$address_components[[i]]$types[[1]]   == "administrative_area_level_1") {
        admin1 = geocoded$results[[1]]$address_components[[i]]$long_name
        admin1type = geocoded$results[[1]]$address_components[[i]]$types[1]
      } else if(geocoded$results[[1]]$address_components[[i]]$types[[1]]   == "administrative_area_level_2") {
        admin2 = geocoded$results[[1]]$address_components[[i]]$long_name
        admin2type = geocoded$results[[1]]$address_components[[i]]$types[1]
      } else {
        other = geocoded$results[[1]]$address_components[[i]]$long_name
        othertype = geocoded$results[[1]]$address_components[[i]]$types[1]
      }
    }
    
    
    results = tibble(village=village, chiefdom=chiefdom, admin2Name = district, lat=lat, lon=lon, partial = partial, result_type = result_type, matched_name=matched_name, matched_type = matched_type,
                     country=country, admin1=admin1, admin1type=admin1type, admin2=admin2, admin2type = admin2type, other = other, othertype = othertype)
    
    results = results %>% mutate(place_match = village == matched_name, 
                                 admin2_match = admin2Name == admin2)
  } else {
    results = tibble(village=village, chiefdom=chiefdom, admin2Name = district, lat=NA_character_, lon=NA_character_, 
                     partial = NA_character_, result_type = NA_character_, matched_name=NA_character_, matched_type = NA_character_,
                     country = NA_character_, admin1=NA_character_, admin1type=NA_character_, admin2=NA_character_, admin2type = NA_character_, other = NA_character_, othertype = NA_character_,
                     place_match = NA_character_, 
                     admin2_match = NA_character_)
  }
  return(results)
}
lsv %>% glimpse()
google_geocode = villages %>% filter(!is.na(village) & !is.na(admin2Name)) %>% rowwise() %>% do(getCoords(.$village, .$chiefdom, .$admin2Name))
lsv_geocode = lsv %>% filter(!is.na(Village) & !is.na(district)) %>% rowwise() %>% do(getCoords(.$Village, .$chiefdom, .$district))

google_geocode %>% count(place_match)
gc = st_as_sf(google_geocode %>% filter(!is.na(lat)), coords = c("lat", "lon"))

leaflet(google_geocode) %>% addTiles() %>% addCircles(~lon, ~lat)



# Cluster together names --------------------------------------------------
# Create kNN for strings
village_names = villages %>% filter(!is.na(village)) %>% pull(village)
dist = adist(village_names)
rownames(dist ) = village_names

hc = hclust(as.dist(dist), method = "ward.D2")

# OSM places --------------------------------------------------------------
# points
osm_raw = read_sf("~/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_places_OSM_HOT/")
# polygons
osm_areas = read_sf("~/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_places-area_OSM_HOT/")

# Combine, filter out any unnamed places
osm = osm_raw %>% filter(!is.na(name))

# %>% bind_rows(osm_areas %>% filter(!is.na(name)))

# Add in admin units.
osm = sf::st_as_sf(osm)
osm = sf::st_join(osm, sl4 %>% select(admin4Name, admin3Name, admin2Name, admin1Name))

# quick map
# ggplot(osm, aes(colour=admin2Name)) +
#   geom_sf(size = 0.5, alpha = 0.3) +
#   theme_void()

# quick test left-join
osm_join = left_join(villages, osm, by = c("village" = "name"))

osm_join %>% count(is.na(fclass))

test_join = st_join(osm, sl4, left = TRUE)

leaflet(osm) %>% addTiles() %>% addCircles(~geometry)


# GeoNames ----------------------------------------------------------------
geonames = read_tsv("~/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/SL_GeoNames_2019-08-07.txt", col_names = FALSE)
colnames(geonames) = c("geonameid","name","asciiname","alternatenames","latitude","longitude","feature_class","feature_code","country_code","cc2","admin1_code","admin2_code","admin3_code","admin4_code","population","elevation","dem","timezone","modification_date")


geonames = geonames %>% mutate(numcommas = str_count(alternatenames, ",")) %>% 
  separate(alternatenames, into = c("alt1", "alt2", "alt3", "alt4", "alt5", "alt6", "alt7", "alt8", "alt9", "alt10", "alt11", "alt12", "alt13", "alt14", "alt15", "alt16", "alt17", "alt18", "alt19", 
                                    "alt20", "alt21", "alt22", "alt23", "alt24", "alt25", "alt26", "alt27", "alt28", "alt29", "alt30", "alt31", "alt32", "alt33", "alt34", "alt35", "alt36", "alt37", "alt38" ,
                                    "alt39", "alt40", "alt41", "alt42", "alt43", "alt44", "alt45", "alt46", "alt47", "alt48", "alt49", "alt50", "alt51", "alt52", "alt53", "alt54", "alt55", "alt56", "alt57", 
                                    "alt58", "alt59", "alt60", "alt61", "alt62", "alt63", "alt64", "alt65", "alt66", "alt67", "alt68", "alt69", "alt70", "alt71", "alt72", "alt73", "alt74", "alt75", "alt76", 
                                    "alt77", "alt78", "alt79", "alt80", "alt81", "alt82", "alt83", "alt84", "alt85", "alt86", "alt87", "alt88", "alt89", "alt90", "alt91", "alt92", "alt93", "alt94", "alt95", 
                                    "alt96", "alt97", "alt98", "alt99", "alt100", "alt101", "alt102", "alt103", "alt104", "alt105", "alt106", "alt107", "alt108"), sep=",", remove=FALSE)
gn = geonames %>% 
  select(geonameid, name, contains("alt"), -alternatenames, lat = latitude, lon = longitude, feature_class, feature_code) %>% 
  gather(key = "altnum", value = "altname", -geonameid, -name, -lat, -lon, -feature_class, -feature_code) %>% 
  select(-altnum) %>% 
  filter(!is.na(altname))

geonames_join = left_join(villages, gn, by = c("village" = "altname"))

geonames_join %>% count(is.na(geonameid))

# Add in admin units.
gn = sf::st_as_sf(gn, coords = c("lon", "lat"))
sf::st_crs(gn) = SLE_crs
gn = sf::st_join(gn, sl4 %>% select(admin4Name, admin3Name, admin2Name, admin1Name))


# who's on first ----------------------------------------------------------


whoDB = RSQLite::dbConnect(dbDriver("SQLite"), "~/Downloads/whosonfirst-data-latest.db 2")
# dbListTables(whoDB)
# who1 = dbReadTable(whoDB, "ancestors")  # contains 16.6 M records of id, ancestor_id, ancestor_placetype and lastmodifed.  assuming not useful.
# who2 = dbReadTable(whoDB, "concordances") # 4.8 M "other" places-- from wikipedia, etc (?)
# who3 = dbReadTable(whoDB, "geojson") # UGH.  nested as a json.  not the most R-friendly
# who4 = dbReadTable(whoDB, "names") # contains names and placetype for all the pkaces.  but no coords... can cross-ref w/ geojson
# who5 = dbReadTable(whoDB, "spr")

who_sl_raw = RSQLite::dbGetQuery(whoDB, "SELECT * FROM names LEFT JOIN geojson ON names.id=geojson.id WHERE names.country ='SL'")
# who_sl = RSQLite::dbGetQuery(whoDB, "SELECT * FROM names WHERE names.country ='SL'")


geonames_join = left_join(villages, who_sl, by = c("village" = "name"))

geonames_join %>% count(is.na(id))

get_who = function(raw_who) {
  results = data_frame()
  
  for(i in 1: nrow(raw_who)) {
    if((i %% 100) == 0) {
      print(i)
    }
    json = jsonlite::fromJSON(raw_who$body[i])
    
    name = json$properties$`wof:name`
    if(is.null(name)) {
      name = NA_character_
    }
    
    src = json$properties$`src:geom`
    if(is.null(src)) {
      src = NA_character_
    }
    
    lat =json$properties$`geom:latitude`
    if(is.null(lat)) {
      lat = NA_real_
    }
    
    lon = json$properties$`geom:longitude`
    if(is.null(lon)) {
      lon = NA_real_
    }
    
    ptype = json$geometry$type
    if(is.null(ptype)) {
      ptype = NA_character_
    }
    
    ptype2 = json$properties$`wof:placetype`
    if(is.null(ptype2)) {
      ptype2 = NA_character_
    }
    
    result = tibble(name = name, src = src, lat = lat, lon = lon, placetype = ptype, placetype2 = ptype2)
    results = results %>% bind_rows(result)
    
  }
  return(results)
}

who_sl = get_who(who_sl_raw)
# Add in admin units.
who_sl = sf::st_as_sf(who_sl, coords = c("lon", "lat"))
sf::st_crs(who_sl) = SLE_crs
who_sl = sf::st_join(who_sl, sl4 %>% select(admin4Name, admin3Name, admin2Name, admin1Name))



# MASS JOINS --------------------------------------------------------------
# merged = left_join(lsv, who_sl %>% select(name, src, contains("admin"), geometry), by = c("district" = "admin2Name", "chiefdom" = "admin3Name", "Village" = "name")) %>% 
#   rename(admin1_who = admin1Name, admin2_who = district, admin3_who = chiefdom, admin4_who = admin4Name, src_who = src)

merged = left_join(lsv, gn %>% select(name, contains("admin"), geometry), by = c("district" = "admin2Name", "chiefdom" = "admin3Name", "Village" = "name")) %>% 
  rename(admin1_geonames = admin1Name, admin4_geonames = admin4Name, geometry_geonames = geometry) %>% 
  left_join(cities, by = c("district" = "admin2Name", "chiefdom" = "admin3Name", "Village" = "village")) %>% 
  rename(admin1_unocha = admin1Name, admin4_unocha = admin4Name, geometry_unocha = geometry) %>% 
  left_join(osm, by = c("district" = "admin2Name", "chiefdom" = "admin3Name", "Village" = "name")) %>% 
  rename(admin1_osm = admin1Name, admin4_osm = admin4Name, geometry_osm = geometry) %>% 
  mutate(missing_flag = ifelse(is.na(admin1_osm) & is.na(admin1_geonames) & is.na(admin1_unocha), TRUE, FALSE))
  
merged %>% count(missing_flag)

merged2 = merged %>% filter(!is.na(longitude)) %>% st_as_sf(coords = c("longitude", "latitude"))


ggplot() +
  geom_sf(data = sl2) + 
  geom_sf(data = merged %>% filter(missing_flag == FALSE), aes(colour=Village, geometry = geometry_geonames), size = 5, alpha = 0.3, shape=16) +
  geom_sf(data = merged2 %>% filter(missing_flag == FALSE), aes(colour=Village, geometry = geometry), size = 5, alpha = 0.3, shape = 15) +
  theme_void() 
  # theme(legend.position = "none")

