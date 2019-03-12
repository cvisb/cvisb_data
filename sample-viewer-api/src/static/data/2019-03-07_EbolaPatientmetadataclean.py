import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import re

filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/ebola data for dissemination_PRIVATE.xlsx"

# Import file
df = pd.read_excel(filename, converters={'study specific number': str})

df.head()
# Prelim checks
# (1) ID number is unique. Good.
sum(df.duplicated(subset="ID number"))

# (2) study number is unique. Sort of -- missing 2 C-id conversions.
df[df.duplicated(subset="study specific number")]

df.columns
# (3) age within reasonable distribution
df['age at diagnosis'].value_counts(dropna=False)

plt.show(sns.distplot(df.dropna(subset = ['age at diagnosis'])['age at diagnosis']))
# (4) gender all M/F
df.gender.value_counts(dropna = False)

# (5) IgG either +/-/?
df["ebola IgG"].value_counts(dropna = False)
df["lassa IgG"].value_counts(dropna = False)

# (6) contact type seems to be all over the place...
df["rel between survivor anc contacts"].value_counts()
df["level/type of exposure"].value_counts()

# (7) Households are consistent
def getHHID(id):
    if(re.search("^S\-([0-9][0-9][0-9])", id.upper())):
        return(re.search("^S\-([0-9][0-9][0-9])", id.upper()).groups()[0])
    elif(re.search("^C\-([0-9][0-9][0-9])\-[0-9]", id.upper())):
        return(re.search("^C\-([0-9][0-9][0-9])\-[0-9]", id.upper()).groups()[0])

def getHHIDPrivate(id):
    if(id == id):
        return(id[:-1])

df['hhID_private'] = df["ID number"].apply(getHHID)

df['contactGroupIdentifier'] = df["study specific number"].apply(getHHIDPrivate)

check_hhGroups = df.groupby("hhID_private")[['contactGroupIdentifier']].agg(lambda x: len(set(x)) == 1)
# 6 potentially suspect non-matching households
check_hhGroups.contactGroupIdentifier.value_counts()
weird_hhIDs = check_hhGroups[check_hhGroups.contactGroupIdentifier == False].reset_index()
weird_hhIDs
df[df.hhID_private.isin(["209"])].sort_values(by=["hhID_private"]).rename(columns={"ID number": "metadataID"})
# .to_csv("2019-03-08_metadata-household-discrepancies.csv")

# Cleanup: to send back to John ------------------------------------------------

# Add in cohort / outcome
# Everything Ebola b/c this is the Ebola survivor study
# outcome assumed to be survivor if S-number; contact if C-number
df['cohort'] = "Ebola"

def assignCohort(id):
    if(re.search("^S\-[0-9][0-9][0-9]", id)):
        return("survivor")
    elif(re.search("^C\-[0-9][0-9][0-9]\-[0-9]", id)):
        return("contact")
    elif(re.search("^s\-[0-9][0-9][0-9]", id)):
        return("survivor")
    elif(re.search("^c\-[0-9][0-9][0-9]\-[0-9]", id)):
        return("contact")
    else:
        return("unknown")

df['outcome'] = df["ID number"].apply(assignCohort)

df.outcome.value_counts()
df.groupby("outcome")["ebola IgG"].value_counts(normalize=True)


# --- Cleanup ----
# --- Rename a bunch of fields. ---
def getPatientID(row):
    if(row['study specific number'] == row['study specific number']):
        if(row.outcome == "survivor"):
            return("S-" + row['study specific number'])

        elif(row.outcome == "contact"):
            return("C-" + row['study specific number'])
        else:
            return(row['study specific number'])

df['patientID'] = df.apply(getPatientID, axis = 1)
df['age'] = df['age at diagnosis']

# convert gender to M/F
def convertGender(gender):
    if(gender == gender):
        if(gender.lower() == 'm'):
            return("Male")
        elif(gender.lower() == 'f'):
            return("Female")
    else:
        return("Unknown")
df.gender = df.gender.apply(convertGender)

# --- add in country; all patients from Sierra Leone ---
def getCountry(countryID):
    return({
    "@type": "Country",
    "name": "Sierra Leone",
    "identifier": "SL",
    "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
    })

df['country'] = df.patientID.apply(getCountry)

# --- district/village --> geo objects, check that they're appropriate ---
def cleanDistrict(district):
    if (district == district):
        # Clean up Western Area; assuming the Urban part of the district, since everyone is within Freetown.
        if (district.lower() == "western area"):
            return({
            'administrativeType': 'district',
            'administrativeUnit': 2,
            'name': "Western Area Urban"
            }
            )
        return({
        'administrativeType': 'district',
        'administrativeUnit': 2,
        'name': district.title()
        })

def cleanName(district):
    if (district == district):
        return(district.title())

df['homeLocation'] = df.district.apply(cleanDistrict)
df['Adm2'] = df.district.apply(cleanName)
df['Adm4'] = df.village.apply(cleanName)


