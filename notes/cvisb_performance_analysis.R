library(tidyverse)
library(readxl)

filename = "GitHub/cvisb_data/notes/performance/CViSB-data-portal_performance.xlsx"

serverType = "prod"

audit = read_excel(filename) %>% filter(server == serverType)

# Compilation stats
stats = read_excel(filename, sheet=3)
stats %>% filter(date == "2019-12-03") %>% arrange(desc(size))


ggplot(stats %>% filter(server == serverType), aes(x = date, y = size, colour = module)) +
  geom_point() +
  geom_line() +
  geom_blank(aes(y = 0)) +
  # facet_wrap(~forcats::fct_reorder(module, size, .desc=TRUE)) +
  facet_wrap(~forcats::fct_reorder(module, size, .desc=TRUE), scales="free") +
  theme(legend.position = "none")
# 

# Bump plot
ggplot(audit %>% filter(overview == TRUE), aes(x = date, y = numericValue, colour = index)) +
  geom_point() +
  geom_line() +
  scale_y_continuous(limits=c(0, 1), labels=scales::percent) +
  facet_wrap(~page)

ggplot(audit %>% filter(overview == TRUE, index=="Performance"), 
       aes(x = date, y = forcats::fct_reorder(page, numericValue), fill = numericValue)) +
  geom_tile() +
  # coord_fixed() +
  scale_fill_viridis_c(limits = c(0,1), labels=scales::percent) +
  theme_minimal()
