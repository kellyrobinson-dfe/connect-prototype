//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

// Header Navigation and Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navigationToggle = document.getElementById('super-navigation-menu-toggle');
    const searchToggle = document.getElementById('super-search-menu-toggle');
    const navigationMenu = document.getElementById('super-navigation-menu');
    const searchMenu = document.getElementById('super-search-menu');

    // Function to close all menus and reset button states
    function closeAllMenus() {
        // Close navigation
        if (navigationToggle && navigationMenu) {
            navigationToggle.setAttribute('aria-expanded', 'false');
            navigationMenu.setAttribute('hidden', 'hidden');
            navigationToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
        }

        // Close search
        if (searchToggle && searchMenu) {
            searchToggle.setAttribute('aria-expanded', 'false');
            searchMenu.setAttribute('hidden', 'hidden');
            searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
        }
    }

    // Toggle navigation menu
    if (navigationToggle && navigationMenu) {
        navigationToggle.addEventListener('click', function() {
            const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true';
            const isHidden = navigationMenu.hasAttribute('hidden');

            if (isHidden) {
                // Open navigation menu
                navigationToggle.setAttribute('aria-expanded', 'true');
                navigationMenu.removeAttribute('hidden');
                navigationToggle.classList.add('gem-c-layout-super-navigation-header__open-button');

                // Close search if open
                if (searchToggle && searchMenu) {
                    searchToggle.setAttribute('aria-expanded', 'false');
                    searchMenu.setAttribute('hidden', 'hidden');
                    searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
                }
            } else {
                // Close navigation menu
                navigationToggle.setAttribute('aria-expanded', 'false');
                navigationMenu.setAttribute('hidden', 'hidden');
                navigationToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
            }
        });
    }

    // Toggle search panel
    if (searchToggle && searchMenu) {
        searchToggle.addEventListener('click', function() {
            const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
            const isHidden = searchMenu.hasAttribute('hidden');

            if (isHidden) {
                // Open search menu
                searchToggle.setAttribute('aria-expanded', 'true');
                searchMenu.removeAttribute('hidden');
                searchToggle.classList.add('gem-c-layout-super-navigation-header__open-button');

                // Close navigation if open
                if (navigationToggle && navigationMenu) {
                    navigationToggle.setAttribute('aria-expanded', 'false');
                    navigationMenu.setAttribute('hidden', 'hidden');
                    navigationToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
                }
            } else {
                // Close search menu
                searchToggle.setAttribute('aria-expanded', 'false');
                searchMenu.setAttribute('hidden', 'hidden');
                searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
            }
        });
    }

    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = searchForm.querySelector('.gem-c-search__input');
            if (searchInput && searchInput.value.trim()) {
                // Implement your search functionality here
                console.log('Searching for:', searchInput.value.trim());
            }
        });
    }

    // Close panels on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.tab-content');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Show the selected section
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.style.display = 'block';

            // Remove active state from all links
            links.forEach(l => l.removeAttribute('aria-current'));

            // Set active state on clicked link
            this.setAttribute('aria-current', 'page');
        });
    });
});