# From UN-OCHA shapefiles: # SLE from https://data.humdata.org/dataset/sierra-leone-all-ad-min-level-boundaries
SLE_adm2 = ["Pujehun", "Port Loko", "Bonthe", "Bo", "Kambia", "Kailahun", "Koinadugu", "Bombali", "Moyamba", "Kenema", "Tonkolili", "Kono", "Western Area Rural", "Western Area Urban"]
SLE_adm3 = [  "Yakemu Kpukumu", "Koya", "Bureh Kasseh Ma", "Panga Kabonde", "Galliness Perri", "Kpaka", "Bum", "Komboya", "Valunia", "Barri", "Buya Romende", "Bramaia", "Kpanda Kemo", "Kwamebai Krim", "Nongoba Bullom", "Sittia", "Makpele", "Malen", "Mono Sakrim", "Sowa", "Panga krim", "Penguia", "Pejeh(Futa peje", "Soro Gbema", "Bendu-Cha", "Sulima", "Dema", "Imperri", "Jong", "Sanda Loko", "Sogbeni", "Yawbeko", "Dasse", "Selenga", "Bagruwa", "Bonthe Urban", "Bumpeh", "Simbaru", "Fakunya", "Gaura", "Kagboro", "Luawa", "Kandu Leppiama", "Kowa", "Kaiyamba", "Lower Banta", "Kongbora", "Kamajei", "Langrama", "Bagbo", "Kori", "Dama", "Ribbi", "Boama", "Dodo", "Timdale", "Upper Banta", "Gorama Mende", "Koya", "Lower Bambara", "Malegohun", "Niawa", "Njaluahun", "Nomo", "Nongowa", "Small Bo", "Wandor", "Tunkia", "Kenema Town", "Dea", "Jawie", "Kissi Kama", "Kissi Teng", "Kissi Tongi", "Kpeje Bongre", "Kpeje West", "Malema", "Mandu", "Gbinle Dixing", "Upper Bambara", "Jaiama Bongor", "Yawei", "Badjia", "Bagbwe(Bagbe)", "Bumpe Ngao", "Gbo", "Kakua", "Kalansogoia", "Marampa", "Lugbu", "Tikonko", "Niawa Lenga", "Maforki", "Wonde", "Bo Town", "Dibia", "Kunike Barina", "Gbonkolenken", "Kafe Simiria", "Malal Mara", "Kholifa Mabang", "Kholifa Rowala", "Kunike", "Dembelia - Sink", "Sambaya", "Tane", "Yoni", "Kaffu Bullom", "Lokomasama", "Masimera", "Sanda Magbolont", "Fiama", "TMS", "Lei", "Soa", "Gbane", "Gbane Kandor", "Gbense", "Kamara", "Mafindor", "Nimikoro", "Tankoro", "Koidu Town", "Nimiyama", "Sandor", "Toli", "Diang", "Folosaba Dembel", "Kasunko", "Wara Wara Bafod", "Mongo", "Neya", "Sengbe", "Nieni", "Mambolo", "Wara Wara Yagal", "Biriwa", "Gbanti Kamarank", "Bombali Sebora", "Gbendembu Ngowa", "Libeisaygahun", "Magbaimba Ndorhahun", "Paki Masabong", "Makari Gbanti", "Safroko Limba", "Sanda Tendaran", "Sella Limba", "Tambakha", "Makeni Town", "Magbema", "Masungbala", "Samu", "Tonko Limba", "Koya Rural", "Mountain Rural", "Waterloo Rural", "York Rural", "Central I", "East I", "East II", "Central II", "West III", "West I", "West II", "Gorama Kono", "East III", "Tasso Island"]
SLE_adm4 = ["Bagollay", "Bapawa", "Batowa", "Bekowa", "Deyombo", "Fortune", "Kpukumu", "Seiwoh", "Yabai", "Mathirie", "Rogbla", "Bakoi", "Jakema II", "Kemo-Bo", "Banyande", "Pelegbulor", "Jassende Kpeima", "Jassende Masaoma", "Kabonde", "Fikie", "Tongowa", "Vanjelu", "Dakona", "Gbengain", "Kondogbe", "Petifu Bana", "Gbondubum", "Duramania", "Senjehun", "Sewama", "Taokunor", "Kwako Lanten", "Massa Settie", "Mosenten Sahen II", "Tubla", "Bohol", "Bullom", "Garinga", "Gbangbassa", "Gbap", "Hahun", "Kessie", "Manyime", "Pelewahun", "Salma", "Solon", "Torma Subu", "Sahaya", "Sahn-Gbegu", "Sampoh", "Roponka", "Fallay", "Jougba", "Karjei", "Bondor", "Dabeni", "Laimba", "Malla", "Sonjour I", "Sonjour II", "Tetima", "Jassende Ngoleima", "Dakona", "Gendema I", "Gendema II", "Jakema I", "Kemo-wa", "Joya", "Kemokai", "Kortugbu", "Mallah", "Mewah", "Jassende Ngoleima", "Nyango - Njeigbla", "Nyango-Ngoleihun", "Parvu", "Sarbah", "Lower Kayiemba", "Samba", "Upper Kayiemba", "Kengo", "Panga", "Pessekeh", "Setti-Yakanday", "Samagbe", "Kakpanda", "Seitua", "Gbomotie", "Selimeh", "Bahoin", "Kahaimoh", "Kemoh", "Sabba II", "Korwa", "Lower Pemba", "Seijeila", "Taukunor", "Sowa", "Upper Pemba", "Kemoh", "Makpondo", "Masanda Majagbe", "Pullie", "Sitta", "Fassei", "Nimima", "Pemagbie", "Samba", "Somasa", "Koilenga", "Pejeh East", "Pejeh West", "Kemokai", "Kengo", "Kiazombo", "Mano - River", "Massaquoi I", "Massaquoi II", "Moiwebu", "Sabba I", "Upper Geoma", "Zoker I", "Zoker II", "Zombo", "Lower Geoma", "Gba-Cha", "Sokenteh", "Laylay", "Tissagbe", "Yallan-gbokie", "Koimato", "Lanje", "Tamba", "Torma", "Yargbe", "Tun-Tun Sullay", "Yawma", "Chepo", "Dema", "Yoh", "Yikie Karbay", "Turtle Islands", "Babum", "Bapus", "Bigo", "Baoma", "Moimaligie", "Basiaka", "Bayengbe", "Sokrapan", "Beyinga", "Falewuja", "Kumabeh-Kwe", "Landi-Ngere", "Timbo", "Sopan-Cleveland", "Tucker-Nyambe", "Bewoni", "Gbonge", "Bamba", "Gonoh", "Kamai", "Kwalloh", "Moh", "Ngepay", "Saama", "Yoni", "Bakumba", "Beyorgboh", "Ndopie", "Pengor", "Baryegbe", "Hahun", "Ketaway", "Semabu", "Old Town", "Mobulie", "Yorma", "Kawaya", "Bonthe Town", "Benduma", "Bambuibu Tommy", "Kigbai", "Mani", "Bongoya", "Mokassi", "Moseilolo", "Bellentin", "Palima", "Sembehun", "Wonkifore", "Bumpeh", "Greema", "Saiama", "Kassipoto", "Mamu", "Domboma", "Massah", "Moforay", "Mokebbie", "Motobon", "Moyemi", "Foya Tewei", "Samu", "Yengessa", "Jayahun", "Kenema", "Mano", "Niti Korley", "Taninahun Gomoh", "Taninahun Kapuima", "Timindi", "Fallay", "Fakoi", "Gandorhun Central", "Kovella", "Sandaru", "Kpangulgo", "Kunyafoi", "Maninga", "Njawa", "Songo", "Mobeh", "Tangbla", "To - Ndambalenga", "Mofindor", "Tullu", "Bendu A", "Gbuallay", "Sembehun", "Bendu B", "Bumpetoke", "Mano", "Konolor", "Mambo", "Mofuss", "Mokandor", "Borley", "Mokebe", "Mokobo", "Rembe", "Mamanka", "Mopaileh", "Moyah", "Moyibo", "Ngiehun", "Tassoh", "Moforay", "Thumba A", "Thumba B", "Tabe", "Yondu", "Angigboya", "Koromboya", "Mofindoh", "Kpange", "Lungili", "Mobonor", "Mendegelema", "Waliwahun", "Lombama", "Mosoe", "Kowama", "Mogbuama", "Ngiegombu", "Ngoahun", "Tawovehun", "Gibina", "Gondama", "Korjei", "Mokorewo", "Mongere", "Kpangbalia", "Mosongla", "Mowoto", "Senehun", "Taninihun", "Tongieh", "Zone - 1", "Zone - 2", "Zone - 3", "Zone - 4", "Zone - 5", "Zone - 6", "Zone - 7", "Kpandobu", "Fowai", "Mosumana", "Ngiyeiya", "Njagbahun", "Njama", "Tawoveihun", "Bengelloh", "Mokotawa", "Gbangbatoke", "Largoh", "Kukuna", "Ndendemoya", "Ngolala", "Njagbahun", "Wulbange", "Kentineh", "Makera", "Klajie", "Masanka", "Masarakulay", "Motonkoh", "Mobureh", "Motoni", "Kimaya", "Upper Ribbi", "Yoni", "Karteh", "Bembellor", "Gambia", "Gbehan", "Kamasunu", "Kambotoke", "Mendekelema", "Kebail", "Mandu", "Mye", "Nonkoba", "Sahan", "Tombeh", "Yapoma", "Bei-Kelleh", "Kenafallay", "Kepay", "Mogongbe", "Songbo", "Dakowa", "Danyadejo", "Dassama", "Lower Dabor", "Upper Dabor", "Bambara", "Bonya", "Bundoryama", "Gorama", "Korgay", "Seiwor", "Giebu", "Joru", "Kokoru", "Biatong", "Famanjo", "Kaklawa", "Kualley", "Gboro-Lokoma", "Karga", "Sonnie", "Laminaia", "Joi", "Koya Gbundohun", "Menima", "Serabu", "Upper Koya", "Sansangie", "Njeiwoma", "Bonya", "Korjei Ngieya", "Seduya", "Fallay", "Gboro", "Korjei Buima", "Konjo Buiima", "Nyawa", "Sei", "Hulorhun Njagbudor", "Hulorhun Njeigor", "Konjo Njeigor", "Konjo Yematanga", "Lower Torgboma", "Upper Torgboma", "Bandawor", "Kpatawa", "Gboo", "Mabondor", "Niawa", "Vaama", "Faama", "Ngiebu", "Dagbanya", "Dakpana", "Kona Foiya", "Bundoryama", "Gbo Kakajama B", "Kona Kpindibu", "Gbo Lambayama B", "Kagbado Kamboima", "Kagbado Njeigbla", "Fonde", "Yalenga", "Fallay", "Gorama", "Niawa", "Kamboma", "Niawa", "Sowa", "Songhai", "Daru", "Gegbwema", "Giewoma", "Jewahun", "Tongorwa", "Shekaia", "Kuawuma", "Taninahun", "Boryongor", "Gbogbeima", "Kemoh", "Airfield", "Gbo Kakajama A-Bur", "Gbo Kakajama A-Lum", "Bulima", "Gbo Lambayama A-Le", "Gbo Lambayama A-Re", "Gbo Kakajama A-Tec", "Gbo Kakajama A-Nja", "Gbo Kakajama A-Kpa", "Gbo Kakajama A-Kis", "Sulaimania", "Gbo Kakajama A-Shi", "Gbo Lambayama A-Nd", "Gbo Lambayama A-Ny", "Gbo Lambayama A-Fo", "Gbo Kakajama A-Lam", "Gbo Lambayama A-Go", "Gbo Lambayama A-RT", "Kumatandu", "Gbo Lambayama A-Ko", "Baiwalla", "Dodo", "Sakiema", "Sienga", "Mahera", "Bobor", "Kaio", "Lower Giebu", "Lower Luyengeh", "Mano", "Teneba Bramaia", "Sowa", "Upper Giebu", "Upper Luyengeh", "Dakaleley", "Kama Teng", "Gao", "Kama Toh", "Bumasadu", "Konio", "Kundu", "Mano-Sewallu", "Lela", "Torli", "Bende Bengu", "Tongi Tingi", "Konio", "Pokorli", "Bongre", "Borkou", "Falloh", "Jorwu", "Manowa", "Marwei", "Mende Buima", "Seimaya", "Bunumbu", "Golama", "Kpaewa", "Kpindima", "Baoma", "Gbela", "Giehun", "Lower Kpombali", "Luawa Foguiya", "Upper Kpombali", "Bamburu", "Njagbla", "Pelegbambeima", "Upper Sami", "Gbongre", "Levuma Jeigbla", "Lower Kuiva", "Jonga", "Upper Kuiva", "Bombowa", "Dan Sei", "Falley", "Fauya", "Turaya", "Kargbu", "Keimaya", "Lower Nyawa", "Sei I", "Sei II", "Upper Nyawa", "Gbinle", "Bambara", "Bomaru-guma", "Goleiwoma", "Lower Baimba", "Mano", "Golu", "Korbu", "Naiahun", "Bendu", "Kuiva Buima", "Kuiva Jagor", "Kuivawa", "Damai", "Fallay", "Kpallay", "Niagorehun", "Njargbahun", "Sei", "Bum", "Gorapon", "Jimmi", "Tissana", "Jongo", "Kemoh", "Niawa", "Nyallay", "Samawa", "Bambawo", "Fallay", "Lower Pataloo", "Upper Kama", "Mawojeh", "Njeima", "Sonnah", "Upper Pataloo", "Kemoh", "Bongo", "Bumpe", "Foya", "Kpetema", "Sahn", "Serabu", "Sewama", "Taninahun", "Nyawa", "Walihun", "Yengema", "Gbo", "Maryu", "Lower Kama", "Lower Niawa", "Nekpondo", "Tongowa", "Upper Baimba", "Upper Niawa", "Korjeh", "Kpandobu", "Mangaru", "Sei", "Nguabu", "Nyallay", "Nyawa", "Keisua", "Kamakathie", "Samamie", "Sewa", "Sindeh", "Lunsar-Robis", "Gao", "Kamba", "Kargbevu", "Kemoh", "Bainyawa", "Magbao", "Yorma", "Kamakilla", "Baimba", "Mambawa", "Lower Niawa", "Upper Niawa", "Yalenga", "Kaduawo", "Mokpendeh", "Morku", "Magbankitha", "Ngolamajie", "Njagbla I", "Yarlenga", "Njagbla II", "Deilenga", "Kendebu", "Central Kargoi", "Seiwa", "Sendeh", "Magbengbeh", "Lunia", "Ngovo", "Seilenga", "Lower Kargoi", "Manyeh", "Upper Kargoi", "East Ward-Batiema", "East Ward-Bumpeh-W", "East Ward-Gbondo T", "East Ward-Kindia T", "East Ward-Lower Sa", "East Ward-Manjama", "East Ward-Messima", "East Ward-Moriba T", "North Ward-Bo Numb", "North Ward-Kissy Town", "Makump", "West Ward-Kandeh T", "North Ward-Njai To", "Kasokira", "North Ward-Reservation", "West Ward-Lewabu -", "Masaba", "West Ward-Moriba T", "West Ward-Nikibu -", "West Ward-Njagboim", "Lower Massakong", "Petifu Mayawa A", "Lower Polie", "Petifu Mayawa B", "Simiria", "Rogbalan", "Mayeppoh", "Fuladugu", "Marunia", "Petifu Mayeppoh", "Upper Massakong", "Upper Polie", "Yiben", "Yele Manowo", "Mabonto", "Kakallain", "Kabaia", "Kamarugu", "Makelfa", "Makontande", "Mayaso", "Lower Section", "Upper Section", "Mabilafu", "Kumrabai", "Bo Road", "Mabang", "Marunia Sakie", "Lal-Lenken", "Makump", "Mamuntha", "Mayatha", "Massebay", "Mayossoh", "Old Magburaka", "Mamurie", "Makali", "Makong", "Masingbi", "Mathonkara", "Wonkibor", "Lunsar-Madigbo", "Makoba", "Rolal", "Sanda", "Lunsar-Mamanso", "Semorkanie", "Thamah", "Thambaya", "Wana", "Lunsar-Mines", "Yenkeh", "Kiamp Kakolo", "Lunsar-Old Town", "Malal", "Numula 5", "Manewa", "Mara", "Matanka", "Sambaya", "Rochen", "Borowah", "Maboboh Koray", "Mapakie", "Buyan", "Dayie", "Makrugbeh", "Mange-bana", "Mabureh Mende", "Mathunkara", "Mange Morie", "Malanchor", "Matotoka", "Makeni Rokefula", "Foindu", "Gaindema", "Macrogba", "Magbengbe", "Malompor", "Petifu-Lower", "Karine", "Marenka", "Minthormore", "Mamaka", "Masengbe", "Kalangba", "Mayira", "Petifu Upper", "Ronietta", "Kambia Morie", "Konta Ferry", "Mabombo", "Makana", "Yoni", "Barmoi", "Kagbanthama", "Kaiyeabor", "Romeni", "Rotifunk", "Yali-Sanda", "Kayembor", "Foredugu", "Filligungee", "Gbaran Kamba", "Kamasundu", "Mabureh Buya", "Konta Kargbo", "Manungbu", "Robis", "Rokel", "Rosint", "Worreh Mapoteh", "Mafonda", "Makabari", "Foronkoya", "Kasongha", "Lungi", "Mahera", "Yongro", "Mamanki", "Mayaya", "Rosint", "Fondu", "Magbandoma", "Benkia", "Gbabai", "Foredugu", "Futa", "Kagbala A", "Kagbala B", "Magbeni", "Marefa", "Matene", "Rosarr", "Mawoma", "Robia", "Rokel", "Sanda", "Tumba", "Benkia", "Gbainty", "Kamasondo", "Kantaya", "Katonga", "Komrabai", "Konta", "Magbokorr", "Mannah", "Mapiterr", "Matheng", "Petifu", "Royema", "Batpolon", "Falaba", "Fenka", "Gberray Bana", "Gberray Morie", "Gberray Thunkara", "Gbonko Mayira", "Kabata", "Komrabai-Waterloo", "Kondato", "Maboni", "Maforay", "Magbeni", "Makorobolai", "Malal", "Mamanso", "Mapolie", "Maronko", "Mathera", "Moria", "Old Port Loko", "Lunsar-Technical", "Romaka", "Rosarr", "Sanda", "Lunsar-Path Bana", "Sendugu", "Tauya", "Lunsar-Baipolon", "Lunsar-Four Road -", "Lunsar-Kenneday", "Lunsar-Mabai", "Magbele", "Mange", "Marampa", "Biki", "Mawullay", "Petifu Madina", "Rogballan", "Rolankonoh", "Masimera", "Biss-Manika", "Katick", "Maconteh", "Mamalikie", "Matuku", "Mayola-Thatha", "Nonkoba", "Rokel", "Masien", "Rokon/Komboya", "Yoni-Pet", "Bankro", "Gbaneh-Loko", "Kokar", "Gbogbodo", "Gbonko", "Kantia", "Layamantmetank", "Magbolontor", "Malkiya", "Mankneh", "Menthen", "Robis", "Rotigbonko", "Sendugu", "Gbaray Bana", "Kambia", "Kanu", "Kargbo", "Konkorie", "Mafonikay", "Magbafth", "Magbapsa", "Sangbada", "Malakuray", "Maron", "Robombeh", "Tasso Island", "Dumbia", "Fiama", "Tensendakor", "Kooma", "Yorkor", "Gbikidakor", "Kamara", "Maikandor", "Gbane Kandor", "Gbane Kour", "Gbane Tetema", "Gbendekor", "Yanbidu", "Bassia", "Banfinfeh", "Banyafeh", "Banyakor", "Moindefeh", "Moindekor", "Dangbaidu", "Gbondu", "Kongofinja", "Sukudu", "Dia", "Kamara", "Kensay", "Lei", "Tankoro", "Tingi-Kor", "Yawai", "Kamiendor", "Kutey", "Mafindor", "Bafinfeh", "Bandafafeh", "Njama", "Gbogboafeh", "Jaiama", "Masayiefeh", "Gbense-Sina Town", "Bafinfeh", "Bafinfeh", "Gbense-Moindekor", "Dangbaidu", "Njeikor", "Foidu Mongor", "Gbense-Moindefeh", "Kokongokuma", "Maindu", "Mofinkor", "Sawa Buma", "Tensekor", "Tankoro", "Woafeh", "Bawadu", "Tankoro-Kinsey", "Tankoro-New Sembeh", "Tankoro-Lebanon", "Tankoro-Kwaquima", "Kunbulun 1", "Kunbulun 2", "Manan", "Mawundea", "Numula 1", "Numula 2", "Numula 3", "Numula 4", "Sinkunia", "Darakuru", "Gbenekoro", "Kania", "Kondembaia", "Lengekoro", "Sokurala", "Balandugu", "Dogoloya", "Fissaya I", "Fissaya II", "Nomokoya", "Gbentu III", "Herekor", "Kalia", "Kakallain", "Kamba", "Lagor", "Gbonkobor", "Musaia", "Sankan I", "Sankan II", "Kaponpon", "Kasunko", "Kayaka", "Tamiso I", "Tamiso II", "Benadugu", "Deldugu", "Mankalia", "Mongo I", "Mongo II", "Kalangba", "Morifindugu", "Kulor", "Neya I", "Neya II", "Heremakono", "Nyedu", "Barawa", "Pampakoh", "Kalian", "Bendugu", "Wollay", "Yiffin", "Semamaia", "Koinadugu", "Lower Kamadugu", "Bilimaia", "Biribaia", "Dara", "Upper Kamadugu", "Yiraia", "Yogomaia", "Falaba", "Fudea", "Ganya", "Gberia Fotombu", "Gberia-Timbako", "Kaliyereh", "Kambaia", "Koindu-Kura", "Sonkoya", "Bafodia", "Kadanso", "Kakoya", "Mambolo", "Kamanikie", "Kamayortortor", "Kambalia", "Kambia", "Taelia", "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7", "Kabakeh/Balandugu", "Bumban", "Bumbandain", "Karassa", "Kagbankuna", "Kamabai", "Kamaranka", "Karina", "Kayonkoro", "Makumray A", "Kafala", "Kagbaran Dokom B", "Makumray B", "Konta", "Matotoka", "Gbenkfay", "Gbonkobana", "Kambia", "Kayourgbor", "Laminaya", "Makulon", "Rogberay", "Romaneh", "Royeama A", "Royeama B", "Sakuma A", "Sakuma B", "Sendugu A", "Sendugu B", "Garanganwa", "Makarihiteh", "Makump", "Gbendembu", "Kalangba", "Kania", "Makeregbohun", "Lobanga", "Lohindie", "Loko-Madina", "Makai", "Mamaka", "Mamukay", "Tanyehun", "Masongbo", "Matehun", "Mayorthan", "Sahun", "Tambiama", "Batkanu", "Mafonda", "Magbaingba", "Magbanamba", "Makaiba", "Makayrembay", "Simbaya", "Mandawahun", "Manyakoi", "Mayankay", "Robaka", "Rotha-Tha", "Hunduwa", "Kababala", "Kagberay", "Kawungulu", "Kathegeya", "Makendema", "Mambiama", "Manjahagha", "Sokudala", "Yana", "Gborbana", "Mabanta", "Magbenteh", "Mangay", "Mankene", "Masongbo A", "Rosint", "Masongbo B", "Punthun", "Kathanthan", "Tonkoba", "Yainkassa", "Mapaki", "Masabong", "Mayagba", "Rosanda", "Maparay", "Binkolo", "Bombali Bana", "Kabonka", "Kasengbeh", "Kayassi", "Mabamba", "Masapi", "Banka", "Benia", "Kaindema", "Kamalu", "Kania", "Kindia", "Laminaya", "Rothatha", "Madina", "Maharibo", "Makapa", "Makwie Loko", "Manathi", "Kalangba", "Kukuna", "Marampa", "Masisan", "Mateboi", "Rogbin", "Rogboreh", "Rosos", "Sendugu", "Yankabala", "Bugami", "Kamakwie", "Kamankoh", "Kayimbor", "Magbonkoni I", "Magbonkoni II", "Manonkoh", "Samia", "Dugutha", "Makari Gbanti - Mi", "Moria", "Paramount Chief Se", "Simibue", "Thalla", "Bombali Sebora - B", "Makari Gbanti -Mas", "Bombali Sebora - K", "Bombali Sebora - Makeni", "Bombali Sebora - R", "Bombali Sebora - T", "Bombali Sebora - W", "Banguraia", "Fortumboyie", "Gberekhuray", "Gbolon", "Kabaya", "Kanku Bramaia", "Kua Bramaia", "Katalan", "Mafaray", "Maton", "Rogberay", "Sanda", "Tawuya", "Bombe", "Kamba", "Kambia", "Kargbulor", "Robat", "Rokupr", "Tormina", "Kalenkay", "Matetie", "Mayakie", "Robis", "Rowollon", "Tombo-Wallah", "Bamoi", "Mange", "Benna", "Kawula", "Kayenkassa", "Mapolon", "Maserie", "Matengha", "Matilba", "Nonko", "Samu", "Sumbuya", "Thalla", "Bubuya", "Kpanga Koimato", "Kassiri", "Koya", "Kychom", "Lusenia", "Mafufuneh", "Makuma", "Mapotolon", "Moribaia", "Rokon", "Rosinor", "Bubuya", "Kathanthineh", "Magbonkoh", "Sowonde", "Mamankoh", "Fabaina Area", "Madonkeh", "Magbafti", "Malambay", "Newton", "Songo", "Bathurst", "Charlotte", "Gloucester", "Leicester", "Regent", "Benguema Village A", "Campbell Town Vill", "Waterloo Village A", "Hastings Village A", "Gbendembu", "Goderich-Adonkia/M", "Goderich-Funkia", "Hamilton", "Kent", "Albert Academy", "Kossoh Town", "Sattia/Tombo", "York", "Bombay", "Mountain Regent", "Sorie Town", "Susan's Bay", "Tower Hill", "Connaught Hospital", "Sanders Brook", "Cline Town", "Fourah Bay", "Coconut Farm/ Asho", "Foulah Town", "Ginger Hall", "Kissy Brook", "Magazine", "Mount Aureol", "Quarry", "Congo Water I", "Allen Town I", "Congo Water II", "Allen Town II", "Bottom Oku", "Grass Field", "Industrial Estate", "Kuntolor", "Jalloh Terrace", "Kissy Brook", "Lowcost Housing", "Kissy Bye Pass I", "Mamba Ridge I", "Mamba Ridge II", "Kissy Bye Pass II", "Kissy Mental", "Kissy Mess Mess", "Mayenkineh", "Old Warf", "Njaifeh", "Pamuronko", "Portee", "Thunderhill", "Robis", "Rokupa", "Shell", "Cockerill-Aberdeen", "Ascension Town", "Brookfields", "Kingtom", "Kroo Town", "Brookfields-Congo", "Brookfields-Red Pu", "Congo Town", "George Brook (Dwor", "New England-Hannes", "New England-Hill C", "Cockle-Bay /Colleg", "Tengbeh Town", "Aberdeen", "Hill Station", "Juba/Kaningo", "Njagbakahun", "Lumley", "Malama/Kamayama", "Murray Town", "Pipeline/Wilkinson", "Wilberforce", "Lower Sami", "Jagor", "Ngiewoma-Njeigor", "Kufuru", "Gorahun", "Gbane Yemao", "Mongo", "Bunabu", "Kangama", "Selokoma", "Koaro", "Peyifeh", "Tama", "Fakongofeh", "Kawafeh", "Samgbafeh", "Sinkongofeh", "Sumunjifeh", "Tharma Forest", "Yawatanda", "Sawa Fiama", "Komadu", "Kwidu", "Konta", "Kamassassa", "Yebaya", "Marunia Koray", "Saradu", "Sumbaria", "Kahekay", "Yurika", "Ba-Kobotu", "Benkeh", "Njagbema", "Yeima", "Lower Ribbi", "Pembaar"]

