from django.shortcuts import render
from django.http import JsonResponse
from .ml_model import MovieRecommender

recommender = MovieRecommender()

def home(request):
    all_movies = recommender.get_all_movies()

    recent_movies = {k: v for k, v in all_movies.items() if v['status'] == 'Released'}
    recent_movies = dict(list(recent_movies.items())[:12])

    return render(request, 'recommender/pages/index.html', {'movies': recent_movies})


def recommend(request, movie_id):
    try:
        # Ask the ML Model for the true mathematical neighbors!
        source_movie, suggestions = recommender.get_recommendations(movie_id, n_recommendations=6)

        data = {
            'watching_now': {
                'title': source_movie.get('title', 'Unknown'),
                'image': source_movie.get('image', ''),
                'desc': source_movie.get('desc', 'No description available.')
            },
            'recommendations': [
                {
                    'title': m.get('title', 'Recommended'),
                    'image': m.get('image', ''),
                    'genre': m.get('genre', 'Movie')
                } for m in suggestions
            ]
        }
        return JsonResponse(data)

    except Exception as e:
        print(f"Error in recommend view: {e}")
        return JsonResponse({'error': 'Movie data mismatch'}, status=404)

def movie_list(request):
    all_movies = recommender.get_all_movies()
    return render(request, 'recommender/pages/movie_list.html', {'movies': all_movies})

def upcoming(request):
    all_movies = recommender.get_all_movies()
    # Python dictionary comprehension to filter ONLY Upcoming movies!
    upcoming_movies = {k: v for k, v in all_movies.items() if v['status'] == 'Upcoming'}

    return render(request, 'recommender/pages/upcoming.html', {'movies': upcoming_movies})

def all_movies(request):
    all_movies = recommender.get_all_movies()
    return render(request, 'recommender/pages/all_movies.html', {'movies': all_movies})