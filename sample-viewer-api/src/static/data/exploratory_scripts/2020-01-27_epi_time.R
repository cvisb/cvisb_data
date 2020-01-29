library('tidyverse')
library(jsonlite)
library(lubridate)

df = read_csv("GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/2020-01-27_lassa_epidata.csv")

df = df %>% 
  mutate(epi_week = lubridate::epiweek(presentationDate),
         epi_week_cum = floor(lubridate::interval(as_date("2010-01-01"), presentationDate) / lubridate::years(1)) * 52 + epi_week)

ggplot(df %>% filter(daysOnset > -1, daysOnset < 40), aes(x=outcome ,y= daysOnset)) + 
  geom_violin() +
  coord_flip()

ggplot(df %>% filter(presentationDate > "2009-12-31", presentationDate < "2019-12-31"), aes(x=outcome, y= presentationDate)) + 
geom_violin() +
  coord_flip()

ggplot(df, aes(x=outcome, y=daysInHospital)) + 
geom_violin() +
  coord_flip()


ggplot(df%>% filter(daysOnset > -1, daysOnset < 40), aes(x = daysOnset, y = daysInHospital)) +
  geom_line(alpha = 0.3) +
  facet_wrap(~outcome)

x= df %>% filter(presentationDate > "2009-12-31", presentationDate < "2019-12-31") %>% group_by(epi_week_cum) %>% count()

ggplot(x, aes(x=epi_week_cum, y= n)) + geom_line()

# Seasonality
df %>% 
  mutate(presentationMonth = lubridate::month(presentationDate), presentationYear = lubridate::year(presentationDate)) %>% 
  filter(igmPositive | agPositive) %>% 
  group_by(presentationMonth, presentationYear) %>% count() %>% ggplot(aes(x = presentationMonth, y= n, group = presentationYear, colour = presentationYear)) + 
  geom_line() +
  facet_wrap(~presentationYear, scales="free_y")

df %>% 
  mutate(presentationMonth = lubridate::month(presentationDate), presentationYear = lubridate::year(presentationDate)) %>% 
  filter(presentationYear > 2009, presentationYear < 2019) %>% 
  group_by(presentationMonth, presentationYear) %>% count() %>% ggplot(aes(x = presentationMonth, y= n, group = presentationYear, colour = presentationYear)) + 
  geom_line() +
  facet_wrap(~presentationYear)

df %>% 
  mutate(presentationMonth = lubridate::month(presentationDate), presentationYear = lubridate::year(presentationDate)) %>% 
  filter(igmPositive | agPositive, presentationYear != 2014, presentationYear != 2015, presentationYear != 2016) %>% 
  group_by(presentationMonth) %>% count() %>% ggplot(aes(x = presentationMonth, y= n)) + 
  geom_line()  +
  ylim(c(0, 80))

# morbidity by month
morbidity = df %>% 
  mutate(presentationMonth = lubridate::month(presentationDate), presentationYear = lubridate::year(presentationDate)) %>% 
  filter(igmPositive | agPositive, outcome != "unknown") %>%
  group_by(presentationMonth, presentationYear, outcome) %>% 
  count() %>% 
  ungroup() %>% 
  group_by(presentationMonth, presentationYear) %>% 
  mutate(total = sum(n), pct = n/total)
  
  
  
  ggplot(morbidity %>% filter(outcome == 'dead'), aes(x = presentationMonth, y= pct, group = presentationYear, colour = presentationYear)) + 
    geom_line() +
    facet_wrap(~presentationYear)
  
    
  ggplot(morbidity %>% filter(outcome == 'dead'), aes(x = presentationMonth, y= pct)) + 
    geom_line() +
    geom_point(aes(size = n))
  
  
   # age
  # survivors slightly older?
  ggplot(df %>% filter(outcome !="unknown"), aes(x=outcome, y=age)) + 
    geom_violin() +
    coord_flip()
  
  
# gender: men die more often?
   # come into clinic later?
  df %>% filter(outcome !="unknown", gender !="Unknown") %>%  group_by(outcome, gender) %>% count() %>% ungroup() %>% group_by(outcome) %>% mutate(pct = n/sum(n))
  df %>% filter(outcome !="unknown", gender !="Unknown") %>%  group_by(gender, outcome) %>% count() %>% ungroup() %>% group_by(gender) %>% mutate(pct = n/sum(n))
  df %>% filter(outcome !="unknown", gender !="Unknown", !pregnant) %>%  group_by(gender, outcome) %>% count() %>% ungroup() %>% group_by(gender) %>% mutate(pct = n/sum(n))
  df %>% filter(outcome !="unknown", gender =="Female") %>%  group_by(pregnant, outcome) %>% count() %>% ungroup() %>% group_by(pregnant) %>% mutate(pct = n/sum(n))

  ggplot(df %>% filter(gender !="Unknown", daysOnset > -1, daysOnset < 40), aes(x=gender, y=daysOnset)) + 
    geom_violin() +
    coord_flip()


  
  group_by(presentationMonth) %>% count() 