# Western Area  == Western Area Urban (all Freetown)
# Otherwise, all merge except for one weirdo: Bockarie, which doesn't seem to exist?
set(df.Adm2) - set(SLE_adm2)
df[df.Adm2 == "Western Area"].Adm4.value_counts()


set(df.Adm4) - set(SLE_adm4)


# UN-OCHA populated places: https://data.humdata.org/dataset/sierra-leone-settlements
x = pd.read_excel("/Users/laurahughes/Downloads/sle_populatedplaces_tabulardata.xlsx")
len(set(df.Adm4) - set(x.featureName_en) - set(x.admin4Name_en))
# Short answer: fields don't easily merge with OCHA boundary names.



# OSM place names
# https://data.humdata.org/dataset/openstreetmap-settlement-place-names-west-africa
y = pd.read_csv("/Users/laurahughes/Downloads/interpreter.csv")
len(set(df.Adm4) - set(y.name))
len(set(df.Adm4) - set(x.featureName_en) - set(x.admin4Name_en) - set(y.name) - set(y.alt_name))

(set(df.Adm4) - set(x.featureName_en) - set(x.admin4Name_en) - set(y.name) - set(y.alt_name))
len(set(df.Adm4))

# --- rename the contact exposure / connection ---
df.columns
df.rename(columns = {"level/type of exposure": "exposureType", "rel between survivor anc contacts": "contactSurvivorRelationship"}, inplace = True)

