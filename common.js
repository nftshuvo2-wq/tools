// Common JavaScript for MultiTools Website

// Load header and footer dynamically
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initializeSearch();
});

// Load Header
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Reinitialize Bootstrap dropdown if needed
            if (typeof bootstrap !== 'undefined') {
                var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
                var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
                    return new bootstrap.Dropdown(dropdownToggleEl);
                });
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header-placeholder').innerHTML = '<header class="navbar navbar-expand-lg navbar-dark bg-primary"><div class="container"><a class="navbar-brand" href="index.html">🛠️ MultiTools</a></div></header>';
        });
}

// Load Footer
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            document.getElementById('footer-placeholder').innerHTML = '<footer class="bg-dark text-light text-center py-3"><p>&copy; 2024 MultiTools. All rights reserved.</p></footer>';
        });
}

// Initialize Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const headerSearchInput = document.getElementById('headerSearchInput');
    const headerSearchForm = document.getElementById('headerSearchForm');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterTools(e.target.value.toLowerCase());
        });
    }
    
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = headerSearchInput.value.toLowerCase();
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                filterTools(searchTerm);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // Handle search query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
        filterTools(searchParam.toLowerCase());
    }
}

// Filter Tools Function
function filterTools(searchTerm) {
    const toolCards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;
    
    toolCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        const category = card.closest('.category-section')?.id || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
            card.closest('.col-md-4, .col-lg-3, .col-sm-6').style.display = '';
            visibleCount++;
        } else {
            card.closest('.col-md-4, .col-lg-3, .col-sm-6').style.display = 'none';
        }
    });
    
    // Show/hide category sections based on visible tools
    document.querySelectorAll('.category-section').forEach(section => {
        const visibleTools = section.querySelectorAll('.tool-card').length;
        const hiddenTools = Array.from(section.querySelectorAll('.tool-card')).filter(card => {
            return card.closest('.col-md-4, .col-lg-3, .col-sm-6').style.display === 'none';
        }).length;
        
        if (visibleTools === hiddenTools && searchTerm !== '') {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
    
    // Show message if no results
    let noResultsMsg = document.getElementById('no-results-message');
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'alert alert-warning text-center mt-4';
            noResultsMsg.innerHTML = '<h4>No tools found</h4><p>Try searching with different keywords.</p>';
            document.querySelector('.container').appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Utility function to copy text to clipboard
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(function() {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
        buttonElement.classList.add('btn-success');
        buttonElement.classList.remove('btn-primary');
        
        setTimeout(function() {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove('btn-success');
            buttonElement.classList.add('btn-primary');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// Utility function to download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}


