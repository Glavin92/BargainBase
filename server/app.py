from optimized_scraper import scrape_amazon_selenium, flipkart_scraper, merge_products_for_display, amazon_ratings, flipkart_rating
from flask import Flask, request, jsonify
import multiprocessing
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


def run_scraper(scraper_func_name, query):
    if scraper_func_name == "amazon":
        return scrape_amazon_selenium(query)
    elif scraper_func_name == "flipkart":
        return flipkart_scraper(query)
    return []

def scrape_single_link(link):
    """Helper function to scrape a single product link"""
    try:
        if 'amazon' in link:
            result = amazon_ratings(link)
        elif 'flipkart' in link:
            result = flipkart_rating(link)
        else:
            result = {'error': 'Unsupported website', 'url': link}
        return result
    except Exception as e:
        return {'error': str(e), 'url': link}


@app.route('/api/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '').strip()

    if not query:
        return jsonify({"error": "Please enter a search term"}), 400

    with multiprocessing.Pool(processes=2) as pool:
        results = pool.starmap(run_scraper, [
            ("amazon", query),
            ("flipkart", query)
        ])

    amazon_result, flipkart_result = results
    merged = merge_products_for_display(amazon_result + flipkart_result)

    return jsonify({"products": merged})

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
    


if __name__ == '__main__':
    multiprocessing.set_start_method("spawn", force=True)
    app.run(debug=True, port=5000)
