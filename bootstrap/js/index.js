document.getElementById('moreFiltersBtn').addEventListener('click', function() {
    // Open modal logic for more filters
    var modal = new bootstrap.Modal(document.getElementById('moreFiltersModal'));
    modal.show();
});

document.getElementById('clearFiltersBtn').addEventListener('click', function() {
    // Clear filters logic
    // Reload gallery without any filters
});
