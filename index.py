
from flask import Flask, jsonify
import requests
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})



# 静态模拟数据存储在 JSON 文件中
PREDICTIONS_FILE = 'index.json'

# 天气数据 API Key
WEATHER_API_KEY = "3faea0de50f758ce728f694709e5d75e"

@app.route("/api/predictions", methods=["GET"])
@cross_origin()
def get_predictions():
    try:
        with open(PREDICTIONS_FILE, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading predictions: {e}")
        return jsonify({"error": "无法加载预测数据"}), 500

@app.route("/api/weather", methods=["GET"])
@cross_origin()
def get_weather():
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q=Chicago&appid={WEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify({
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"]
        })
    except requests.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return jsonify({"error": "无法获取天气数据"}), 500

if __name__ == "__main__":
    app.run(debug=True)

