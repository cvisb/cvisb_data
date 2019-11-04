# Map from Natural Earth, downlaoded 8 October 2019; most simplified form

library(tidyverse)
library(sf)

x =sf::read_sf("Downloads/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp")
afr = x %>% filter(CONTINENT == "Africa")
wafr = x %>% filter(SUBREGION == "Western Africa")

df = as_tibble(list(NAME = c("Nigeria", "Sierra Leone", "Liberia", "Guinea", "Mali", "Togo"), viralseq = c(486, 88, 22, 9, 3, 1), hla = c(0, 330, 0, 0, 0, 0)))

y = merge(afr, df, all=TRUE)
west = merge(wafr, df, all=TRUE)

# Projection from https://projectionwizard.org/ for West Africa
  # Equal-area projection for regional maps with an east-west extent Cylindrical equal-area 
y = st_transform(y, crs="+proj=cea +lat_ts=10.889952671264822 +lon_0=-0.4394531249999991")

ggplot(y, aes(fill = viralseq)) +
  geom_sf() +
  scale_fill_gradientn(colors=c('#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636'), na.value = "white") 

ggplot(west, aes(fill = viralseq)) +
  geom_sf() +
  # scale_fill_gradientn(colors=c('#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636'), na.value = "white") 
  scale_fill_gradientn(colors=c('#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'), na.value = "#efefef") 
  # coord_sf(crs="+proj=cea +lat_ts=10.889952671264822 +lon_0=-0.4394531249999991", ylim = c(-10, 10))

ggplot(y, aes(fill = hla)) +
  geom_sf() +
  scale_fill_gradientn(colors=c('#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636'), na.value = "#fff7fb") +
  ggtitle("Country distribution for HLA data (hint: it's all SLE)")

