library(tidyverse)
library(httr)
library(jsonlite)
# load data ---------------------------------------------------------------
# source("~/GitHub/cvisb_data/sample-viewer-api/src/static/data/cvisb_get_data.R")
# df = get_cvisb("patient", 'cohort:"Lassa" AND _exists_:gID', "size=10", TRUE)

# x = httr::GET("https://data.cvisb.org/api/patient/query", query=list(q="cohort:Lassa", size=10, fetch_all='true'))


params = list(q="cohort:Lassa")

get_cvisb = function(endpoint, params, size=1000, df = data_frame()) {
  request = httr::GET(sprintf("https://data.cvisb.org/api/%s/query", endpoint), query=c(params, fetch_all='true', size=size))
  
  if(request$status_code == 200) {
    # Read content as text
    resp_txt <- content(request, as = "text", encoding = "UTF-8")
    response = jsonlite::fromJSON(resp_txt, flatten = TRUE)
    
    if(is_null(response$success)){  
      scrollID = response[['_scroll_id']]
      
      df2 = response[['hits']] %>% 
        as_data_frame() %>% bind_rows(df)
      
      # helper text
      print(paste(scales::percent(nrow(df2)/response[['total']]), " complete"))
      
      get_cvisb(endpoint, c(params, scroll_id=scrollID), size, df2)
      
    } else {
      return(df)
    }
  }
  
}

df = get_cvisb("patient", params)

# cleanup -----------------------------------------------------------------
# Remove patients without a G-id
library(data.table)
df = df %>% filter(patientID %like% "G")

# cut age into cohorts
df = df %>% mutate(ageGroup = cut_number(age, 5))

# count by year
df %>% count(infectionYear) %>% 
  ggplot(aes(x = infectionYear, y = n)) + 
  geom_bar(stat="identity") +
  theme_minimal() + 
  scale_x_continuous(breaks=seq(2008, 2018))

# gender
# female-bent
df %>% group_by(infectionYear) %>% count(gender) %>% filter(gender != "Unknown") %>% mutate(pct = n/sum(n)) %>% filter(gender == "Female") %>% 
  ggplot(aes(x = infectionYear, y = pct, size = n)) +
  geom_point() +
  scale_y_continuous(labels=scales::percent, limits=c(0,1))

# age
# mostly children and young adults; doesn't shift much over time?
ggplot(df, aes(x = age)) + 
  geom_density() +
  # geom_histogram() +
  facet_wrap(~infectionYear)

df%>% group_by(infectionYear) %>% summarize(median = median(age, na.rm=TRUE), avg = mean(age, na.rm=TRUE)) %>% 
  filter(infectionYear > 2009) %>% 
  ggplot() +
  geom_line(aes(x = infectionYear, y = median)) +
  geom_line(aes(x = infectionYear, y = avg))

# % admitted
# survival, survival by year, by age, by gender, daysOnset, elisa status
df %>% group_by(infectionYear) %>% count(outcome) %>%
  filter(outcome != "unknown") %>% 
  mutate(pct = n/sum(n)) %>% 
  filter(outcome == "survivor") %>% 
  ggplot(aes(x = infectionYear, y = pct, size = n)) +
  geom_point() +
  scale_y_continuous(labels=scales::percent, limits=c(0,1))


df %>% group_by(ageGroup) %>% count(outcome) %>%
  filter(outcome != "unknown") %>% 
  mutate(pct = n/sum(n)) %>% 
  filter(outcome == "survivor") %>% 
  ggplot(aes(x = ageGroup, y = pct, size = n)) +
  geom_point() +
  scale_y_continuous(labels=scales::percent, limits=c(0,1))
