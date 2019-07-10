library(tidyverse)
library(jsonlite)
# library(seqinr)

ebv_raw = seqinr::read.fasta('~/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/ebola_wg_ntseq_names_02152019_orfs_aa alignment.fasta', seqonly = FALSE, seqtype="AA", set.attributes=FALSE)
# ebv = seqinr::read.fasta('~/Downloads/171020-KGA_RAxML_bipartitions.ebov_alignment_red.fasta', seqonly = FALSE)

ebv = as.data.frame(do.call(rbind, ebv_raw))

colnames(ebv) = lapply(1:length(ebv), function(x) str_c("AA",x))


pct_diff = function(ebv) {
  pcts = data_frame()
  for(i in 1:length(ebv)){
    if(!i %% 10) {
      print(i)    
    }
    pct = ebv %>% count_(str_c("AA", i)) %>% mutate(pct = n / sum(n)) %>% pull(pct) %>% max()
    
    if(i == 1){
      pcts = tibble(!!(str_c("AA", i)) := pct)
    } else {
      pcts = add_column(pcts, !!(str_c("AA", i)) := pct)
    }
    
    
  }
  
  # pct = pct %>% data_frame
  # colnames(pct) = lapply(1:length(pct), function(x) str_c("AA",x))
  
  return(pcts)
}

pct = pct_diff(ebv)

pcts = tibble(pct = t(pct))

ggplot(pcts, aes(x = pct)) +
  geom_histogram(breaks = seq(0.8, 1, by = 0.005))


ggplot(pcts, aes(x = as.numeric(row.names(pcts)), y = pct)) +
  geom_point() +
  geom_line()
