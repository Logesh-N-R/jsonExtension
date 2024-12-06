document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const arrowIcon = document.querySelector('.collapse-btn .arrow');
    const links = document.querySelectorAll('.sidebar .menu a');
    const iframe = document.getElementById('content-frame');

    document.querySelector('.collapse-btn').addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            arrowIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        } else {
            arrowIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            links.forEach(link => link.classList.remove('active'));
            event.currentTarget.classList.add('active');
            iframe.src = event.currentTarget.getAttribute('href');
            event.preventDefault();  // Prevent default link behavior
        });
    });
});
