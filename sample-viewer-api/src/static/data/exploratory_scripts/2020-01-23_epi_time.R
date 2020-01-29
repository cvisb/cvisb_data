library(tidyverse)
library(lubridate)

# Python script to compile all patient data is kind of a mess for various reasons... so moving forward with a quick cleanup script just to get epi data done.
df = read_csv("GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_patientdata_v2_2019-06-12_PRIVATE.csv")

df = df %>% 
  mutate(est_presentation = ifelse(!is.na(evaldate_lba1), evaldate_lba1, DOAdm),
         presentation_date = lubridate::as_date(est_presentation),
         epi_week = lubridate::epiweek(presentation_date),
         epi_week_cum = floor(lubridate::interval(presentation_date, as_date("2010-01-01")) / lubridate::years(1)) * 52 + epi_week
         )
