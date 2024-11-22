

const BACKEND_URL = "http://127.0.0.1:5000";
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchPredictionData();
    initializeMap();
    initializeChart();
  });
  
  // 获取天气数据
  async function fetchWeather() {
    try {
      // 使用模板字符串正确拼接 URL
      const response = await fetch(`${BACKEND_URL}/api/weather`);

      const weatherData = await response.json();
      if (weatherData.error) {
        document.getElementById('weather').textContent = "天气数据加载失败";
      } else {
        document.getElementById('weather').textContent = 
          `${weatherData.temperature}°C - ${weatherData.description}`;
      }
    } catch (error) {
      console.error("天气数据加载失败", error);
    }
  }
  
  // 获取预测数据
  async function fetchPredictionData() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/predictions`);
      const predictions = await response.json();
      if (predictions.error) {
        document.getElementById("data-display").textContent = "预测数据加载失败";
      } else {
        const predictionSection = document.getElementById("data-display");
        predictionSection.innerHTML = predictions.map(prediction => `
          <p>
            <strong>高需求区域：</strong> ${prediction.location}<br>
            <strong>时间：</strong> ${prediction.time}<br>
            <strong>加价倍数：</strong> ${prediction.surge}x
          </p>
        `).join('');
      }
    } catch (error) {
      console.error("预测数据加载失败", error);
    }
  }
  
  // 初始化地图
  function initializeMap() {
    const map = new google.maps.Map(document.getElementById("map-container"), {
      zoom: 12,
      center: { lat: 41.8781, lng: -87.6298 },
    });
  
    const heatmapData = [
      new google.maps.LatLng(41.881832, -87.623177), // 芝加哥市中心
      new google.maps.LatLng(41.9742, -87.9073),    // 机场
      new google.maps.LatLng(41.9102, -87.6769),    // Wicker Park
    ];
  
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      radius: 30,
    });
    heatmap.setMap(map);
  }
  
  // 初始化图表
  function initializeChart() {
    const ctx = document.getElementById('income-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["上午 8:00", "上午 10:00", "下午 2:00", "下午 5:00", "晚上 8:00"],
        datasets: [{
          label: '预测收入 ($)',
          data: [30, 50, 70, 120, 80],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: '时间段' }
          },
          y: {
            title: { display: true, text: '收入 ($)' }
          }
        }
      }
    });
  }
  