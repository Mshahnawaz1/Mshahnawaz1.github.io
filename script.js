document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Switcher
    initTheme();

    // Initialize MCP Console Tool Runner
    initMcpConsole();

    // Initialize Projects Horizontal Slider
    initProjectSlider();

    // Subtle scroll animations using Intersection Observer
    initScrollAnimations();
});

/* ==========================================================================
   THEME TOGGLER LOGIC
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Retrieve saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateConsoleThemeLog(savedTheme, true);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateConsoleThemeLog(newTheme, false);
    });
}

function updateConsoleThemeLog(theme, isInitial) {
    const consoleLogs = document.getElementById('console-logs');
    if (!consoleLogs) return;

    const actionText = isInitial ? 'Initial state loaded' : 'User state updated';
    const logHTML = `
        <div class="log-row">
            <span class="comment"># [ListenBrainz LocalStorage Sync] ${actionText}</span>
        </div>
        <div class="log-row">
            <span class="prompt">LocalStorage:</span>theme = "${theme}"
        </div>
    `;

    // Append theme logs to the console if loaded after initialization
    if (!isInitial) {
        const logWrapper = document.createElement('div');
        logWrapper.innerHTML = logHTML;
        consoleLogs.appendChild(logWrapper);
        scrollToConsoleBottom();
    }
}

/* ==========================================================================
   MCP INTERACTIVE CONSOLE LOGIC
   ========================================================================== */
const MCP_DATA = {
    get_skills: {
        languages: ["Python (primary)", "Javascript", "SQL"],
        ai_ml_genai: [
            "LangChain", 
            "LangGraph (Agentic Chatbots)", 
            "Model Context Protocol (MCP)", 
            "RAG Pipelines", 
            "LLM Integrations"
        ],
        web_apis: ["FastAPI (async)", "REST APIs", "Flask", "Pydantic"],
        tools_deploy: ["Git & GitHub", "Docker", "PostgreSQL (SQLAlchemy)", "Supabase"]
    },
    get_experience: [
        {
            role: "Software Developer (Contract)",
            organization: "Raza Studioz",
            duration: "Dec 2025 — Feb 2026",
            highlights: [
                "Built a full-stack web app with React, serverless REST API, and Supabase (PostgreSQL) serving 100+ active users.",
                "Engineered an email dispatch system with Resend for real-time admin notifications (sub-2s delivery), while collaborating with the founder to clarify evolving requirements and prioritize features under shifting deadlines."
            ]
        },
        {
            role: "Open Source Contributor",
            organization: "MetaBrainz Foundation (ListenBrainz)",
            duration: "Feb 2025 — May 2025",
            highlights: [
                "Implemented persistent volume storage via LocalStorage across the React codebase, enabling user preference retention across sessions for 1M+ active users on the platform.",
                "Contributed 4+ pull requests reviewed and merged by core maintainers, iterating on implementation across multiple review cycles while adapting to an unfamiliar large-scale codebase."
            ]
        }
    ],
    get_achievements: [
        "Ranked in the top 1% among 33,131 students in IIT Kharagpur (NPTEL) IoT Course.",
        "Harvard/edX: CS50's AI with Python Certificate (2024).",
        "Harvard/edX: CS50x Introduction to Computer Science Certificate (2023)."
    ]
};

function initMcpConsole() {
    const consoleLogs = document.getElementById('console-logs');
    const consoleBtns = document.querySelectorAll('.console-btn');
    if (!consoleLogs) return;

    consoleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active states from other buttons
            consoleBtns.forEach(b => b.classList.remove('active'));
            
            // Set current button active
            btn.classList.add('active');

            const toolName = btn.getAttribute('data-tool');
            runMcpTool(toolName, consoleLogs);
        });
    });
}

function runMcpTool(toolName, container) {
    // Generate fresh line blocks
    const cmdLine = document.createElement('div');
    cmdLine.className = 'log-row';
    cmdLine.innerHTML = `<span class="prompt">$</span><span class="tool-call">call_tool("${toolName}", {})</span>`;
    container.appendChild(cmdLine);

    const loaderLine = document.createElement('div');
    loaderLine.className = 'log-row comment';
    loaderLine.textContent = `[System] Invoking tool '${toolName}' on mcp_server_agent_host...`;
    container.appendChild(loaderLine);
    scrollToConsoleBottom();

    // Simulate network delay
    setTimeout(() => {
        loaderLine.innerHTML = `[System] <span class="tool-ok">Success (200 OK)</span> - output returned:`;
        
        const data = MCP_DATA[toolName];
        const outputLine = document.createElement('div');
        outputLine.className = 'log-row';
        
        // Format JSON output
        const jsonStr = JSON.stringify(data, null, 2);
        outputLine.innerHTML = `<pre class="tool-json"><code>${escapeHTML(jsonStr)}</code></pre>`;
        container.appendChild(outputLine);
        
        scrollToConsoleBottom();
    }, 500);
}

function scrollToConsoleBottom() {
    const consoleBody = document.querySelector('.console-body');
    if (consoleBody) {
        consoleBody.scrollTo({
            top: consoleBody.scrollHeight,
            behavior: 'smooth'
        });
    }
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply scroll animation classes to row structures and blocks
    const animatedElements = document.querySelectorAll(
        '.project-row, .experience-row, .skills-block, .education-block, .certs-block, .hero-flex, .nav-bar'
    );
    animatedElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

// Add reveal CSS helper dynamics through script
const style = document.createElement('style');
style.textContent = `
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

/* ==========================================================================
   PROJECTS HORIZONTAL SLIDER LOGIC
   ========================================================================== */
function initProjectSlider() {
    const slider = document.getElementById('projects-slider-container');
    const prevBtn = document.getElementById('project-prev');
    const nextBtn = document.getElementById('project-next');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -340, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 340, behavior: 'smooth' });
    });
 
    const updateButtons = () => {
        const scrollLeft = slider.scrollLeft;
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        
        prevBtn.style.opacity = scrollLeft <= 10 ? '0.3' : '1';
        prevBtn.style.pointerEvents = scrollLeft <= 10 ? 'none' : 'auto';
        
        nextBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.3' : '1';
        nextBtn.style.pointerEvents = scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    };
    
    slider.addEventListener('scroll', updateButtons);
    // Initial check (give it a small delay for page rendering/font loading)
    setTimeout(updateButtons, 150);
    window.addEventListener('resize', updateButtons);
}
