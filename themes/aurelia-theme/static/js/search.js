let searchIndex = null;
let searchInput = null;
let searchResults = null;
let searchPanel = null;
let selectedResult = -1;
let searchResultItems = [];

async function fetchSearchIndex() {
    if (searchIndex) return searchIndex;
    
    const response = await fetch('/index.json');
    searchIndex = await response.json();
    return searchIndex;
}

async function initSearch() {
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    searchPanel = document.getElementById('search-panel');
    
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 2) {
            showEmptyState();
            return;
        }
        
        const index = await fetchSearchIndex();
        const results = searchSite(query, index);
        displayResults(results);
    });

    document.addEventListener('keydown', (e) => {
        if (!searchPanel.style.display || searchPanel.style.display === 'none') return;

        switch(e.key) {
            case 'Escape':
                closeSearch();
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateResults(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateResults(-1);
                break;
            case 'Enter':
                if (selectedResult >= 0 && searchResultItems[selectedResult]) {
                    window.location.href = searchResultItems[selectedResult].href;
                }
                break;
        }
    });

    document.getElementById('search-close').addEventListener('click', closeSearch);
    searchPanel.addEventListener('click', (e) => {
        if (e.target === searchPanel) closeSearch();
    });
}

function searchSite(query, index) {
    const searchTerm = query.toLowerCase();
    
    return index.pages
        .filter(page => {
            const titleMatch = page.title.toLowerCase().includes(searchTerm);
            const contentMatch = page.content?.toLowerCase().includes(searchTerm);
            return titleMatch || contentMatch;
        })
        .slice(0, 8);
}

function displayResults(results) {
    if (results.length === 0) {
        showNoResultsState();
        return;
    }

    const groupedResults = groupResultsBySection(results);
    
    const html = Object.entries(groupedResults).map(([section, items]) => `
        <div class="mb-8 last:mb-0">
            <h3 class="text-sm font-medium text-gray-500 mb-4 px-3">${section}</h3>
            <ul class="space-y-2">
                ${items.map(page => `
                    <li>
                        <a href="${page.permalink}" 
                           class="search-result-item block p-4 rounded-xl hover:bg-gradient-to-r hover:from-aurelia/5 hover:to-aurelia-light/5 transition-all duration-200">
                            <div class="flex items-center gap-4">
                                <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-aurelia/5 text-aurelia">
                                    ${section === 'Blog Posts' ? `
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
                                        </svg>
                                    ` : `
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    `}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-base font-semibold text-gray-900 mb-1 truncate">
                                        ${page.title}
                                    </h4>
                                    ${page.content ? `
                                        <p class="text-sm text-gray-600 line-clamp-2">
                                            ${truncateContent(page.content, 180)}
                                        </p>
                                    ` : ''}
                                </div>
                                <div class="flex-shrink-0 ml-4">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    searchResults.innerHTML = html;
    
    selectedResult = -1;
    searchResultItems = Array.from(document.querySelectorAll('.search-result-item'));
}

function showEmptyState() {
    searchResults.innerHTML = `
        <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Start Searching</h3>
            <p class="text-sm text-gray-600">Type to search through articles and guides</p>
        </div>
    `;
}

function showNoResultsState() {
    searchResults.innerHTML = `
        <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p class="text-sm text-gray-600">Try adjusting your search terms</p>
        </div>
    `;
}

function navigateResults(direction) {
    if (!searchResultItems.length) return;

    if (selectedResult >= 0) {
        searchResultItems[selectedResult].classList.remove('bg-gradient-to-r', 'from-aurelia/5', 'to-aurelia-light/5');
        const title = searchResultItems[selectedResult].querySelector('h4');
        const icon = searchResultItems[selectedResult].querySelector('svg');
        title?.classList.remove('text-aurelia');
        icon?.parentElement?.classList.remove('text-aurelia');
    }

    selectedResult += direction;
    if (selectedResult >= searchResultItems.length) selectedResult = 0;
    if (selectedResult < 0) selectedResult = searchResultItems.length - 1;

    const selectedElement = searchResultItems[selectedResult];
    selectedElement.classList.add('bg-gradient-to-r', 'from-aurelia/5', 'to-aurelia-light/5');
    const title = selectedElement.querySelector('h4');
    const icon = selectedElement.querySelector('svg');
    title?.classList.add('text-aurelia');
    icon?.parentElement?.classList.add('text-aurelia');
    selectedElement.scrollIntoView({ block: 'nearest' });
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
        grouped[sectionName].push(page);
    });
    
    return {
        ...(grouped['Pages'] && { 'Pages': grouped['Pages'] }),
        ...(grouped['Blog Posts'] && { 'Blog Posts': grouped['Blog Posts'] })
    };
}

function truncateContent(content, length = 150) {
    return content.length > length 
        ? content.substring(0, length).trim() + '...'
        : content;
}

function openSearch() {
    searchPanel.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
    searchPanel.style.display = 'none';
    document.body.style.overflow = '';
    searchInput.value = '';
    showEmptyState();
}

document.addEventListener('DOMContentLoaded', initSearch);