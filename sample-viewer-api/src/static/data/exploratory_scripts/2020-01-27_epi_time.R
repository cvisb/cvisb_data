library('tidyverse')
library(jsonlite)
library(lubridate)

df = read_csv("GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/2020-01-27_lassa_epidata.csv")

df = df %>% 
  mutate(epi_week = lubridate::epiweek(presentationDate),
         epi_week_cum = floor(lubridate::interval(as_date("2010-01-01"), presentationDate) / lubridate::years(1)) * 52 + epi_week,
         presentationMonth = lubridate::month(presentationDate), 
         presentationYear = lubridate::year(presentationDate))

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


# sero status -------------------------------------------------------------
df %>% count(agPositive, igmPositive, iggPositive) %>% arrange(desc(n)) %>% jsonlite::toJSON()


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

# Standard prevalence over time plot
ggplot(df %>% filter(epi_week_cum > 0, epi_week_cum < 700), aes(x = floor(epi_week_cum/4) ))+ geom_bar()

group_by(presentationMonth) %>% count() 


# number missing over time ------------------------------------------------
df = df %>% rowwise %>% mutate(
  gIndex = as.numeric(str_extract(gID, "\\d\\d\\d\\d")),
  missingCount = sum(is.na(age), outcome == "unknown", gender == "Unknown", is.na(agPositive), is.na(igmPositive), is.na(admin2), is.na(presentationDate), is.na(daysOnset))
) %>% ungroup() %>% 
  mutate(gConseqIndex = row_number(gIndex))


avgMissing = zoo::rollmean(df %>% select(gConseqIndex, missingCount), 50) %>% as_data_frame()



ggplot(df, aes(x = gConseqIndex, y = missingCount)) +
  geom_point(size = 3, alpha = 0.4) +
  geom_line(data = avgMissing, color = "red")
geom_smooth()

# calculating average by month instead
# For weird epi weeks, imputing a date by choosing the epiweek for the PREVIOUS g-number
# If that doesn't exist, using NEXT g-number
df = df %>% 
  ungroup() %>% 
  arrange(gIndex) %>%
  mutate(
    prevPresentationDate = lag(presentationDate),
    nextPresentationDate = lead(presentationDate),
    imputedPresentationDate = if_else((is.na(epi_week_cum) | epi_week_cum < 0 | epi_week_cum < 500), 
                                      if_else(is.na(prevPresentationDate), nextPresentationDate, prevPresentationDate), presentationDate),
    imputedMonth = lubridate::month(imputedPresentationDate), 
    imputedYear = lubridate::year(imputedPresentationDate),
    imputedEpiWeek = lubridate::epiweek(imputedPresentationDate),
    imputedCumEpiWeek = floor(lubridate::interval(as_date("2010-01-01"), imputedPresentationDate) / lubridate::years(1)) * 52 + imputedEpiWeek,
    imputedQuarter = lubridate::quarter(imputedPresentationDate, with_year = TRUE),
    imputedMonthYear = lubridate::floor_date(imputedPresentationDate, "month")
  )

ggplot(df, aes(x = gIndex, y=imputedCumEpiWeek)) + geom_line()
df %>% select(gIndex, dischargeDate, imputedPresentationDate, imputedEpiWeek) %>% View()

df %>% group_by(imputedMonthYear) %>% count(is.na(agPositive)) %>% ungroup() %>% group_by(imputedMonthYear) %>% mutate(pct = n/sum(n)) %>% filter(`is.na(agPositive)`) %>% 
filter(imputedMonthYear > "2010-01-01", imputedMonthYear < "2020-01-01") %>% 
    ggplot(aes(x = imputedMonthYear, y = pct)) + 
  geom_line() +
  ggtitle("Missing Ag ELISA by month") +
  ylim(c(0,1))


