
# Based on Thomson G, Single RM. Conditional Asymmetric Linkage Disequilibrium (ALD): Extending theBi-Allelic r^2 Measure. Genetics. 2014 198(1):321-331. PMID:25023400
# @authors
# @email data@cvisb.or
# load required packages
required_pkgs = c("asymLD", "dplyr", "stringr")

pkgs2install = required_pkgs[!(required_pkgs %in% installed.packages()[,"Package"])]

if(length(pkgs2install)){
  install.packages(pkgs2install)
}

for(pkg in required_pkgs) {
  library(pkg, character.only = TRUE)
}


#' Title
#'
#' @param name
#'
#' @return
#' @export
#'
#' @examples

calc_hla_stats = function (df) {
  for(name in df) {
    print(str_c("Hello ", name))
  }
  return(sapply(df, function(x) str_c("expt ", x)))
}


# load data ---------------------------------------------------------------
source("~/GitHub/cvisb_data/sample-viewer-api/src/static/data/cvisb_get_data.R")
hla = get_cvisb("experiment", "HLA sequencing", "size=1000")