# --- nest the IgG measurements ---
def nestELISAs(row):
    if((row['ebola IgG'] == row['ebola IgG']) & (row['lassa IgG'] == row['lassa IgG'])):
        return([
            {
                "virus": "Ebola",
                "assayType": "IgG",
                "ELISAresult": row['ebola IgG']
            },
            {
                "virus": "Lassa",
                "assayType": "IgG",
                "ELISAresult": row['lassa IgG']
            }
        ])
    elif(row['ebola IgG'] == row['ebola IgG']):
        return([{
            "virus": "Ebola",
            "assayType": "IgG",
            "ELISAresult": row['ebola IgG']
        }])
    elif(row['lassa IgG'] == row['lassa IgG']):
        return([{
            "virus": "Lassa",
                "assayType": "IgG",
                "ELISAresult": row['lassa IgG']
                }])


df['elisa'] = df.apply(nestELISAs, axis = 1)

# --- nest the symptoms and convert to binaries ---
def binarize(val):
    if(val == val):
        if(val == "yes"):
            return(True)
        elif(val == "no"):
            return(False)
        elif(val == 0):
            return(False)
        elif(val == 1):
            return(True)

def nestSymptoms(row, timepoint = "survivor enrollment"):
    obj = {}
    obj["timepoint"] = timepoint
    obj["symptoms"] = {}

    obj["symptoms"]["joint_pain"] = binarize(row['joint pain'])
    obj["symptoms"]["muscle_pain"] = binarize(row['muscle pain'])
    obj["symptoms"]["hearing_loss"] = binarize(row['hearing loss'])
    obj["symptoms"]["ringing_in_ears"] = binarize(row['ringing in ears'])
    obj["symptoms"]["dry_eyes"] = binarize(row['dry eyes'])
    obj["symptoms"]["burning_eyes"] = binarize(row['burning eyes'])
    obj["symptoms"]["vision_loss"] = binarize(row['loss of vision'])
    obj["symptoms"]["blurry_vision"] = binarize(row['blurry vision'])
    obj["symptoms"]["light_sensitivity"] = binarize(row['light sensitivity'])
    obj["symptoms"]["eye_pain"] = binarize(row['painful eyes'])
    obj["symptoms"]["eye_foreign_body_sensation"] = binarize(row['sensation of foreign body in eye'])
    return([obj])
