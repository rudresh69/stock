const API_KEY = "G3DCGNmoIMO6KbKdJJ8mYKj0i32rKBvn";

async function fetchStockData(symbol) {
  try {
    const quoteUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`;
    const quoteRes = await fetch(quoteUrl);
    const quoteData = await quoteRes.json();

    if (!quoteData || !quoteData[0]) {
      alert("Invalid symbol or data not available.");
      return;
    }
    const q = quoteData[0];

    const histUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=5&apikey=${API_KEY}`;
    const histRes = await fetch(histUrl);
    const histData = await histRes.json();

    let chartLabels = [];
    let chartData = [];
    if (histData && histData.historical) {
      chartLabels = histData.historical.map((v) => v.date).reverse();
      chartData = histData.historical.map((v) => v.close).reverse();
    } else {
      chartLabels = ["Open", "Low", "High", "Now"];
      chartData = [q.open, q.dayLow, q.dayHigh, q.price];
    }

    const obj = {
      symbol: q.symbol,
      exchange: q.exchange || "N/A",
      price: q.price,
      change: q.change,
      changePct: q.changesPercentage,
      high: q.dayHigh,
      low: q.dayLow,
      open: q.open,
      volume: q.volume || "—",
      pe: q.pe || "—",
      marketCap: q.marketCap || "—",
      series: {
        labels: chartLabels,
        data: chartData,
      },
    };

    fillUI(obj);
  } catch (err) {
    console.error(err);
    alert("Error fetching data.");
  }
}

// Animate cards
window.addEventListener("load", () => {
  document.querySelectorAll(".enter-from-bottom").forEach((el, i) => {
    setTimeout(() => el.classList.add("entered"), 120 * i);
  });
  updateActiveNav();
});

// Sticky nav active link
const sections = [...document.querySelectorAll("main section")];
const navlinks = [...document.querySelectorAll("nav a")];

function updateActiveNav() {
  const mid = window.innerHeight / 2;
  let activeId = sections[0].id;
  for (const sec of sections) {
    const r = sec.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) {
      activeId = sec.id;
      break;
    }
  }
  navlinks.forEach((a) => {
    if (a.getAttribute("href") === `#${activeId}`) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
}
window.addEventListener("scroll", updateActiveNav);
window.addEventListener("resize", updateActiveNav);

// Demo data
let currentSymbol = "";
const demo = {
  symbol: "AAPL",
  exchange: "NASDAQ",
  price: 172.45,
  change: 1.52,
  changePct: 0.88,
  high: 173.5,
  low: 170.8,
  open: 171.0,
  volume: "34.2M",
  pe: 28.4,
  marketCap: "2.8T",
  series: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    data: [168, 170, 171.5, 170.9, 172.45],
  },
};

// Elements
const $ = (s) => document.querySelector(s);
const quickSymbol = $("#quickSymbol"),
  quickPrice = $("#quickPrice"),
  quickChange = $("#quickChange");
const quickExchange = $("#quickExchange"),
  quickTime = $("#quickTime"),
  quickHigh = $("#quickHigh"),
  quickLow = $("#quickLow"),
  quickVol = $("#quickVol"),
  quickPE = $("#quickPE");

const cardPrice = $("#cardPrice"),
  cardPriceChange = $("#cardPriceChange"),
  cardChange = $("#cardChange"),
  cardVolume = $("#cardVolume"),
  cardMarketCap = $("#cardMarketCap");

const sideHigh = $("#sideHigh"),
  sideLow = $("#sideLow"),
  sideOpen = $("#sideOpen"),
  lastUpdated = $("#lastUpdated"),
  chartHeader = $("#chartHeader");

// Chart.js
const ctx = document.getElementById("priceChart").getContext("2d");
let priceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: demo.series.labels,
    datasets: [
      {
        label: "Price",
        data: demo.series.data,
        borderWidth: 2,
        tension: 0.25,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  },
});

function fillUI(obj) {
  currentSymbol = obj.symbol;
  quickSymbol.textContent = obj.symbol;
  quickPrice.textContent = `$${obj.price}`;
  quickChange.textContent = `${obj.change >= 0 ? "▲" : "▼"} ${obj.change} (${obj.changePct}%)`;
  quickExchange.textContent = obj.exchange;
  quickTime.textContent = new Date().toLocaleTimeString();
  quickHigh.textContent = `$${obj.high}`;
  quickLow.textContent = `$${obj.low}`;
  quickVol.textContent = obj
