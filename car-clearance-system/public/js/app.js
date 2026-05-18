/**
 * Car Clearance Management System - Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Currency toggle logic
    const paidInRadios = document.querySelectorAll('input[name="paid_in_currency"]');
    const usdField = document.getElementById('amount_usd');
    const sspField = document.getElementById('amount_ssp');

    if (paidInRadios.length > 0) {
        paidInRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                toggleCurrencyFields(this.value);
            });
        });

        // Initialize on page load
        const checkedRadio = document.querySelector('input[name="paid_in_currency"]:checked');
        if (checkedRadio) {
            toggleCurrencyFields(checkedRadio.value);
        }
    }

    function toggleCurrencyFields(currency) {
        if (currency === 'USD') {
            if (usdField) {
                usdField.disabled = false;
                usdField.required = true;
                usdField.closest('.mb-3').style.opacity = '1';
            }
            if (sspField) {
                sspField.disabled = true;
                sspField.required = false;
                sspField.value = '0';
                sspField.closest('.mb-3').style.opacity = '0.5';
            }
        } else if (currency === 'SSP') {
            if (sspField) {
                sspField.disabled = false;
                sspField.required = true;
                sspField.closest('.mb-3').style.opacity = '1';
            }
            if (usdField) {
                usdField.disabled = true;
                usdField.required = false;
                usdField.value = '0';
                usdField.closest('.mb-3').style.opacity = '0.5';
            }
        }
    }

    // Search functionality for tables
    const searchInput = document.getElementById('tableSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            const filter = this.value.toLowerCase();
            const table = document.getElementById('dataTable');
            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(function (row) {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }

    // Table sorting
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    sortableHeaders.forEach(function (header) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function () {
            const table = this.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const column = this.dataset.sort;
            const colIndex = Array.from(this.parentNode.children).indexOf(this);
            const isAsc = this.classList.contains('sort-asc');

            // Remove sort classes from all headers
            sortableHeaders.forEach(function (h) {
                h.classList.remove('sort-asc', 'sort-desc');
            });

            rows.sort(function (a, b) {
                const aVal = a.children[colIndex]?.textContent.trim() || '';
                const bVal = b.children[colIndex]?.textContent.trim() || '';

                if (column === 'number') {
                    return isAsc
                        ? parseFloat(bVal) - parseFloat(aVal)
                        : parseFloat(aVal) - parseFloat(bVal);
                }
                return isAsc
                    ? bVal.localeCompare(aVal)
                    : aVal.localeCompare(bVal);
            });

            this.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
            rows.forEach(function (row) {
                tbody.appendChild(row);
            });
        });
    });

    // Confirm delete
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.querySelector('.sidebar').classList.toggle('active');
            document.querySelector('.main-content').classList.toggle('active');
        });
    }

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Re-enable disabled fields before form submit (for currency fields)
    const clearanceForm = document.getElementById('clearanceForm');
    if (clearanceForm) {
        clearanceForm.addEventListener('submit', function () {
            if (usdField) usdField.disabled = false;
            if (sspField) sspField.disabled = false;
        });
    }
});

/**
 * Print report function
 */
function printReport() {
    window.print();
}