df['symptoms'] = df.apply(nestSymptoms, axis = 1)

# () ID/study/G-num all merge w/ previous data. --> Check data + add in hhID, altIDs, relatedTo
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")

from merge_public_ids_20190227 import ids


# Merge together the roster of survivor IDs --> public IDs
# first-- simple merge based just on the study IDs.
simple_merge = pd.merge(df, ids, how="outer", indicator=True, left_on=["study specific number"], right_on=["Study Specific #"])
simple_merge._merge.value_counts()

# Looks more or less as expected. ~ 495 LSV survivors/contacts, 3 non-matches: 2 from the C-ids missing a study specific number, 1 from a duplicate row that was meant to be contact #3.
simple_merge[simple_merge._merge == "left_only"]

# merge in previous roster info based on all fields
# Since there are some lower-case IDs in metadata file, convert to all upper case.
df['sID'] = df['ID number'].apply(lambda x: x.upper())

merged = pd.merge(df, ids, how="outer", indicator=True, left_on=["study specific number", "G number", "sID"], right_on=["Study Specific #", "G-Number", "sID"])
merged._merge.value_counts()

weird_ids = merged[merged._merge == "left_only"]['study specific number']
weird_ids.shape


# 14 IDs look wonky.
merged[(merged["study specific number"].isin(weird_ids)) | merged["Study Specific #"].isin(weird_ids)][["G-Number", "Study Specific #", "sID", "G number", "study specific number", "G number", "ID number"]]
df[df['study specific number'].isin(weird_ids)]
simple_merge[simple_merge['Study Specific #'].isin(weird_ids)][["study specific number", "sID", "ID number", "G-Number",  "G number"]].rename(columns = {'sID': 'scrambledID', 'ID number': 'metadataID', 'G-Number': 'scrambledGID', "G number": "metadataGID"}).to_csv("2019-03-07_metadata-scrambled-roster-discrepancies.csv")
simple_merge[simple_merge['contactGroupIdentifier']=="188755"][["study specific number", "sID", "ID number", "G-Number",  "G number"]].rename(columns = {'sID': 'scrambledID', 'ID number': 'metadataID', 'G-Number': 'scrambledGID', "G number": "metadataGID"})


