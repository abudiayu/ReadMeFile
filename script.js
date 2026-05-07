/**
 * DevPortfolio — script.js
 * ECharts contribution heatmap + supporting animations
 */

/* ── Hero stars ─────────────────────────────────────────── */
(function spawnStars() {
  const wrap = document.getElementById('heroStars');
  if (!wrap) return;
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      opacity:${Math.random()*.5+.1};
      width:${Math.random()<.2?3:2}px;
      height:${Math.random()<.2?3:2}px;
      animation:starTwinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*4}s infinite;
    `;
    wrap.appendChild(s);
  }
  if (!document.getElementById('starKf')) {
    const st = document.createElement('style');
    st.id = 'starKf';
    st.textContent = `@keyframes starTwinkle{0%,100%{opacity:.1}50%{opacity:.6}}`;
    document.head.appendChild(st);
  }
})();

/* ── Visitor counter ────────────────────────────────────── */
(function animateVisitor() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  const target = 1234;
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = String(current).padStart(6, '0');
    if (current >= target) clearInterval(timer);
  }, 24);
})();

/* ── ECharts Contribution Heatmap ───────────────────────── */
(function buildContribChart() {
  const el = document.getElementById('contribChart');
  if (!el || typeof echarts === 'undefined') return;

  // Generate ~365 days of data ending today
  function generateData() {
    const data = [];
    const end = new Date();
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      // Weighted random: mostly 0, occasional bursts
      const r = Math.random();
      let val = 0;
      if (r > 0.55) val = Math.floor(Math.random() * 4) + 1;
      if (r > 0.80) val = Math.floor(Math.random() * 8) + 4;
      if (r > 0.93) val = Math.floor(Math.random() * 10) + 8;
      data.push([dateStr, val]);
    }
    return data;
  }

  const data = generateData();
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();

  const chart = echarts.init(el, null, { renderer: 'canvas' });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1a1a3e',
      borderColor: 'rgba(124,58,237,.4)',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
      formatter: p => {
        const val = p.data[1];
        return `<b>${p.data[0]}</b><br/>${val} contribution${val !== 1 ? 's' : ''}`;
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 18,
      inRange: {
        color: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
      }
    },
    calendar: {
      top: 20,
      left: 36,
      right: 10,
      bottom: 10,
      range: [startDate, endDate],
      cellSize: ['auto', 13],
      splitLine: { show: false },
      itemStyle: {
        borderWidth: 3,
        borderColor: '#0b0b1a',
        borderRadius: 2,
        color: '#161b22'
      },
      yearLabel: { show: false },
      monthLabel: {
        nameMap: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        color: '#4a5568',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      },
      dayLabel: {
        firstDay: 1,
        nameMap: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        color: '#4a5568',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif'
      }
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(57,211,83,.6)',
          borderColor: '#39d353',
          borderWidth: 1
        }
      }
    }]
  };

  chart.setOption(option);

  // Responsive resize
  window.addEventListener('resize', () => chart.resize());
})();

/* ── Language bar fill on scroll ────────────────────────── */
(function initLangBars() {
  const bars = document.querySelectorAll('.lang-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

/* ── Scroll-reveal ──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.card, .about-stat-card, .gs-panel, .tech-item');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .5s ease ${(i % 8) * 50}ms, transform .5s ease ${(i % 8) * 50}ms`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();
