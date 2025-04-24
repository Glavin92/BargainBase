from optimized_scraper import scrape_amazon_selenium, flipkart_scraper, merge_products_for_display, amazon_ratings, flipkart_rating, save_to_csv
from flask import Flask, request, jsonify
import multiprocessing
from flask_cors import CORS
import pandas as pd
from test2 import collaborative_filtering_recommendations, content_based_recommendations, hybrid_recommendations
import ast
import os
import json
import random
from datetime import datetime
import traceback

# Configuration
CSV_FILE_PATH = r'C:\sem6-mini-project\amazon_flipkart_products.csv'
USER_RATINGS_FILE = "user_ratings.json"
FAKE_RATINGS_FILE = "fake_ratings.json"
REQUIRED_PRODUCT_COLUMNS = [
    'id', 'name', 'brand', 'price_display', 'best_price',
    'avg_rating', 'thumbnail', 'available_on', 'variants'
]

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Helper Functions
def load_json_data(filename):
    """Load data from JSON file or return empty dict/list"""
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            return json.load(f)
    return {}

def save_json_data(data, filename):
    """Save data to JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

def init_user_data():
    """Initialize all data storage files with proper structure"""
    # Initialize user ratings with empty dict if not exists
    if not os.path.exists(USER_RATINGS_FILE):
        save_json_data({}, USER_RATINGS_FILE)
    
    # Initialize fake ratings with empty list if not exists
    if not os.path.exists(FAKE_RATINGS_FILE):
        save_json_data([], FAKE_RATINGS_FILE)

def load_or_create_dataframe(filepath):
    """Load CSV or create empty DataFrame with validation"""
    try:
        # Check if file exists and has content
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            return pd.DataFrame(columns=REQUIRED_PRODUCT_COLUMNS)
            
        # Read CSV with error handling
        df = pd.read_csv(filepath)
        
        # Skip empty DataFrames
        if df.empty:
            return pd.DataFrame(columns=REQUIRED_PRODUCT_COLUMNS)
            
        # Safe header duplicate removal
        def is_header_duplicate(row):
            try:
                return all(str(row[col]) == str(col) for col in df.columns if col in row)
            except:
                return False
                
        df = df[~df.apply(is_header_duplicate, axis=1)]
        
        # Remove completely empty rows
        df = df.dropna(how='all')
        
        # Ensure required columns exist
        for col in REQUIRED_PRODUCT_COLUMNS:
            if col not in df.columns:
                df[col] = None
                
        return df
        
    except Exception as e:
        print(f"Error loading CSV: {str(e)}")
        traceback.print_exc()
        return pd.DataFrame(columns=REQUIRED_PRODUCT_COLUMNS)

def generate_proper_fake_ratings(product_ids, num_users=20):
    """Generate fake ratings with safe sampling"""
    if not product_ids:
        return pd.DataFrame(columns=['user_id', 'product_id', 'rating'])
    
    fake_data = []
    for user_id in range(1, num_users + 1):
        # Safe sampling - never request more than available
        sample_size = min(len(product_ids), max(1, random.randint(1, 5)))
        rated_products = random.sample(product_ids, k=sample_size) if product_ids else []
        
        for pid in rated_products:
            fake_data.append({
                'user_id': f'user_{user_id}',
                'product_id': pid,
                'rating': round(random.uniform(3.0, 5.0), 1)
            })
    return pd.DataFrame(fake_data)

# Initialize Data
try:
    df = load_or_create_dataframe(CSV_FILE_PATH)
    product_ids = df['id'].dropna().unique().tolist()
    init_user_data()
    
    # Load or generate ratings
    fake_ratings = load_json_data(FAKE_RATINGS_FILE)
    ratings_df = pd.DataFrame(fake_ratings) if fake_ratings else generate_proper_fake_ratings(product_ids)
    save_json_data(ratings_df.to_dict('records'), FAKE_RATINGS_FILE)
    
    # Ensure ratings have required columns
    if ratings_df.empty:
        ratings_df = pd.DataFrame(columns=['user_id', 'product_id', 'rating'])
except Exception as e:
    print(f"Initialization error: {str(e)}")
    df = pd.DataFrame(columns=REQUIRED_PRODUCT_COLUMNS)
    ratings_df = pd.DataFrame(columns=['user_id', 'product_id', 'rating'])

current_search_results = []

# API Endpoints
@app.route('/api/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({"error": "Please enter a search term"}), 400

        with multiprocessing.Pool(processes=2) as pool:
            results = pool.starmap(run_scraper, [("amazon", query), ("flipkart", query)])

        merged = merge_products_for_display(results[0] + results[1])
        global current_search_results
        current_search_results = merged.copy()
        
        # Save with error handling
        try:
            save_to_csv(merged, CSV_FILE_PATH)
        except Exception as e:
            print(f"Error saving CSV: {str(e)}")

        return jsonify({"products": merged})
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Search failed"}), 500

@app.route('/api/product_details', methods=['POST'])
def fetch_variant_details():
    data = request.get_json()
    links = data.get('links', [])
    
    if not links:
        return jsonify({'error': 'No links provided'}), 400
    
    try:
        # Create a pool of workers (one per CPU core)
        with multiprocessing.Pool(processes=min(4, len(links))) as pool:
            results = pool.map(scrape_single_link, links)
        
        return jsonify({
            'status': 'success',
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/recommendations/content', methods=['POST'])
def content_recommendations():
    data = request.get_json()
    product_id = data.get('product_id')
    top_n = data.get('top_n', 5)
    search_results = data.get('search_results', [])

    if not product_id or not search_results:
        return jsonify({'error': 'Product ID and search results are required'}), 400

    try:
        df = pd.DataFrame(search_results)

        if 'id' not in df.columns or 'name' not in df.columns:
            return jsonify({'error': 'Missing required columns in search results'}), 400

        recommendations = content_based_recommendations(df, product_id, top_n)
        if recommendations.empty:
            return jsonify({'error': 'No recommendations found'}), 404
        return jsonify(recommendations.to_dict(orient='records'))
    except KeyError as e:
        return jsonify({'error': f'Missing key in data: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/collaborative', methods=['POST'])
def collaborative_recommendations():
    data = request.get_json()
    user_id = data.get('user_id', "demo_user")  # Default user for demo
    top_n = data.get('top_n', 10)

    df = load_or_create_dataframe(CSV_FILE_PATH)

    try:
        # Ensure we have the required columns
        if not all(col in ratings_df.columns for col in ['user_id', 'product_id', 'rating']):
            raise ValueError("Invalid ratings data structure")
        
        user_ratings = load_json_data(USER_RATINGS_FILE)
        print('user_ratings',user_ratings)
        if user_id not in user_ratings:
            user_ratings[user_id] = {}
            save_json_data(user_ratings, USER_RATINGS_FILE)
            return jsonify([])  # Return empty for new users
        print('ratings_df',ratings_df.to_dict('records'))
            
        # Get recommendations using fake data
        recommendations = collaborative_filtering_recommendations(
            ratings_df,
            df,
            user_id,
            top_n
        )
        
        # Fallback if empty - return popular products
        if recommendations.empty:
            popular = df.sort_values(by='avg_rating', ascending=False).head(top_n)
            print('popular',popular.to_dict('records'))
            return jsonify(popular.to_dict('records'))
        print('recommendations',recommendations.to_dict('records'))
            
        return jsonify(recommendations.to_dict('records'))
        
    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        # Ultimate fallback - return random products
        return jsonify(df.sample(min(len(df), top_n)).to_dict('records'))

@app.route('/api/recommendations/hybrid', methods=['POST'])
def hybrid_recommendations_api():
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'guest_user')
        product_id = data.get('product_id')
        top_n = min(int(data.get('top_n', 10)), 20)
        
        # Use current search results or fallback to full dataset
        product_df = pd.DataFrame(current_search_results if current_search_results else df.to_dict('records'))
        
        if product_df.empty:
            return jsonify({'error': 'No products available'}), 404
            
        recommendations = hybrid_recommendations(
            product_df,
            ratings_df,
            product_id,
            user_id,
            top_n
        )
        
        if recommendations.empty:
            return jsonify({'error': 'No recommendations found'}), 404
            
        return jsonify(recommendations.to_dict('records'))
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Recommendation failed'}), 500

# Helper functions for scraping
def run_scraper(scraper_func_name, query):
    try:
        if scraper_func_name == "amazon":
            return scrape_amazon_selenium(query)
        elif scraper_func_name == "flipkart":
            return flipkart_scraper(query)
        return []
    except Exception as e:
        print(f"Scraper {scraper_func_name} failed: {str(e)}")
        return []

def scrape_single_link(link):
    try:
        if 'amazon' in link:
            return amazon_ratings(link)
        elif 'flipkart' in link:
            return flipkart_rating(link)
        return {'error': 'Unsupported website', 'url': link}
    except Exception as e:
        return {'error': str(e), 'url': link}

if __name__ == '__main__':
    multiprocessing.set_start_method("spawn", force=True)
    try:
        app.run(debug=True, port=5000, host='0.0.0.0')
    except Exception as e:
        print(f"Failed to start server: {str(e)}")