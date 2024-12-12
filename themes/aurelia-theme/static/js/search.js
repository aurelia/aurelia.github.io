let searchIndex = null;
let searchInput = null;
let searchResults = null;
let searchPanel = null;

// Fetch search index
async function fetchSearchIndex() {
    if (searchIndex) return searchIndex;
    
    const response = await fetch('/index.json');
    searchIndex = await response.json();
    return searchIndex;
}

// Initialize search
async function initSearch() {
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    searchPanel = document.getElementById('search-panel');
    
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 2) {
            searchResults.innerHTML = '<div class="search-empty"><p>Quickly search through articles and guides.</p></div>';
            return;
        }
        
        const index = await fetchSearchIndex();
        const results = searchSite(query, index);
        displayResults(results);
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });

    // Close button
    document.getElementById('search-close').addEventListener('click', (e) => {
        e.preventDefault();
        closeSearch();
    });
}

function searchSite(query, index) {
    const searchTerm = query.toLowerCase();
    console.log('Search term:', searchTerm);
    console.log('Index:', index);
    
    const results = index.pages.filter(page => {
        const titleMatch = page.title.toLowerCase().includes(searchTerm);
        const contentMatch = page.content.toLowerCase().includes(searchTerm);
        const matches = titleMatch || contentMatch;
        console.log('Page:', page.title, 'Matches:', matches);
        return matches;
    }).slice(0, 10); // Limit to 10 results
    
    console.log('Results:', results);
    return results;
}

function displayResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-empty"><p>No results found</p></div>';
        return;
    }

    // Group results by section
    const groupedResults = groupResultsBySection(results);
    
    const html = Object.entries(groupedResults).map(([section, items]) => `
        <div>
            <div>
                <h3>${section}</h3>
                <ul>
                    ${items.map(page => `
                        <li>
                            <a class="aandg" href="${page.permalink}">
                                <h4>${page.title}</h4>
                                ${page.section ? `<span><b>from:</b> <i>${page.section}</i></span>` : ''}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    searchResults.innerHTML = html;
}

function groupResultsBySection(results) {
    const grouped = {};
    
    results.forEach(page => {
        let sectionName = 'Pages';
        if (page.section === 'blog') {
            sectionName = 'Blog Posts';
        }
        
        if (!grouped[sectionName]) {
            grouped[sectionName] = [];
        }
        grouped[sectionName].push({
            ...page,
            section: null // We don't need subsections for now
        });
    });
    
    // Sort sections so Pages comes before Blog Posts
    const ordered = {};
    ['Pages', 'Blog Posts'].forEach(section => {
        if (grouped[section] && grouped[section].length > 0) {
            ordered[section] = grouped[section];
        }
    });
    
    return ordered;
}

function openSearch() {
    searchPanel.style.display = 'block';
    searchInput.focus();
}

function closeSearch() {
    searchPanel.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-empty"><p>Quickly search through articles and guides.</p></div>';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSearch); 