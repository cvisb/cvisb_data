library(tidyverse)

df = read_tsv("Desktop/Merged_AcuteSurvivor_EbolaLassa_BasicDemographics.tsv")
ebv = read_tsv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/EbolaEra_AcuteMetadata_Merged_20190509.tsv")
ebv = ebv %>% mutate(age = as.numeric(Age), age_windsor = ifelse(age > 95, age/10, age))

all_data = read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-05-14_PRIVATE_ALL.csv") %>% 
  rowwise() %>% 
  mutate(ID =str_replace(str_replace(gID[1], "\\['", ""), "'\\]", ""))

ggplot(df, aes(x = Age)) + geom_histogram() + facet_wrap(~Database) + theme_bw()


inner_join(all_data, ebv, by="ID")


merged = inner_join(all_data, ebv, by=c("ID"))

ggplot(merged, aes(x=age.x, age.y)) + geom_point()+ coord_equal() + ylim(c(0, 100))
ggplot(merged, aes(x=age.x, age_windsor)) + geom_point()+ coord_equal() + ylim(c(0, 100))

all_data %>% ggplot(aes(x= age)) + geom_histogram() + xlim(c(0, 125)) + theme_minimal() + ggtitle("Acute Lassa / Ebola Survivors")

ebv %>% ggplot(aes(x= age)) + geom_histogram() + xlim(c(0, 125)) + theme_minimal() + ggtitle("Acute Ebola")
