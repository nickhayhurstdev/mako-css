// -------------------------------------------------------------------
// Mako UI Toolkit
// -------------------------------------------------------------------

const Mako = {
    // -------------------------------------------------------------------
    // Sidebar
    // -------------------------------------------------------------------

    /**
     * Toggle Sidebar
     */
    toggleSidebar: function () {
        // Get Sidebar
        const sidebar = document.getElementById('sidebar');

        // Toggle Hidden State
        if (sidebar) sidebar.classList.toggle('hidden');
    },

    /**
     * Toggle Dropdown
     * @param button
     */
    toggleDropdown: function (button) {
        // Get Drowdown
        const dropdown = button.closest(".dropdown");

        // If No Dropdown, return
        if (!dropdown) return;

        // Toggle Dropdown
        dropdown.classList.toggle("show");

        // Close Other Dropdowns
        document.querySelectorAll(".dropdown").forEach(d => {
            // Remove Show State
            if (d !== dropdown) d.classList.remove("show");
        });
    },

    /**
     * Close All Dropdowns
     */
    closeAllDropdowns() {
        // Get All Dropdowns and Close
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    },

    // -------------------------------------------------------------------
    // Modals
    // -------------------------------------------------------------------
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    bindModalTriggers() {
        document.querySelectorAll("[data-modal-open]").forEach(btn => {
            const targetId = btn.getAttribute("data-modal-open");
            btn.addEventListener("click", () => Mako.openModal(targetId));
        });

        document.querySelectorAll("[data-modal-close]").forEach(btn => {
            const targetId = btn.getAttribute("data-modal-close");
            btn.addEventListener("click", () => Mako.closeModal(targetId));
        });

        // Background click closes modal
        document.querySelectorAll(".modal-container").forEach(modal => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.remove("active");
            });
        });
    },

    showAlert(htmlContent = '', options = {}) {
        const overlay = document.getElementById('alert');
        const content = document.getElementById('alert-content');
        const closeBtn = document.getElementById('alert-close');

        if (!overlay || !content) return;

        // Inject HTML
        content.innerHTML = htmlContent;

        // Optional: outside click closes
        if (options.closeOnOutsideClick) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) Mako.closeAlert();
            });
        }

        overlay.style.display = 'flex';
        closeBtn.onclick = () => Mako.closeAlert();
    },

    closeAlert() {
        const overlay = document.getElementById('alert');
        if (overlay) overlay.style.display = 'none';
    },


    showToast(options = {}) {
        // Get Options
        const {
            message = '',
            type = 'default',
            duration = 3000,
            position = 'top-right',
            header = '',
            icon = '',
            animationIn = 'slideIn',
            animationOut = 'fadeOut'
        } = options;

        const containerClass = `toast-container toast-${position}`;
        let container = document.querySelector(`.${containerClass.replaceAll(' ', '.')}`);

        if (!container) {
            container = document.createElement('div');
            container.className = containerClass;
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} ${animationIn}`;

        toast.innerHTML = `
        <div class="toast-inner">
            <div class="toast-text">
                ${header ? `<div class="toast-header">${header}</div>` : ''}
                <div class="toast-body">${message}</div>
            </div>
            ${icon ? `<div class="toast-icon"><i class="fa-solid fa-2x ${icon}"></i></div>` : ''}
        </div>
    `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove(animationIn);
            toast.classList.add(animationOut);

            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) container.remove();
            }, 600);
        }, duration);
    },

    // -------------------------------------------------------------------
    // Init
    // -------------------------------------------------------------------
    init: function () {
        // Setup Sidebar Toggler
        const toggleBtn = document.getElementById('sidebar-toggler');

        // If Toggle Button
        if (toggleBtn) {
            // Add Event Listener
            toggleBtn.addEventListener('click', Mako.toggleSidebar);
        }

        // Close dropdowns if clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".dropdown")) {
                Mako.closeAllDropdowns();
            }
        });

        // Dropdown toggles
        document.querySelectorAll("[data-dropdown-toggle]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                Mako.toggleDropdown(btn);
            });
        });

        // Modal triggers
        Mako.bindModalTriggers();
    }
};

// -------------------------------------------------------------------
// Auto-init on DOM ready
// -------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", Mako.init);
