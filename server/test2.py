import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import random

# Load your data
df = pd.read_csv("C:/sem6-mini-project/amazon_flipkart_products.csv")

# Convert variants from string to list of dictionaries
df['variants'] = df['variants'].apply(ast.literal_eval)

# Print columns to verify
print("Available columns:", df.columns.tolist())

def generate_fake_ratings(product_ids, num_users=100):
    """Generate synthetic user ratings for collaborative filtering"""
    fake_data = []
    for user_id in range(1, num_users + 1):
        # Each user rates 5-15 random products
        rated_products = random.sample(product_ids, k=random.randint(5, 15))
        for pid in rated_products:
            fake_data.append({
                'user_id': f'user_{user_id}',
                'product_id': pid,
                'rating': round(random.uniform(3.0, 5.0), 1)  # Mostly positive ratings
            })
    return pd.DataFrame(fake_data)

# Generate fake ratings data
product_ids = df['id'].dropna().unique().tolist()
ratings_df = generate_fake_ratings(product_ids)

def collaborative_filtering_recommendations(ratings_df, product_df, target_user_id, top_n=10):
    """
    Generate recommendations based on user similarity
    
    Args:
        ratings_df: DataFrame with user ratings
        product_df: DataFrame with product details
        target_user_id: User to recommend for
        top_n: Number of recommendations to return
        
    Returns:
        DataFrame with recommended products
    """
    # Create user-item matrix
    user_item_matrix = ratings_df.pivot_table(
        index='user_id',
        columns='product_id',
        values='rating'
    ).fillna(0)

    # Check if user exists
    if target_user_id not in user_item_matrix.index:
        return pd.DataFrame()  # Return empty for new users

    # Calculate user similarities
    similarity_matrix = cosine_similarity(user_item_matrix)
    sim_df = pd.DataFrame(
        similarity_matrix,
        index=user_item_matrix.index,
        columns=user_item_matrix.index
    )

    # Get similar users (excluding self)
    similar_users = sim_df[target_user_id].sort_values(ascending=False)[1:11]  # Top 10 similar users

    # Calculate weighted scores
    target_ratings = user_item_matrix.loc[target_user_id]
    recommendations = pd.Series(0, index=user_item_matrix.columns)
    
    for other_user, similarity in similar_users.items():
        other_ratings = user_item_matrix.loc[other_user]
        # Only consider items the target user hasn't rated
        new_items = (target_ratings == 0) & (other_ratings > 0)
        recommendations[new_items] += other_ratings[new_items] * similarity

    # Get top recommendations
    top_recommendations = recommendations.sort_values(ascending=False).head(top_n).index.tolist()
    
    # Return product details with website information
    recommended_products = product_df[product_df['id'].isin(top_recommendations)].copy()
    
    # Extract website from variants
    recommended_products['website'] = recommended_products['variants'].apply(
        lambda x: x[0]['website'] if x and len(x) > 0 else None
    )
    
    return recommended_products[[
        'id', 'name', 'brand', 'price_display', 'avg_rating', 'thumbnail', 'website'
    ]].drop_duplicates()
    
   

def content_based_recommendations(product_df, product_id, n=5):
    """
    Get similar products based on content features
    
    Args:
        product_df: DataFrame with product details
        product_id: Product to find similar items for
        n: Number of recommendations
        
    Returns:
        DataFrame with similar products
    """
    # Check if product exists
    if product_id not in product_df['id'].values:
        print(f"Product {product_id} not found")
        return pd.DataFrame()

    # Create feature vector
    product_df['features'] = (
        product_df['name'] + " " + 
        product_df['brand'] + " " + 
        product_df['price_display'].astype(str) + " " +
        product_df['avg_rating'].astype(str) + " " +
        product_df['variants'].apply(lambda x: " ".join([v['color'] for v in x if 'color' in v]) if x else "")
    )

    # Vectorize features
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(product_df['features'])

    # Calculate similarities
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    idx = product_df[product_df['id'] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort and get top matches
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:n+1]
    product_indices = [i[0] for i in sim_scores]
    
    # Return results
    recommendations = product_df.iloc[product_indices].copy()
    recommendations['similarity_score'] = [i[1] for i in sim_scores]
    recommendations['website'] = recommendations['variants'].apply(
        lambda x: x[0]['website'] if x and len(x) > 0 else None
    )
    
    return recommendations[['id', 'name', 'brand', 'price_display', 'avg_rating', 'similarity_score', 'thumbnail', 'website']]

def hybrid_recommendations(product_df, ratings_df, product_id=None, user_id=None, top_n=10):
    """
    Combine content-based and collaborative filtering
    
    Args:
        product_df: Product data
        ratings_df: User ratings
        product_id: Current product (optional)
        user_id: Current user (optional)
        top_n: Number of recommendations
        
    Returns:
        DataFrame with hybrid recommendations
    """
    content_rec = pd.DataFrame()
    collab_rec = pd.DataFrame()
    
    # Get content-based recommendations if product specified
    if product_id:
        content_rec = content_based_recommendations(product_df, product_id, top_n)
    
    # Get collaborative recommendations if user specified
    if user_id:
        collab_rec = collaborative_filtering_recommendations(ratings_df, product_df, user_id, top_n)
    
    # Combine results
    hybrid_rec = pd.concat([content_rec, collab_rec]).drop_duplicates(subset=['id'])
    
    # If we have both types, re-rank by combined score
    if not content_rec.empty and not collab_rec.empty:
        hybrid_rec = hybrid_rec.sort_values(
            by=['similarity_score', 'avg_rating'],
            ascending=[False, False]
        )
    
    return hybrid_rec.head(top_n)

# Example usage
print("\nContent-based recommendations for 'mens-i-and-bata':")
print(content_based_recommendations(df, 'mens-i-and-bata'))

print("\nCollaborative recommendations for user_5:")
print(collaborative_filtering_recommendations(ratings_df, df, 'user_5'))

print("\nHybrid recommendations for user_10 viewing 'mens-i-and-bata':")
print(hybrid_recommendations(df, ratings_df, product_id="mens-i-and-bata", user_id='user_10'))