from rank_bm25 import BM25Okapi
import snowballstemmer


class BM25Search:
    def __init__(self, corpus):
        self.corpus = []
        self.stemmer = snowballstemmer.stemmer('nepali')
        if len(corpus) != 0:
            self.corpus = corpus

            self.tokenized_corpus = [self.__preprocess(doc) for doc in self.corpus]

            self.bm25 = BM25Okapi(self.tokenized_corpus)
    
    def __preprocess(self, document):
        # add some stemming here
        document = document.split(" ")
        document = self.stemmer.stemWords(document)
        return document
    
    def add_document(self, document):
        self.corpus.append(document)
        self.tokenized_corpus.append(self.__preprocess(document))
        self.bm25 = BM25Okapi(self.tokenized_corpus)
        
    def search(self, query):
        tokenized_query = query.split(" ")
        doc_scores = self.bm25.get_scores(tokenized_query)
        return doc_scores
    
    def get_top_n(self, query, n=5) -> list[str]:
        tokenized_query = query.split(" ")
        doc_scores = self.bm25.get_scores(tokenized_query)
        # top_n_scores = sorted(range(len(doc_scores)), key=lambda i: doc_scores[i])[-n:]
        top_n = self.bm25.get_top_n(tokenized_query, self.corpus, n=n)
        return top_n

    def build_courpus_from_directory(self, directory):
        for file in directory.iterdir():
            with open(file, 'r') as f:
                # Add some chunking here
                self.corpus.append(f.read())
        
        if len(self.corpus) != 0:
            # add some stemming here
            self.tokenized_corpus = [self.__preprocess(doc) for doc in self.corpus]
            self.bm25 = BM25Okapi(self.tokenized_corpus)