# Check geo location within households

# There's a number of households with differnt districts and villages.
# Could make sense-- spot checking seems to indicate they were family members or associates who were maybe exposed during the infection period.
check_geo = merged[(merged.district == merged.district) & (merged.village == merged.village)].groupby("contactGroupIdentifier")[['district', 'village']].agg(lambda x: len(set(x)) == 1)

check_geo[(~check_geo.district | ~ check_geo.village)].shape
check_geo[(~check_geo.district )]


# ---- export ----
merged.columns

merged.iloc[1000]


# --- add in altIDs ---
# BUG: (probably)-- a couple instances where IDs are different b/w rosters. Need to be finalized before combining for real.
def combineIDs(row):
    ids = []
    ids.append(row["ID number"])
    if(row.gID == row.gID):
        ids.append(row.gID)
    if(row.gID2 == row.gID2):
        ids.append(row.gID2)
    return(ids)

merged['alternateIdentifier'] = merged.apply(combineIDs, axis = 1)

merged.columns

merged._merge.value_counts()
# TODO --- add in relatedTo ---
groups = merged.groupby("contactGroupIdentifier").patientID.apply(list)
groups = pd.DataFrame(groups).reset_index()
groups.rename(columns={'patientID': 'relatedTo'}, inplace=True)
groups
merged.drop(["_merge"], axis=1, inplace=True)
merged = pd.merge(merged, groups, how="outer", on="contactGroupIdentifier", indicator= True)
merged.shape