//FILTERS & PAGINATION
document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.getElementById('apply-filters');
    const clearAllLink = document.querySelector('.clear-all-link');
    const selectedContainer = document.querySelector('.selected-filters-container');
    const checkboxes = document.querySelectorAll('.govuk-checkboxes__input');
    const tabContainers = document.querySelectorAll('.calendar.tab-content');
    const tabLinks = document.querySelectorAll('.tab-link');

    const TASKS_PER_PAGE = 10;

    // ----------------------
    // Setup "No tasks found" and pagination container
    // ----------------------
    tabContainers.forEach(tab => {
        // No tasks message
        let noTasksMessage = document.createElement('p');
        noTasksMessage.innerHTML =
            'There are no tasks available within this category.<br><br>You can clear your filters to show all tasks or make a different selection.';
        noTasksMessage.classList.add('no-tasks-message');
        noTasksMessage.style.display = 'none';
        tab.append(noTasksMessage);

        // Pagination container
        let pagination = document.createElement('nav');
        pagination.classList.add('govuk-pagination');
        pagination.setAttribute('aria-label', 'Pagination');
        pagination.style.display = 'none';
        tab.append(pagination);
    });

    // ----------------------
    // Selected Filters
    // ----------------------
    function updateSelectedFilters() {
        const checkedBoxes = document.querySelectorAll('.govuk-checkboxes__input:checked');

        // Hide container if nothing is selected
        if (checkedBoxes.length === 0) {
            selectedContainer.style.display = 'none';
            selectedContainer.innerHTML = '';
            return;
        }

        // Show container when at least one filter is selected
        selectedContainer.style.display = '';
        selectedContainer.innerHTML = '';

        const filterGroups = {}; // Will hold filters by group

        checkedBoxes.forEach(cb => {
            // Find the closest .govuk-form-group and then the summary text
            const groupDiv = cb.closest('.govuk-form-group');
            const filterName = groupDiv?.querySelector('details summary span')?.textContent.trim() || 'Other';

            if (!filterGroups[filterName]) filterGroups[filterName] = [];

            const label = document.querySelector(`label[for="${cb.id}"]`);
            const labelText = label ? label.textContent.trim() : cb.value;

            filterGroups[filterName].push({
                checkbox: cb,
                labelText
            });
        });

        // Build the DOM structure
        for (const [groupName, filters] of Object.entries(filterGroups)) {
            const groupWrapper = document.createElement('div');
            groupWrapper.classList.add('selected-filter-group');

            const groupHeading = document.createElement('strong');
            groupHeading.textContent = groupName;
            groupWrapper.appendChild(groupHeading);

            const ul = document.createElement('ul');
            ul.classList.add('selected-filters-list');

            filters.forEach(f => {
                const li = document.createElement('li');
                li.classList.add('selected-filter');

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.textContent = `${f.labelText} ×`;
                removeBtn.addEventListener('click', () => {
                    f.checkbox.checked = false;
                    filterTasks();
                    updateSelectedFilters();
                });

                li.appendChild(removeBtn);
                ul.appendChild(li);
            });

            groupWrapper.appendChild(ul);
            selectedContainer.appendChild(groupWrapper);
        }
    }




    // ----------------------
    // Filtering Tasks
    // ----------------------
    function filterTasks() {
        const checkedBoxes = document.querySelectorAll('.govuk-checkboxes__input:checked');
        const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

        tabContainers.forEach(tab => {
            const months = tab.querySelectorAll('.calendar.month');
            let anyVisibleTask = false;

            months.forEach(month => {
                const tasksInMonth = month.querySelectorAll('.govuk-task-list__item');
                let monthHasVisibleTasks = false;

                tasksInMonth.forEach(task => {
                    const match =
                        selectedCategories.length === 0 ||
                        selectedCategories.some(cat => task.classList.contains(cat));
                    task.dataset.matched = match ? 'true' : 'false';
                    if (match) monthHasVisibleTasks = true;
                });

                month.style.display = monthHasVisibleTasks ? '' : 'none';
                if (monthHasVisibleTasks) anyVisibleTask = true;
            });

            const noTasksMessage = tab.querySelector('.no-tasks-message');
            noTasksMessage.style.display = anyVisibleTask ? 'none' : 'block';

            applyPagination(tab, 1); // Reset to page 1 after filtering
        });
    }

    // ----------------------
    // Pagination
    // ----------------------
    function applyPagination(tab, page) {
        const allTasks = Array.from(tab.querySelectorAll('.govuk-task-list__item'));
        const matchedTasks = allTasks.filter(t => t.dataset.matched === 'true');

        const totalPages = Math.ceil(matchedTasks.length / TASKS_PER_PAGE);
        const pagination = tab.querySelector('.govuk-pagination');

        if (matchedTasks.length <= TASKS_PER_PAGE) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = '';
        }

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        const start = (page - 1) * TASKS_PER_PAGE;
        const end = start + TASKS_PER_PAGE;

        allTasks.forEach(t => (t.style.display = 'none'));
        matchedTasks.slice(start, end).forEach(t => (t.style.display = ''));

        // Hide months if no tasks visible
        const months = tab.querySelectorAll('.calendar.month');
        months.forEach(month => {
            const monthTasks = Array.from(month.querySelectorAll('.govuk-task-list__item'));
            const hasVisible = monthTasks.some(t => t.style.display !== 'none');
            month.style.display = hasVisible ? '' : 'none';
        });

        // Build GOV.UK pagination controls
        buildGovPagination(tab, page, totalPages);

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    function buildGovPagination(tab, currentPage, totalPages) {
        const pagination = tab.querySelector('.govuk-pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous
        if (currentPage > 1) {
            const prevDiv = document.createElement('div');
            prevDiv.classList.add('govuk-pagination__prev');

            const prevLink = document.createElement('a');
            prevLink.classList.add('govuk-link', 'govuk-pagination__link');
            prevLink.href = '#';
            prevLink.setAttribute('rel', 'prev');
            prevLink.innerHTML = `
        <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
          <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
        </svg>
        <span class="govuk-pagination__link-title">
          Previous<span class="govuk-visually-hidden"> page</span>
        </span>`;
            prevLink.addEventListener('click', e => {
                e.preventDefault();
                applyPagination(tab, currentPage - 1);
            });
            prevDiv.appendChild(prevLink);
            pagination.appendChild(prevDiv);
        }

        // Page numbers
        const ul = document.createElement('ul');
        ul.classList.add('govuk-pagination__list');
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('govuk-pagination__item');
            if (i === currentPage) li.classList.add('govuk-pagination__item--current');

            const link = document.createElement('a');
            link.classList.add('govuk-link', 'govuk-pagination__link');
            link.href = '#';
            link.textContent = i;
            link.setAttribute('aria-label', `Page ${i}`);
            if (i === currentPage) link.setAttribute('aria-current', 'page');

            link.addEventListener('click', e => {
                e.preventDefault();
                applyPagination(tab, i);
            });

            li.appendChild(link);
            ul.appendChild(li);
        }
        pagination.appendChild(ul);

        // Next
        if (currentPage < totalPages) {
            const nextDiv = document.createElement('div');
            nextDiv.classList.add('govuk-pagination__next');

            const nextLink = document.createElement('a');
            nextLink.classList.add('govuk-link', 'govuk-pagination__link');
            nextLink.href = '#';
            nextLink.setAttribute('rel', 'next');
            nextLink.innerHTML = `
        <span class="govuk-pagination__link-title">
          Next<span class="govuk-visually-hidden"> page</span>
        </span>
        <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
          <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
        </svg>`;
            nextLink.addEventListener('click', e => {
                e.preventDefault();
                applyPagination(tab, currentPage + 1);
            });
            nextDiv.appendChild(nextLink);
            pagination.appendChild(nextDiv);
        }
    }

    // ----------------------
    // Tab Switching Logic (resets pagination to page 1)
    // ----------------------
    tabLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            // Remove active class from all tab links and tab content
            tabLinks.forEach(l => l.removeAttribute('aria-current'));
            tabContainers.forEach(tab => tab.classList.remove('active'));

            // Set clicked link as current
            link.setAttribute('aria-current', 'page');

            // Get target tab
            const targetId = link.getAttribute('href'); // e.g., #upcoming-tasks
            const targetTab = document.querySelector(targetId);

            // Show target tab
            targetTab.classList.add('active');

            // Reset pagination to page 1 for this tab
            applyPagination(targetTab, 1);

            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
        });
    });

    // ----------------------
    // Event Listeners
    // ----------------------
    applyButton.addEventListener('click', () => {
        updateSelectedFilters();
        filterTasks();
    });

    clearAllLink.addEventListener('click', e => {
        e.preventDefault();
        checkboxes.forEach(cb => (cb.checked = false));
        selectedContainer.innerHTML = '';
        filterTasks();
    });

    // ----------------------
    // Initial load
    // ----------------------
    filterTasks();
    updateSelectedFilters();
});