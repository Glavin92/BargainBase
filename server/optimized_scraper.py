import csv
import random
import time
import re
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from datetime import datetime
# Setup WebDriver
def setup_driver(headless=False):
    options = webdriver.EdgeOptions()
    options.use_chromium = True
    options.add_argument("--disable-blink-features=AutomationControlled")
    if headless:
        options.add_argument("--headless")
    return webdriver.Edge(options=options)

# Scrape Amazon using Selenium
def scrape_amazon_selenium(query, max_pages=1):
    driver = setup_driver()
    products = []

    # List of electronic-related keywords to identify electronic items
    electronic_keywords = ['laptop', 'mobile', 'phone', 'tablet', 'smartphone', 'headphone', 
                         'earphone', 'speaker', 'camera', 'watch', 'smartwatch', 'tv', 
                         'television', 'monitor', 'printer', 'router', 'mouse', 'keyboard']

    try:
        search_url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
        driver.get(search_url)

        for page in range(1, max_pages + 1):
            try:
                # Wait for products to load with a more reliable selector
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "[data-component-type='s-search-result']"))
                )
                items = driver.find_elements(By.CSS_SELECTOR, "[data-component-type='s-search-result']")

                for item in items:
                    try:
                        # Extract product details with better error handling
                        try:
                            name = item.find_element(By.CSS_SELECTOR, "h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal, h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal").text
                            #print(name)
                        except:
                            print("Name not found")
                            
                        try:
                            price = item.find_element(By.CSS_SELECTOR, "span.a-price-whole").text
                            price = f"₹{price}"
                            #print(price)
                        except:
                            price = ""
                            
                        if price == "":
                            print("Price not found")
                            
                        try:
                            rating = item.find_element(By.CSS_SELECTOR, "i.a-icon.a-icon-star-small span.a-icon-alt").get_attribute("innerHTML").split()[0]
                            #print(rating)
                        except Exception as e:
                            rating = "Not Rated"
                            print("Rating not found ", e)
                            
                        try:
                            thumbnail = item.find_element(By.CSS_SELECTOR, "img.s-image").get_attribute("src")
                            #print(thumbnail)
                        except:
                            thumbnail = None
                            print("Thumbnail not found")

                        try:
                            brand = item.find_element(By.CSS_SELECTOR, "span.a-size-base-plus.a-color-base").text
                            #print(brand)
                        except:
                            brand = "Unknown Brand"
                            print("Brand not found")
                            
                        # Check if the product is an electronic item
                        is_electronic = any(keyword in query.lower() for keyword in electronic_keywords)
                        
                        # Get brand based on product type
                        if is_electronic:
                            brand = name.split()[0]
                        
                        try:
                            ratings = item.find_element(By.CSS_SELECTOR, "span.a-size-base.s-underline-text").text.split()[0]
                        except:
                            ratings = "0"
                            print("Ratings not found")
                        try:
                            link = item.find_element(By.CSS_SELECTOR, "a.a-link-normal.s-line-clamp-2.s-link-style.a-text-normal").get_attribute('href')
                            #print(link)
                        except:
                            link = "Not Available"
                            print('Link not found')

                        products.append({
                            "name": name, 
                            "price": price, 
                            "rating": rating, 
                            "website": 'Amazon', 
                            "brand": brand, 
                            "ratings": ratings,
                            "link": link,
                            "thumbnail": thumbnail
                        })
                        #print(products)
                    except Exception as e:
                        print(f"Error processing product: {str(e)}")
                        continue

                print(f"✅ Scraped Amazon page {page}...")

                # Click "Next" button
                try:
                    next_button = driver.find_element(By.CSS_SELECTOR, "a.s-pagination-next")
                    if next_button.is_enabled():
                        next_button.click()
                        time.sleep(2)
                    else:
                        print("No more pages available.")
                        break
                except:
                    print("No more pages available.")
                    break
            except Exception as e:
                print(f"Error on Amazon page {page}: {e}")
                break

    finally:
        driver.quit()

    return products

