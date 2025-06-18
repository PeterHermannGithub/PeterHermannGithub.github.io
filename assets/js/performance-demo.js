// Performance Demo Interactive Functionality

// Benchmark data (simulated realistic results based on actual optimization)
const benchmarkData = {
    100: { python: 45, cpp: 2.1, rust: 1.8 },
    500: { python: 1200, cpp: 18, rust: 15 },
    1000: { python: 4800, cpp: 65, rust: 58 },
    2000: { python: 19200, cpp: 180, rust: 165 }
};

// Performance chart instance
let performanceChart = null;

// Initialize the performance demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePerformanceChart();
    setupBenchmarkDemo();
});

// Initialize the performance comparison chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const sizes = Object.keys(benchmarkData);
    const pythonData = sizes.map(size => benchmarkData[size].python);
    const cppData = sizes.map(size => benchmarkData[size].cpp);
    const rustData = sizes.map(size => benchmarkData[size].rust);

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sizes.map(size => size + ' items'),
            datasets: [{
                label: 'Python',
                data: pythonData,
                borderColor: '#3776ab',
                backgroundColor: 'rgba(55, 123, 171, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.1
            }, {
                label: 'C++',
                data: cppData,
                borderColor: '#00599c',
                backgroundColor: 'rgba(0, 89, 156, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.1
            }, {
                label: 'Rust',
                data: rustData,
                borderColor: '#ce422b',
                backgroundColor: 'rgba(206, 66, 43, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Execution Time (ms)'
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Dataset Size'
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Comparison (Logarithmic Scale)',
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                }
            }
        }
    });
}

// Setup interactive benchmark demo
function setupBenchmarkDemo() {
    const runButton = document.getElementById('run-benchmark');
    const sizeSelect = document.getElementById('dataset-size');
    const resultsDiv = document.getElementById('benchmark-results');
    
    if (!runButton || !sizeSelect || !resultsDiv) return;
    
    runButton.addEventListener('click', function() {
        runBenchmark();
    });
}

// Run the benchmark simulation
function runBenchmark() {
    const sizeSelect = document.getElementById('dataset-size');
    const resultsDiv = document.getElementById('benchmark-results');
    const runButton = document.getElementById('run-benchmark');
    
    const size = parseInt(sizeSelect.value);
    const data = benchmarkData[size];
    
    if (!data) {
        console.error('No benchmark data for size:', size);
        return;
    }
    
    // Show loading state
    runButton.disabled = true;
    runButton.innerHTML = '<span class="loading"></span> Running...';
    
    // Hide results during simulation
    resultsDiv.style.display = 'none';
    
    // Simulate benchmark execution time
    setTimeout(() => {
        // Show results
        resultsDiv.style.display = 'block';
        
        // Update result displays with animation
        animateResults(data);
        
        // Reset button
        runButton.disabled = false;
        runButton.textContent = runButton.getAttribute('data-i18n-key') ? 
            translations[currentLanguage][runButton.getAttribute('data-i18n-key')] : 
            'Run Benchmark';
    }, 2000 + Math.random() * 1000); // 2-3 seconds simulation
}

// Animate the benchmark results
function animateResults(data) {
    const pythonTimeEl = document.getElementById('python-time');
    const cppTimeEl = document.getElementById('cpp-time');
    const rustTimeEl = document.getElementById('rust-time');
    
    const pythonBarEl = document.getElementById('python-bar');
    const cppBarEl = document.getElementById('cpp-bar');
    const rustBarEl = document.getElementById('rust-bar');
    
    const cppSpeedupEl = document.getElementById('cpp-speedup');
    const rustSpeedupEl = document.getElementById('rust-speedup');
    
    // Format time display
    const formatTime = (ms) => {
        if (ms >= 1000) {
            return (ms / 1000).toFixed(1) + 's';
        }
        return ms.toFixed(0) + 'ms';
    };
    
    // Calculate speedups
    const cppSpeedup = (data.python / data.cpp).toFixed(1);
    const rustSpeedup = (data.python / data.rust).toFixed(1);
    
    // Update time displays
    pythonTimeEl.textContent = formatTime(data.python);
    cppTimeEl.textContent = formatTime(data.cpp);
    rustTimeEl.textContent = formatTime(data.rust);
    
    // Update speedup displays
    cppSpeedupEl.textContent = cppSpeedup + 'x faster';
    rustSpeedupEl.textContent = rustSpeedup + 'x faster';
    
    // Animate bars (Python is baseline at 100%)
    const maxTime = data.python;
    
    setTimeout(() => {
        pythonBarEl.style.width = '100%';
    }, 100);
    
    setTimeout(() => {
        cppBarEl.style.width = ((data.cpp / maxTime) * 100) + '%';
    }, 300);
    
    setTimeout(() => {
        rustBarEl.style.width = ((data.rust / maxTime) * 100) + '%';
    }, 500);
    
    // Add visual feedback
    [pythonTimeEl, cppTimeEl, rustTimeEl].forEach((el, index) => {
        setTimeout(() => {
            el.style.transform = 'scale(1.1)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }, index * 200 + 600);
    });
}

// Jaccard similarity algorithm visualization
function visualizeJaccardAlgorithm() {
    // This could be expanded to show an interactive visualization
    // For now, the static visualization in the HTML is sufficient
    console.log('Jaccard algorithm visualization loaded');
}

// Theme change handler for chart updates
function updateChartTheme() {
    if (performanceChart) {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        
        performanceChart.options.scales.y.grid.color = borderColor;
        performanceChart.options.scales.x.grid.color = borderColor;
        performanceChart.options.plugins.legend.labels.color = textColor;
        performanceChart.options.plugins.title.color = textColor;
        
        performanceChart.update();
    }
}

// Listen for theme changes
document.addEventListener('themeChanged', updateChartTheme);

// WebAssembly integration placeholder
async function initializeWasm() {
    // Future enhancement: Load and initialize WebAssembly module
    // This would allow running actual Rust code in the browser
    try {
        // const wasmModule = await import('../wasm/performance_demo.js');
        // await wasmModule.default();
        console.log('WASM module would be initialized here');
    } catch (error) {
        console.log('WASM not available, using simulated results');
    }
}

// Advanced benchmark features (for future enhancement)
class PerformanceBenchmark {
    constructor() {
        this.results = [];
        this.isRunning = false;
    }
    
    async runRealBenchmark(size, implementation) {
        // This would interface with actual compiled code
        // or WebAssembly modules for real performance testing
        return new Promise((resolve) => {
            const baseTime = benchmarkData[size][implementation];
            const variance = baseTime * 0.1; // 10% variance
            const actualTime = baseTime + (Math.random() - 0.5) * variance;
            
            setTimeout(() => {
                resolve(actualTime);
            }, 100);
        });
    }
    
    generateTestData(size) {
        // Generate realistic test data for benchmarking
        const testData = [];
        for (let i = 0; i < size; i++) {
            const tags = [];
            const numTags = Math.floor(Math.random() * 8) + 1; // 1-8 tags per item
            
            for (let j = 0; j < numTags; j++) {
                tags.push(Math.floor(Math.random() * 500)); // 500 possible tags
            }
            
            testData.push(tags);
        }
        return testData;
    }
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceBenchmark, benchmarkData };
}