def removeSelfID(row):
    if(isinstance(row.relatedTo, list)):
        if(len(row.relatedTo) > 0):
            ids = row.relatedTo.copy()
            ids.remove(row.patientID)
        return(ids)

merged['relatedTo'] = merged.apply(removeSelfID, axis = 1)

# Removing homeLocation TEMP b/c validator is confused having 2 possible types
cols = ['patientID', 'alternateIdentifier', 'contactGroupIdentifier', 'cohort', 'outcome', 'country', 'gender', 'relatedTo', 'contactSurvivorRelationship', 'exposureType', 'age', 'elisa', 'symptoms']
# cols = ['patientID', 'alternateIdentifier', 'contactGroupIdentifier', 'cohort', 'outcome', 'country', 'homeLocation', 'gender', 'relatedTo', 'age', 'elisa']

# Make sure there's an ID number-- removes the patients in the roster but not Ebola peoples.
subset = merged[merged["ID number"] == merged["ID number"]]
# TEMP shim: age, elisa, etc. can't be null in json validation on backend.  filtering out here so things can be uploaded.
subset = subset[(subset["age"] == subset["age"]) & (subset["elisa"] == subset["elisa"])]
subset = subset.sort_values(by=["contactGroupIdentifier"])
subset = subset.reset_index()
subset[subset.patientID=="C-8939543"]
subset = subset.iloc[900:1000]
subset.shape
# subset = subset.iloc[0:1300]
subset[cols].to_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/uploads/2019-03-08_Ebolapatients_PRIVATE.json", orient="records")
