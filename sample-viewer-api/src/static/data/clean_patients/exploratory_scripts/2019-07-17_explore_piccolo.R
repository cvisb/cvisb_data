library(tidyverse)
library(readxl)
library(ggbeeswarm)
library(forcats)

df = read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/piccolo/LF data 07172019.xlsx", 
                sheet=2)

df %>% glimpse()

df = df %>% 
  mutate(
    alkPhos = AlkPh,
    alt = ifelse(ALT == ">2000", 2000, as.numeric(ALT)),
    ast = ifelse(AST == ">2000", 2000, as.numeric(AST)), 
    bilirubin = `Tbili (mg/dl)`,
    creatinine = as.numeric(`Creatinine (mg/dl)`),
    
    outcome = ifelse(is.na(Survival), "unknown", Survival),
    
    
    # Expected ranges: https://www.abaxis.com/sites/default/files/resource-packages/Comprehensive%20Metabolic%20Panel%20Package%20Insert-EN_0.pdf
    # If gender is unknown, treat it like a female (lower minimum and higher maximium)
    lowAlkPhos = ifelse((is.na(Gender) | Gender == "f"), alkPhos < 42, alkPhos < 53),
    highAlkPhos = ifelse((is.na(Gender) | Gender == "f"), alkPhos > 141, alkPhos > 128),
    
    lowALT = alt < 10,  
    highALT = alt > 47,

    highAST = ast > 38,
    lowAST = ast < 11,
    
    # mg/dL
    lowBili = bilirubin < 0.2,
    highBili = bilirubin > 1.6,
    
    #mg/dL
    lowCreatinine = creatinine < 0.1,
    highCreatinine = creatinine > 1.2,
    
    kidneyScore = highALT + highAST + highBili + highCreatinine + highAlkPhos,
    lowScore = lowALT + lowAST + lowAlkPhos + lowBili + lowCreatinine
    
  )


df$outcome = forcats::fct_relevel(df$outcome, c("unknown", "survive", "died"))

stats = df %>% select(ast, alt, creatinine, bilirubin, alkPhos, 
                      lowAlkPhos, highAlkPhos, lowALT, highALT, 
                      lowAST, highAST, lowBili, highBili, 
                      lowCreatinine, highCreatinine
                      ) %>% 
  summarise_all(funs(avg = mean(., na.rm = TRUE), median = median(., na.rm=TRUE), 
                     min = min(., na.rm = TRUE), max = max(., na.rm = TRUE),
                     count = sum(!is.na(.)), nacount = sum(is.na(.))))


df %>% group_by(Survival) %>% count(outcome)


# violin plots ------------------------------------------------------------


ggplot(df, aes(x = outcome, y = ast)) +
  geom_violin() +
  geom_quasirandom(aes(colour = highAST), alpha=0.4) +
  # geom_jitter(aes(colour = highAST), width = 0.25, alpha=0.4) +
  coord_flip() + 
  scale_y_log10() +
  ylab("log(AST)") +
  # theme_bw() + 
  theme(text = element_text(size=16)) +
  ggtitle("High AST levels are correlated with poor outcome") 


ggplot(df, aes(x = outcome, y = alt)) +
  geom_violin() +
  # geom_jitter(aes(colour = highALT), width = 0.25, alpha=0.4) +
  geom_quasirandom(aes(colour = highALT), alpha=0.4) +
  scale_y_log10() +
  ylab("log(ALT)") +
  coord_flip() + 
  theme(text = element_text(size=14)) +
  ggtitle("High ALT levels are correlated with poor outcome") 


ggplot(df, aes(x = outcome, y = bilirubin)) +
  geom_violin() +
  geom_quasirandom(aes(colour = highBili), alpha=0.4) +
  scale_y_log10() +
  # theme_bw() +
  ylab("log(total bilirubin") +
  theme(text = element_text(size=16)) +
  coord_flip() +
  ggtitle("Total bilirubin") 


ggplot(df, aes(x = outcome, y = alkPhos)) +
  geom_violin() +
  geom_quasirandom(aes(colour = highAlkPhos), alpha=0.4) +
  scale_y_log10() +
  theme(text = element_text(size=16)) +
  coord_flip() +
  ylab("log(alkaline phosphatase)") + 
  ggtitle("High alkaline phosphatase seems correlated with poor outcome")
  theme_bw()

ggplot(df, aes(x = outcome, y = creatinine)) +
  geom_violin() +
  geom_quasirandom(aes(colour = highCreatinine), alpha=0.4) +
  ggtitle("High creatinine seems correlated with poor outcome") +
  theme(text = element_text(size=16)) +
  scale_y_log10() +
  coord_flip() +
  ylab("log(creatinine)")
  # scale_y_log10() +
  theme_bw()

ggplot(df, aes(x = outcome, y = kidneyScore)) +
  geom_violin() +
  geom_quasirandom(aes(), alpha=0.4) +
  theme(text = element_text(size=16)) + 
  coord_flip() +
  ggtitle("The more abnormally high metabiolic panel levels measured are correlated with poor prognosis", subtitle = "AST, ALT, creatinine, alkaline phosphatase, and total bilirubin measurements")

ggplot(df, aes(x = outcome, y = lowScore)) +
  geom_violin() +
  geom_quasirandom(aes(), alpha=0.4) +
  ggtitle('Low metabolic panel levels seem not particularly important')



# quick stat tests --------------------------------------------------------


kruskal.test(df$outcome, df$ast)
kruskal.test(df$outcome, df$alkPhos)
wilcox.test(df$ast,df$outcome)


# quick correlation -------------------------------------------------------

correl = cor(df %>% select(ast, alt, alkPhos, bilirubin, creatinine), use="pairwise.complete.obs")

correl = as.data.frame(correl) %>% mutate(key2 = names(as.data.frame(correl))) %>% gather(key1, value, -key2)

library(RColorBrewer)

ggplot(correl, aes(x = key1, y = key2, fill = value)) +
  geom_tile() +
  coord_equal() +
  theme_minimal() +
  scale_fill_gradientn(colours = brewer.pal(11, "PiYG"), limits = c(-.77,.77)) +
  theme(text = element_text(size=16)) +
  ylab("") +
  xlab("") +
  ggtitle("Correlation between Piccolo data") 

