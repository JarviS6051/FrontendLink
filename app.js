// Application State Management
class PixisphereApp {
    constructor() {
        this.state = {
            photographers: [],
            filteredPhotographers: [],
            displayedPhotographers: [],
            currentPage: 'category',
            selectedPhotographer: null,
            filters: {
                search: '',
                priceMax: 20000,
                city: '',
                rating: '',
                styles: []
            },
            sort: 'featured',
            loading: false,
            itemsPerPage: 6,
            currentLoadedItems: 6
        };
        
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.showLoading();
    }

    // Data Management
    loadData() {
        // Mock data from the provided JSON
        const mockData = {
            photographers: [
                {
                    id: 1,
                    name: "Ravi Studio",
                    location: "Bengaluru",
                    price: 10000,
                    rating: 4.6,
                    styles: ["Outdoor", "Studio"],
                    tags: ["Candid", "Maternity"],
                    bio: "Award-winning studio specializing in maternity and newborn shoots.",
                    profilePic: "/images/ravi.jpg",
                    portfolio: ["/images/portfolio1.jpg", "/images/portfolio2.jpg"],
                    reviews: [
                        {
                            name: "Ananya",
                            rating: 5,
                            comment: "Truly amazing photos and experience!",
                            date: "2024-12-15"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Lens Queen Photography",
                    location: "Delhi",
                    price: 15000,
                    rating: 4.2,
                    styles: ["Candid", "Indoor"],
                    tags: ["Newborn", "Birthday"],
                    bio: "Delhi-based candid specialist for kids and birthday parties.",
                    profilePic: "/images/lensqueen.jpg",
                    portfolio: ["/images/lens1.jpg", "/images/lens2.jpg"],
                    reviews: [
                        {
                            name: "Priya",
                            rating: 4,
                            comment: "Very professional and punctual!",
                            date: "2024-10-01"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Click Factory",
                    location: "Mumbai",
                    price: 8000,
                    rating: 4.8,
                    styles: ["Studio", "Outdoor", "Traditional"],
                    tags: ["Wedding", "Pre-wedding"],
                    bio: "Capturing timeless wedding stories across India.",
                    profilePic: "/images/clickfactory.jpg",
                    portfolio: ["/images/wed1.jpg", "/images/wed2.jpg"],
                    reviews: [
                        {
                            name: "Rahul",
                            rating: 5,
                            comment: "We loved every single moment they captured.",
                            date: "2025-01-22"
                        }
                    ]
                },
                {
                    id: 4,
                    name: "Moments by Neha",
                    location: "Bengaluru",
                    price: 12000,
                    rating: 4.3,
                    styles: ["Outdoor", "Candid"],
                    tags: ["Maternity", "Couple"],
                    bio: "Natural light specialist focusing on emotional storytelling.",
                    profilePic: "/images/neha.jpg",
                    portfolio: ["/images/neha1.jpg", "/images/neha2.jpg"],
                    reviews: [
                        {
                            name: "Sneha",
                            rating: 4.5,
                            comment: "Captured our maternity journey so beautifully.",
                            date: "2024-11-05"
                        }
                    ]
                },
                {
                    id: 5,
                    name: "Snapshot Studio",
                    location: "Hyderabad",
                    price: 7000,
                    rating: 3.9,
                    styles: ["Studio"],
                    tags: ["Birthday", "Family"],
                    bio: "Affordable indoor shoots with creative themes.",
                    profilePic: "/images/snapshot.jpg",
                    portfolio: ["/images/snapshot1.jpg", "/images/snapshot2.jpg"],
                    reviews: [
                        {
                            name: "Vikram",
                            rating: 3.5,
                            comment: "Decent service, could improve on punctuality.",
                            date: "2024-09-10"
                        }
                    ]
                }
            ]
        };

        // Simulate API loading delay
        setTimeout(() => {
            this.state.photographers = mockData.photographers;
            this.applyFilters();
            this.hideLoading();
        }, 1000);
    }

    // Event Binding
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filter controls
        document.getElementById('priceRange').addEventListener('input', (e) => this.handlePriceChange(e.target.value));
        document.getElementById('cityFilter').addEventListener('change', (e) => this.handleCityChange(e.target.value));
        document.getElementById('sortSelect').addEventListener('change', (e) => this.handleSortChange(e.target.value));
        
        // Rating filters
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleRatingChange(e.target.value));
        });

        // Style filters
        document.querySelectorAll('.style-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleStyleChange());
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => this.clearAllFilters());

        // Load more
        document.getElementById('loadMoreBtn').addEventListener('click', () => this.loadMorePhotographers());

        // Mobile filter toggle
        document.getElementById('mobileFilterToggle').addEventListener('click', () => this.showMobileFilter());
        document.getElementById('closeMobileFilter').addEventListener('click', () => this.hideMobileFilter());

        // Navigation
        document.getElementById('backToListing').addEventListener('click', () => this.showCategoryPage());

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideInquiryModal());
        document.getElementById('cancelInquiry').addEventListener('click', () => this.hideInquiryModal());
        document.getElementById('inquiryForm').addEventListener('submit', (e) => this.handleInquirySubmit(e));