# Scrape Flipkart using Selenium
def flipkart_scraper(query, max_pages=1):
    try:
        
        driver = setup_driver()
        products = []
        
        for page in range(1, max_pages + 1):
            try:
                url = f"https://www.flipkart.com/search?q={query}&page={page}"
                print(f"\n🔍 Scraping Flipkart page {page}...")
                driver.get(url)
                
                # Wait for products to load with a more reliable selector
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[data-id]"))
                )
                
                # Get product elements using a more reliable selector
                product_elements = driver.find_elements(By.CSS_SELECTOR, "div[data-id]")
                
                if not product_elements:
                    print("No products found on this page.")
                    break
                
                for element in product_elements:
                    try:
                        # Extract product details with better error handling
                        try:
                            name_element = element.find_element(By.CSS_SELECTOR, "a.wjcEIp, a.WKTcLC, div.KzDlHZ")
                            if name_element.tag_name == "a":
                                name = name_element.get_attribute("title")
                            else:
                                name = name_element.text
                        except:
                            continue
                            
                        try:
                            price = element.find_element(By.CSS_SELECTOR, "div.Nx9bqj._4b5DiR, div.Nx9bqj").text
                        except:
                            price = "Not Available"
                            
                        # Handle rating with better error handling
                        try:
                            rating = element.find_element(By.CSS_SELECTOR, "div.XQDdHH").text
                        except:
                            rating = "Not Rated"
                            
                        # Handle ratings count with better error handling
                        try:
                            ratings_text = element.find_element(By.CSS_SELECTOR, "span.Wphh3N").text
                            # Extract just the number before "Ratings"
                            ratings_count = ratings_text.split('Ratings')[0].strip().replace(',', '')
                        except:
                            ratings_count = "0"
                        
                        try:
                            brand = element.find_element(By.CSS_SELECTOR, "div.syl9yP").text
                        except:
                            brand = name.split()[0] if name else "Unknown Brand"
                            print("Brand not found, using first word of name:", brand)
                        
                        try:
                            link = element.find_element(By.CSS_SELECTOR, "a.WKTcLC.BwBZTg, a.WKTcLC").get_attribute("href")
                            #print(link)
                        except:
                            link = "no link found"
                            #print(link)
                        
                        # Get thumbnail if available
                        try:
                            thumbnail = element.find_element(By.CSS_SELECTOR, "img.DByuf4, img._53J4C-").get_attribute("src")
                        except:
                            thumbnail = ""
                        
                        products.append({
                            "name": name,
                            "price": price,
                            "rating": rating,
                            "ratings": ratings_count,
                            "brand": brand,
                            "website": "Flipkart",
                            "link": link,
                            "thumbnail": thumbnail
                        })
                    except Exception as e:
                        print(f"Error extracting product details: {str(e)}")
                        continue
                
                print(f"✅ Scraped Flipkart page {page}...")
                
            except Exception as e:
                print(f"Error scraping Flipkart page {page}: {str(e)}")
                break
        
        driver.quit()
        return products
        
    except Exception as e:
        print(f"Error in flipkart_scraper: {str(e)}")
        return []

# Extract Flipkart ratings using requests
def flipkart_rating(url):
    driver = setup_driver()
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.C7fEHH"))
                )
        items = driver.find_elements(By.CSS_SELECTOR, "div.C7fEHH")
        
        rating = 'No Rated'
        ratings = 0
        
        for item in items:
            try:
                rating = item.find_element(By.CSS_SELECTOR, "div.XQDdHH").text
                print('Rating: ',rating)
            except Exception as e:
                rating = "Not Rated"
                print("Rating not found ", e)
            try:
                ratings = item.find_element(By.CSS_SELECTOR, "span.Wphh3N span").get_attribute("innerHTML").split()[0]
                print('Ratings: ',ratings)
            except Exception as e:
                ratings = "No ratings"
                print("Ratings not found ", e)
        return {
            "rating": rating, "ratings_count": ratings, "status": "success"
        }
    except Exception as e:
        print('An error occured cause u suck: ',e)
        return {
            "rating": "Not Rated",
            "ratings_count": "0",
            "status": "error",
            "message": str(e)
        }
    finally:
        driver.quit()

