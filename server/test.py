# from DocSearch import BM25Search
# from pathlib import Path

# docSearch = BM25Search([])
# UPLOAD_DIR = Path() / 'uploads'
# docSearch.build_courpus_from_directory(UPLOAD_DIR)

# question = "काठमाडौं कहाँ छ ?"

# print(docSearch.get_top_n("काठमाडौं कहाँ छ ?", 2)[0])
# print(docSearch.get_top_n("काठमाडौं कहाँ छ ?", 2)[1])

# print(docSearch.bm25.get_scores(question.split(" ")))

# from rank_bm25 import BM25Okapi

# corpus = [
#     "बागमती नदी नेपालको काठमाडौँ उपत्यका भएर बगेर महत्त्वपूर्ण काठमाडौँ र ललितपुर महानगरपालिकाहरू छुट्ट्याउँदै दक्षिणी नेपालको मधेश प्रदेश हुँदै भारतको बिहार राज्यमा कमला नदीमा मिसिन्छ। यसलाई हिन्दु र बौद्ध दुवै धर्मावलम्बीले पवित्र मानेका छन्। यसको किनारमा धेरै हिन्दु मन्दिरहरू अवस्थित छन्।",
#     "It is quite windy in London",
#     "How is the weather today?"
# ]

# tokenized_corpus = [doc.split(" ") for doc in corpus]

# bm25 = BM25Okapi(tokenized_corpus)
# query = "काठमाडौँ उपत्यका"
# tokenized_query = query.split(" ")

# doc_scores = bm25.get_scores(tokenized_query)
# print(doc_scores)