        // Click outside modal to close
        document.getElementById('inquiryModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideInquiryModal();
        });
        document.getElementById('mobileFilterModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideMobileFilter();
        });
    }

    // Search with debouncing
    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.state.filters.search = searchTerm.toLowerCase();
            this.applyFilters();
        }, 300);
    }

    // Filter handlers
    handlePriceChange(value) {
        this.state.filters.priceMax = parseInt(value);
        document.getElementById('priceValue').textContent = parseInt(value).toLocaleString();
        this.applyFilters();
    }

    handleCityChange(city) {
        this.state.filters.city = city;
        this.applyFilters();
    }

    handleRatingChange(rating) {
        this.state.filters.rating = rating;
        this.applyFilters();
    }

    handleStyleChange() {
        const selectedStyles = Array.from(document.querySelectorAll('.style-filter:checked'))
            .map(checkbox => checkbox.value);
        this.state.filters.styles = selectedStyles;
        this.applyFilters();
    }

    handleSortChange(sortBy) {
        this.state.sort = sortBy;
        this.applyFilters();
    }

    clearAllFilters() {
        // Reset all filter values
        this.state.filters = {
            search: '',
            priceMax: 20000,
            city: '',
            rating: '',
            styles: []
        };
        this.state.sort = 'featured';

        // Reset UI elements
        document.getElementById('searchInput').value = '';
        document.getElementById('priceRange').value = 20000;
        document.getElementById('priceValue').textContent = '20,000';
        document.getElementById('cityFilter').value = '';
        document.getElementById('sortSelect').value = 'featured';
        document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="rating"]')[0].checked = true; // Select "All Ratings"
        document.querySelectorAll('.style-filter').forEach(checkbox => checkbox.checked = false);

        this.applyFilters();
    }

    // Filtering and sorting logic
    applyFilters() {
        let filtered = [...this.state.photographers];

        // Apply search filter
        if (this.state.filters.search) {
            filtered = filtered.filter(photographer => {
                const searchTerm = this.state.filters.search;
                return (
                    photographer.name.toLowerCase().includes(searchTerm) ||
                    photographer.location.toLowerCase().includes(searchTerm) ||
                    photographer.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                    photographer.styles.some(style => style.toLowerCase().includes(searchTerm))
                );
            });
        }

        // Apply price filter
        filtered = filtered.filter(photographer => photographer.price <= this.state.filters.priceMax);

        // Apply city filter
        if (this.state.filters.city) {
            filtered = filtered.filter(photographer => photographer.location === this.state.filters.city);
        }

        // Apply rating filter
        if (this.state.filters.rating) {
            const minRating = parseFloat(this.state.filters.rating);
            filtered = filtered.filter(photographer => photographer.rating >= minRating);
        }

        // Apply style filter
        if (this.state.filters.styles.length > 0) {
            filtered = filtered.filter(photographer => 
                this.state.filters.styles.some(style => photographer.styles.includes(style))
            );
        }

        // Apply sorting
        this.sortPhotographers(filtered);

        this.state.filteredPhotographers = filtered;
        this.state.currentLoadedItems = Math.min(this.state.itemsPerPage, filtered.length);
        this.updateDisplay();
    }

    sortPhotographers(photographers) {
        switch (this.state.sort) {
            case 'price-low':
                photographers.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                photographers.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                photographers.sort((a, b) => b.rating - a.rating);
                break;
            case 'recent':
                photographers.sort((a, b) => b.id - a.id);
                break;
            default: // featured
                photographers.sort((a, b) => b.rating - a.rating);
        }
    }

    loadMorePhotographers() {
        const newLoadedItems = Math.min(
            this.state.currentLoadedItems + this.state.itemsPerPage,
            this.state.filteredPhotographers.length
        );
        this.state.currentLoadedItems = newLoadedItems;
        this.updateDisplay();
    }

    // Display updates
    updateDisplay() {
        this.updateResultsCount();
        this.renderPhotographerGrid();
        this.updateLoadMoreButton();
    }

    updateResultsCount() {
        const count = this.state.filteredPhotographers.length;
        document.getElementById('resultsCount').textContent = count;
    }

    renderPhotographerGrid() {
        const grid = document.getElementById('photographerGrid');
        const noResults = document.getElementById('noResults');
        
        if (this.state.filteredPhotographers.length === 0) {
            grid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        
        const photographersToShow = this.state.filteredPhotographers.slice(0, this.state.currentLoadedItems);
        
        grid.innerHTML = photographersToShow.map(photographer => this.createPhotographerCard(photographer)).join('');

        // Bind view profile buttons
        grid.querySelectorAll('.view-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const photographerId = parseInt(e.currentTarget.dataset.photographerId);
                this.showPhotographerProfile(photographerId);
            });
        });
    }

    createPhotographerCard(photographer) {
        const initials = photographer.name.split(' ').map(word => word[0]).join('').toUpperCase();
        const stars = this.renderStars(photographer.rating);
        const tags = photographer.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        return `
            <div class="photographer-card">
                <div class="photographer-profile-pic">${initials}</div>
                <div class="photographer-card-body">
                    <h3 class="photographer-name">${photographer.name}</h3>
                    <div class="photographer-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${photographer.location}</span>
                    </div>
                    <div class="photographer-price">Starting from ₹${photographer.price.toLocaleString()}</div>
                    <div class="rating-stars">
                        <div class="stars">${stars}</div>
                        <span class="rating-number">${photographer.rating}</span>
                    </div>
                    <div class="tags-container">
                        ${tags}
                    </div>
                    <button class="btn btn--primary btn--full-width view-profile-btn" data-photographer-id="${photographer.id}">
                        View Profile
                    </button>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star empty"></i>';
        }

        return stars;
    }

    updateLoadMoreButton() {
        const btn = document.getElementById('loadMoreBtn');
        const hasMore = this.state.currentLoadedItems < this.state.filteredPhotographers.length;
        
        if (hasMore && this.state.filteredPhotographers.length > 0) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }

    // Loading states
    showLoading() {
        const skeleton = document.getElementById('loadingSkeleton');
        const grid = document.getElementById('photographerGrid');
        
        skeleton.innerHTML = Array(6).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text long" style="height: 40px; margin-top: 16px;"></div>
            </div>
        `).join('');
        
        skeleton.classList.remove('hidden');
        grid.classList.add('hidden');
    }

    hideLoading() {
        const skeleton = document.getElementById('loadingSkeleton');
        const grid = document.getElementById('photographerGrid');
        
        skeleton.classList.add('hidden');
        grid.classList.remove('hidden');
    }

    // Page navigation
    showCategoryPage() {
        document.getElementById('categoryPage').classList.add('active');
        document.getElementById('profilePage').classList.remove('active');
        this.state.currentPage = 'category';
    }

    showPhotographerProfile(photographerId) {
        const photographer = this.state.photographers.find(p => p.id === photographerId);
        if (!photographer) return;

        this.state.selectedPhotographer = photographer;
        this.state.currentPage = 'profile';
        
        this.renderPhotographerProfile(photographer);
        
        document.getElementById('categoryPage').classList.remove('active');
        document.getElementById('profilePage').classList.add('active');
        
        window.scrollTo(0, 0);
    }

    renderPhotographerProfile(photographer) {
        const initials = photographer.name.split(' ').map(word => word[0]).join('').toUpperCase();
        const stars = this.renderStars(photographer.rating);
        
        // Create style and tag badges
        const styles = photographer.styles.map(style => 
            `<span class="style-tag">${style}</span>`
        ).join('');
        
        const tags = photographer.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // Create portfolio items with improved placeholders
        const portfolio = Array(6).fill(0).map((_, index) => 
            `<div class="portfolio-item">
                <i class="fas fa-camera-retro text-3xl"></i>
                <div class="text-sm mt-2">Sample ${index + 1}</div>
            </div>`
        ).join('');
        
        // Create reviews or show a message if none exist
        let reviewsContent = '';
        if (photographer.reviews && photographer.reviews.length > 0) {
            reviewsContent = photographer.reviews.map(review => this.renderReview(review)).join('');
        } else {
            reviewsContent = `
                <div class="empty-state">
                    <i class="fas fa-comment-alt"></i>
                    <p>No reviews yet. Be the first to review!</p>
                </div>
            `;
        }

        document.getElementById('profileContent').innerHTML = `
            <div class="profile-header">
                <div class="profile-pic-large">${initials}</div>
                <div class="profile-info">
                    <h1>${photographer.name}</h1>
                    <div class="profile-meta">
                        <div class="profile-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${photographer.location}</span>
                        </div>
                        <div class="profile-meta-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>Starting from ₹${photographer.price.toLocaleString()}</span>
                        </div>
                        <div class="profile-meta-item">
                            <div class="stars">${stars}</div>
                            <span>${photographer.rating} rating</span>
                        </div>
                    </div>
                    <p class="profile-bio">${photographer.bio}</p>
                    <button id="sendInquiryBtn" class="btn btn--primary">
                        <i class="fas fa-envelope mr-2"></i>
                        Send Inquiry
                    </button>
                </div>
            </div>

            <div class="profile-section">
                <h2>Photography Styles & Specializations</h2>
                <div class="styles-tags">
                    ${styles}
                    ${tags}
                </div>
            </div>

            <div class="profile-section">
                <h2>Portfolio</h2>
                <div class="portfolio-grid">
                    ${portfolio}
                </div>
            </div>

            <div class="profile-section">
                <h2>Client Reviews</h2>
                ${reviewsContent}
            </div>
        `;

        // Bind inquiry button
        document.getElementById('sendInquiryBtn').addEventListener('click', () => this.showInquiryModal());
    }

    renderReview(review) {
        const stars = this.renderStars(review.rating);
        
        // Format date properly
        let formattedDate;
        try {
            formattedDate = new Date(review.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            formattedDate = review.date; // Fallback to original format if parsing fails
        }

        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">${review.name}</div>
                    <div class="review-date">${formattedDate}</div>
                </div>
                <div class="review-rating">
                    <div class="stars">${stars}</div>
                </div>
                <p class="review-comment">"${review.comment}"</p>
            </div>
        `;
    }

    // Modal management
    showInquiryModal() {
        document.getElementById('inquiryModal').classList.remove('hidden');
        document.getElementById('inquiryName').focus();
    }

    hideInquiryModal() {
        document.getElementById('inquiryModal').classList.add('hidden');
        document.getElementById('inquiryForm').reset();
    }

    handleInquirySubmit(e) {
        e.preventDefault();
        
        // Simple form validation
        const form = e.target;
        const formData = new FormData(form);
        
        // Simulate API call
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            this.hideInquiryModal();
            this.showSuccessToast();
        }, 1000);
    }

    showSuccessToast() {
        const toast = document.getElementById('successToast');
        toast.classList.remove('hidden');
        toast.classList.add('toast-enter');

        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('toast-exit');
            }, 300);
        }, 3000);
    }

    // Mobile filter management
    showMobileFilter() {
        const modal = document.getElementById('mobileFilterModal');
        const content = document.getElementById('mobileFilterContent');
        const filterPanel = document.getElementById('filterPanel');
        
        // Clone filter content to mobile modal
        content.innerHTML = filterPanel.innerHTML;
        
        // Re-bind events for cloned elements
        this.bindMobileFilterEvents(content);
        
        modal.classList.remove('hidden');
    }

    hideMobileFilter() {
        document.getElementById('mobileFilterModal').classList.add('hidden');
    }

    bindMobileFilterEvents(container) {
        // Re-bind all filter events for mobile
        container.querySelector('#priceRange').addEventListener('input', (e) => this.handlePriceChange(e.target.value));
        container.querySelector('#cityFilter').addEventListener('change', (e) => this.handleCityChange(e.target.value));
        container.querySelector('#sortSelect').addEventListener('change', (e) => this.handleSortChange(e.target.value));
        
        container.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleRatingChange(e.target.value));
        });
        
        container.querySelectorAll('.style-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleStyleChange());
        });
        
        container.querySelector('#clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
            this.hideMobileFilter();
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.pixisphereApp = new PixisphereApp();
});