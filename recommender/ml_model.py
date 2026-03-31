import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors


class MovieRecommender:
    def __init__(self):
        # 1. Load the data
        self.movies_list = self._load_data()

        # 2. Train the KNN Model immediately on startup
        self._train_model()

    def _load_data(self):
        # Path directly in the 'data' folder next to this python file
        json_path = os.path.join(os.path.dirname(__file__), 'data', 'movies.json')

        with open(json_path, 'r') as file:
            return json.load(file)

    def _train_model(self):
        # Extract just the genres from every movie to train the AI
        genres = [movie.get('genre', '') for movie in self.movies_list]

        # Convert text genres ("Sci-Fi Thriller Space") into numerical matrices
        self.vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = self.vectorizer.fit_transform(genres)

        # Build the actual KNN model using Cosine Similarity
        self.knn = NearestNeighbors(metric='cosine', algorithm='brute')
        self.knn.fit(tfidf_matrix)

    def get_all_movies(self):
        # Convert list to dictionary keyed by ID for your views to easily read
        return {movie['id']: movie for movie in self.movies_list}

    def get_recommendations(self, movie_id, n_recommendations=6):
        """ The true ML Recommendation function """
        idx = int(movie_id)
        source_movie = self.movies_list[idx]

        # Convert the target movie's genre into a vector
        target_vector = self.vectorizer.transform([source_movie['genre']])

        # Ask KNN for the closest matches (ask for n+1 because the 1st result is the movie itself)
        distances, indices = self.knn.kneighbors(target_vector, n_neighbors=n_recommendations + 1)

        # Grab the indices of the matches, skipping the first one (the original movie)
        recommended_indices = indices[0][1:]

        # Build the final list of recommended movie dictionaries
        suggestions = [self.movies_list[i] for i in recommended_indices]

        return source_movie, suggestions