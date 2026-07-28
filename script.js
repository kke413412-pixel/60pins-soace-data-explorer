async function loadMissionData() {
    const message = document.querySelector("#data-message");
    
    try {
        const response = await fetch("data/mission-data.json");
        if (!response.ok) throw new Error("数据文件无法读取");
        
        const data = await response.json();
        
        renderTable(data);
        calculateSummary(data);
        renderChart(data);
        
        
        message.textContent = "✅ 数据加载成功";
        message.style.color = "#2e7d32";
        
    } catch (error) {
        message.textContent = "⚠️ 数据暂时无法载入，请稍后再试。";
        message.style.color = "#b00020";
        console.error("加载失败:", error);
    }
}
function renderTable(data) {
    const tbody = document.querySelector("#data-body");
    tbody.innerHTML = ""; 
    
    data.forEach(item => {
        const tr = document.createElement("tr");
        

        const tdTime = document.createElement("td");
        tdTime.textContent = item.time;
        tr.appendChild(tdTime);
        

        const tdTemp = document.createElement("td");
        tdTemp.textContent = item.temperature + "°C";
        tr.appendChild(tdTemp);
        

        const tdLight = document.createElement("td");
        tdLight.textContent = item.light;
        tr.appendChild(tdLight);
        
        tbody.appendChild(tr);
    });
}


function calculateSummary(data) {
    const temps = data.map(item => item.temperature);
    const lights = data.map(item => item.light);
    
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxLight = Math.max(...lights);
    

    document.querySelector("#card-max-temp").textContent = "最高温度：" + maxTemp + "°C";
    document.querySelector("#card-min-temp").textContent = "最低温度：" + minTemp + "°C";
    document.querySelector("#card-avg-temp").textContent = "平均温度：" + avgTemp.toFixed(1) + "°C";
    document.querySelector("#card-max-light").textContent = "最大光照：" + maxLight;
    
    document.querySelector("#observation").textContent = "💡 观察：10:20 温度最高，之后逐步下降。";
}

loadMissionData();



function renderChart(data) {
    try {
        const ctx = document.getElementById("temperature-chart");
        if (!ctx) {
            console.error("找不到 canvas 元素 #temperature-chart");
            return;
        }
        
        new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map(item => item.time),
                datasets: [{
                    label: "温度 (°C)",
                    data: data.map(item => item.temperature),
                    borderColor: "#ff6b6b",
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: "#ff6b6b",
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "模拟任务温度变化"
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "温度 (°C)"
                        },
                        min: 18,
                        max: 28
                    }
                }
            }
        });
        console.log("图表渲染成功 ✅");
    } catch (error) {
        console.error("图表渲染失败:", error);
    }
}