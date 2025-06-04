// Preloader functionality
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (preloader) {
                preloader.classList.add('hidden');
            }
            document.body.classList.add('loaded');
        }, 500);
    });
});