# Remove duplicate products based on name and price
def merge_products(products):
    """
    Merge duplicate products from different sources while preserving all variants
    
    Args:
        products: List of product dictionaries with fields:
            - id
            - name
            - brand
            - price_display
            - best_price
            - avg_rating
            - thumbnail
            - available_on
            - variants
    
    Returns:
        List of merged product dictionaries
    """
    merged = {}
    
    for product in products:
        # Create a unique key based on name and brand
        key = (product['name'].lower().strip(), 
               product['brand'].lower().strip())
        
        if key in merged:
            # Existing product found - merge the variants
            existing = merged[key]
            
            # Update price_display to show the best price
            if product['price_display'] != "Not Available" and existing['price_display'] != "Not Available":
                try:
                    current_price = float(product['price_display'].replace('₹', '').replace(',', ''))
                    existing_price = float(existing['price_display'].replace('₹', '').replace(',', ''))
                    
                    if current_price < existing_price:
                        existing['price_display'] = product['price_display']
                        existing['best_price'] = min(existing.get('best_price', float('inf')), current_price)
                except ValueError:
                    pass
            
            # Update best_price if current product has a better price
            if 'best_price' in product and isinstance(product['best_price'], (int, float)):
                existing_best = existing.get('best_price', float('inf'))
                if product['best_price'] < existing_best:
                    existing['best_price'] = product['best_price']
            
            # Keep the higher rating if available
            if product['avg_rating'] != "Not Rated":
                if existing['avg_rating'] == "Not Rated" or float(product['avg_rating']) > float(existing['avg_rating']):
                    existing['avg_rating'] = product['avg_rating']
            
            # Keep the thumbnail if current doesn't have one
            if not existing['thumbnail'] and product['thumbnail']:
                existing['thumbnail'] = product['thumbnail']
            
            # Merge available_on lists
            if isinstance(product.get('available_on'), list):
                existing['available_on'] = list(set(existing.get('available_on', []) + product['available_on']))
            
            # Merge variants while avoiding duplicates
            if isinstance(product.get('variants'), list):
                existing_variants = existing.get('variants', [])
                new_variants = []
                
                # Create a set of existing variant keys (website+price)
                existing_keys = {(v.get('website'), v.get('price_display')) for v in existing_variants}
                
                for variant in product['variants']:
                    variant_key = (variant.get('website'), variant.get('price_display'))
                    if variant_key not in existing_keys:
                        new_variants.append(variant)
                
                existing['variants'].extend(new_variants)
        else:
            # New product, add to dictionary
            merged[key] = product.copy()
            
            # Ensure variants is a list
            if not isinstance(merged[key].get('variants'), list):
                merged[key]['variants'] = []
            
            # Ensure available_on is a list
            if not isinstance(merged[key].get('available_on'), list):
                if 'website' in merged[key]:
                    merged[key]['available_on'] = [merged[key]['website']]
                else:
                    merged[key]['available_on'] = []
    
    # Convert the merged dictionary back to a list
    final_products = list(merged.values())
    
    # Post-processing to ensure consistent fields
    for product in final_products:
        # Set default best_price if not set
        if 'best_price' not in product or not isinstance(product['best_price'], (int, float)):
            try:
                if product['price_display'] != "Not Available":
                    product['best_price'] = float(product['price_display'].replace('₹', '').replace(',', ''))
                else:
                    product['best_price'] = float('inf')
            except:
                product['best_price'] = float('inf')
        
        # Ensure variants have all required fields
        for variant in product.get('variants', []):
            if 'website' not in variant:
                variant['website'] = product.get('website', 'Unknown')
            if 'price_display' not in variant:
                variant['price_display'] = product.get('price_display', 'Not Available')
    
    return final_products

