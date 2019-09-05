# Thomson G, Single RM. Conditional Asymmetric Linkage Disequilibrium (ALD): Extending theBi-Allelic r^2 Measure. Genetics. 2014 198(1):321-331. PMID:25023400

# setwd('~/lassa-ebola-hla/')
library(readr)
library(asymLD)
library(reshape2)
library(plyr)
library(ggplot2)


# data cleaning funcs
remove_colon <- function(string) {
  str <- gsub(':','',string)
  return(str)
}

remove_after_dash <- function(string) {df
  str <- gsub("\\-.*","",string)
  return(str)
}

remove_after_period <- function(string) {
  str <- gsub("\\..*","",string)
  return(str)
}
##################################################################


Genotype_calls <- read_csv("https://raw.githubusercontent.com/andersen-lab/lassa-ebola-hla/master/Genotype_calls.csv")
colnames(Genotype_calls) <- remove_after_period(colnames(Genotype_calls))

# restrict to Sierra Leone
Genotype_calls <- Genotype_calls[Genotype_calls$Location=='Sierra Leone',]

# set dashes outside DRB1 to DRB5 to NA (because data fckd)
is.na(Genotype_calls[,1:19]) <- Genotype_calls[,1:19]=='-'
df   <- na.omit(Genotype_calls)      # remove NAs for correlation matrix
df   <- df[,6:27]                    # remove 'metadata'
df[] <- lapply(df,remove_colon)      # remove colons
df[] <- lapply(df,remove_after_dash) # remove dash and following
df$ID <- 1:dim(df)[1]

# need to combine columns with same names
df2  <- melt(df,id.vars = 'ID',variable.name = 'locus')

library(data.table) 
df3 <- setDT(df2)[, {temp <- combn(locus, 2); .(locus1 = temp[1,], locus2 = temp[2,])}, ID]
colnames(df3)[2] <- 'locus'
df3 <- merge(df2,df3)
colnames(df3)[c(2:4)] <- c('locus1','allele1','locus')
df3 <- merge(df3,df2,by=c('ID','locus'))
df3 <- df3[,2:5]
colnames(df3)[c(1,4)] <- c('locus2','allele2')
df3[,1:2] <- df3[,2:1]
colnames(df3)[1:2]    <- c('locus1','locus2')
df3 <- df3[order(df3$locus1,df3$locus2),]
 
#collapse by specific combinations
df4 <- ddply(df3, .(locus1,locus2,allele1,allele2), c("nrow"))
df4$nrow <- df4$nrow/dim(df)[1] # divide by number of subjects to get freqs
df4 <- df4[c('nrow','locus1','locus2','allele1','allele2')]
colnames(df4)[1] <- 'haplo.freq'
df4[2:5] <- lapply(df4[2:5],as.character)

dfs <- split(df4,f=list(df4$locus1,df4$locus2),drop = TRUE)

results <- ldply(dfs, .fun = compute.ALD)
results <- results[,-c(1,4:7)]
results$r2 <- rowMeans(results[,3:4])
# double length of results
results$r2 <- results$r2^2
results <- results[c(1:2,5)]
results <- results[order(results$locus1,results$locus2),]

diags   <- data.frame(union(unique(results$locus1),
                                unique(results$locus2)),
                      union(unique(results$locus1),
                                unique(results$locus2)),
                      1)
colnames(diags) <- colnames(results)
results <- rbind(diags,results)

results <- results[order(results$locus1,results$locus2),]
results$r2 <- round(results$r2,digits=2)
#
### plot
#
ggplot(results, aes(locus1, locus2, fill = r2))+
  geom_tile(color = "white")+
  scale_fill_gradient2(low = "white", high = "red", 
                       limit = c(0,1), space = "Lab", 
                       name="r2") +
  geom_text(aes(locus1, locus2, label = r2), color = "black") +
  theme_classic()+ # minimal theme
  theme(axis.text.x = element_text(angle = 45, vjust = 1, 
                                    hjust = 1))+
  coord_fixed()+
  xlab('Locus')+ylab('Locus')
# ggsave('asymLD_all.pdf',ggheatmap,'pdf',width = 7)


