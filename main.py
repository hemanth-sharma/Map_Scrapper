from flask import Flask, request, jsonify, send_file
import os
from map_scrapper import ManageDriver

app = Flask(__name__)

os.makedirs("static", exist_ok=True)

@app.route('/')
def home():
    return jsonify({"message": "API is running"})

@app.route('/process', methods=['POST'])
def process_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    query = data.get("query")
    city = data.get("city")
    country = data.get("Country")

    if not query or not city or not country:
        return jsonify({"error": "Missing required fields"}), 400

    # Format search query
    search_query = f"{query} in {city}, {country}"
    url = "https://www.google.co.in/maps"

    try:
        scraper = ManageDriver(url)
        scraper.run(search_query)
        scraper.terminate()

        return jsonify({"message": "Data scraped successfully", "download_url": f"/download"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download', methods=['GET'])
def download_file():
    file_path = "static/scrapped_data.xlsx"
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