# Save products to CSV
def save_to_csv(products, filename="amazon_flipkart_products.csv"):
    # Prepare the fieldnames for the CSV
    fieldnames = [
        'id', 'name', 'brand', 'price_display', 'best_price', 
        'avg_rating', 'thumbnail', 'available_on', 'variants',
        'last_updated'
    ]

    products = merge_products(products)
    
    # Convert the products to a CSV-friendly format
    rows = []
    for product in products:
        row = {
            'id': product.get('id', ''),
            'name': product.get('name', ''),
            'brand': product.get('brand', ''),
            'price_display': product.get('price_display', ''),
            'best_price': product.get('best_price', ''),
            'avg_rating': product.get('avg_rating', ''),
            'thumbnail': product.get('thumbnail', ''),
            'available_on': '|'.join(product.get('available_on', []) if isinstance(product.get('available_on', []), list) else product.get('available_on', '')),
            'variants': str(product.get('variants', [])),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        rows.append(row)
    
    # Remove duplicates before writing
    rows = remove_duplicates(rows, filename)
    
    # Write to CSV
    with open(filename, mode="a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        if file.tell() == 0:  # Write header only if file is empty
            writer.writeheader()
        writer.writerows(rows)

    print(f"\n✅ Data saved to '{filename}' with {len(rows)} products (after deduplication).")

def remove_duplicates(new_rows, filename):
    """Remove exact duplicates from new rows and existing CSV data"""
    try:
        # Load existing data if file exists
        existing_rows = []
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                existing_rows = list(reader)
        
        # Combine existing and new rows
        all_rows = existing_rows + new_rows
        
        # Create a set of unique row tuples (excluding last_updated)
        seen = set()
        deduplicated = []
        
        for row in all_rows:
            # Create a tuple of all values except last_updated for comparison
            row_key = tuple(str(row[field]) for field in row.keys() 
                          if field != 'last_updated')
            
            if row_key not in seen:
                seen.add(row_key)
                # Keep the most recent version (with updated timestamp)
                deduplicated.append(row)
        
        # Return only the new rows that weren't duplicates
        return [row for row in new_rows 
               if tuple(str(row[field]) for field in row.keys() 
                       if field != 'last_updated') in seen]
    
    except Exception as e:
        print(f"Error during deduplication: {str(e)}")
        return new_rows  # Return original if error occurs

def merge_products_for_display(products):
    # First group products by normalized name and brand
    product_groups = {}
    
    for product in products:
        # Create a normalized key (adjust as needed for your matching requirements)
        normalized_name = product['name'].lower().strip()
        normalized_brand = product['brand'].lower().strip()
        group_key = f"{normalized_name}-{normalized_brand}"
        
        if group_key not in product_groups:
            product_groups[group_key] = {
                'name': product['name'],
                'brand': product['brand'],
                'variants': [],  # Will store all price variants
                'best_price': None,
                'all_prices': [],
                'websites': set(),
                'ratings': [],
                'thumbnails': [],
            }
        
        # Add this product as a variant
        variant = {
            'price': product['price'],
            'website': product['website'],
            'rating': product['rating'],
            'ratings_count': product['ratings'],
            'link': product['link'],
            'thumbnail': product['thumbnail']
        }
        
        product_groups[group_key]['variants'].append(variant)
        
        # Track all prices for this product
        if product['price'] != "Not Available":
            try:
                price_num = float(product['price'].replace('₹', '').replace(',', ''))
                product_groups[group_key]['all_prices'].append(price_num)
                
                # Update best price if this is lower
                if (product_groups[group_key]['best_price'] is None or 
                    price_num < product_groups[group_key]['best_price']):
                    product_groups[group_key]['best_price'] = price_num
            except ValueError:
                pass
        
        # Track all websites
        product_groups[group_key]['websites'].add(product['website'])
        
        # Track ratings if available
        if product['rating'] != "Not Rated":
            try:
                rating = float(product['rating'])
                product_groups[group_key]['ratings'].append(rating)
            except ValueError:
                pass
        
        # Track thumbnails
        if product['thumbnail']:
            product_groups[group_key]['thumbnails'].append(product['thumbnail'])
    
    # Prepare final products array with grouped data
    final_products = []
    
    for group in product_groups.values():
        # Calculate average rating if available
        avg_rating = "Not Rated"
        if group['ratings']:
            avg_rating = round(sum(group['ratings']) / len(group['ratings']), 1)
        
        # Select best thumbnail (first available)
        best_thumbnail = group['thumbnails'][0] if group['thumbnails'] else None
        
        # Format price range if multiple prices
        price_display = f"₹{group['best_price']:,.0f}" if group['best_price'] else "Not Available"
        if len(group['all_prices']) > 1:
            min_price = min(group['all_prices'])
            max_price = max(group['all_prices'])
            if min_price != max_price:
                price_display = f"₹{min_price:,.0f} - ₹{max_price:,.0f}"
        
        # Create the product entry
        final_product = {
            'id': f"{group['name'][:10]}-{group['brand']}".lower().replace(' ', '-'),
            'name': group['name'],
            'brand': group['brand'],
            'price_display': price_display,
            'best_price': group['best_price'],
            'avg_rating': avg_rating,
            'thumbnail': best_thumbnail,
            'available_on': list(group['websites']),
            'variants': group['variants']  # All price variants for this product
        }
        
        final_products.append(final_product)
    
    return final_products

def amazon_ratings(link):
    driver = setup_driver()
    try:
        driver.get(link)
        WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[id='centerCol']"))
                )
        
        rating = "Not Rated"
        ratings_count = "0"
        
        try:
            rating = driver.find_element(By.CSS_SELECTOR, "i.a-icon.a-icon-star span").get_attribute("innerHTML").split()[0]
            #print('Rating: ',rating)
        except Exception as e:
            rating = "Not Rated"
            print("Rating not found ", e)
        try:
            ratings_count = driver.find_element(By.CSS_SELECTOR, "span[id='acrCustomerReviewText']").get_attribute("innerHTML").split()[0]
            #print('Ratings: ',ratings)
        except Exception as e:
            ratings_count = "No ratings"
            print("Ratings not found ", e)
        return {
            "rating": rating,
            "ratings_count": ratings_count,
            "status": "success"
        }
    except Exception as e:
        print('An error occured cause u suck: ',e)
        return {
            "rating": "Not Rated",
            "ratings_count": "0",
            "status": "error",
            "message": str(e)
        }
    finally:
        driver.quit()


# Main Execution
if __name__ == "__main__":
    query = input("Enter product name: ").strip()
    
    print("\n🔍 Scraping Amazon...")
    amz_results = scrape_amazon_selenium(query, max_pages=1)
    
    print("\n🔍 Scraping Flipkart...")
    flp_results = flipkart_scraper(query, max_pages=1)
    #amazon_ratings('ASIAN-MEXICO-11-Synthetic-Lightweight-Comfortable/dp/B0DBD4JYKK/ref=sr_1_5?crid=3RNZO3GI2ZTUG&dib=eyJ2IjoiMSJ9._sn3z8huFoo5AeAM4o6rUVFwD1e9gFswrH1AClVxaaxH8oMN36ozqI_D7LpQ3vLT7NSQM1torOhByhdIsxdHDWH8jr_go-NjzKOyS1rPR5_rPS1pmDrFMhNIcV82vkMLHF-R5jdYO3WOfSNrGCm2uEUm_BN-_7kkxYr86IeILOGblB2xnKzeieJavql8we9oNPjKmYD18lhwLnfh9s0qYn1CnaZPHRB3lcQuC_FjUBGfcMG-FA0xiQvi8Qpa4cRsjWWyQFu_PU649Hs3xGgwR7LaFtTqS-W_ND_RSbXo1vc.uL8ORz9zXxUDFC4h3RdUm8jBpZssGSQDLmbfK2ZMBLY&dib_tag=se&keywords=shoes&qid=1745296993&sprefix=shoe%2Caps%2C193&sr=8-5')
    #flipkart_rating('markway-laptop-backpack-water-resistant-blue-waterproof-school-bag-35-l/p/itm68bbf0d013258?pid=BKPGPPRVJGXJEPFJ&lid=LSTBKPGPPRVJGXJEPFJUBMPWK&marketplace=FLIPKART&q=bags&store=reh%2F4d7&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=d7c606f3-cbca-4aef-ad4f-ea083ba45012.BKPGPPRVJGXJEPFJ.SEARCH&ppt=sp&ppn=sp&ssid=7gou98cl1s0000001745299652155&qH=404e218d27fee49e')
    
    results = amz_results + flp_results
    
    if results:
        # For display purposes
        display_products = merge_products_for_display(results)
        
        # For CSV export (use raw data)
        save_to_csv(display_products, filename=query)  # Pass the raw results instead of display_products
        
        print(f"\nFound {len(results)} raw products")
        print(f"After grouping: {len(display_products)} product groups")
    else:
        print("\n❌ No products found.")