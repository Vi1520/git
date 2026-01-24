// Основной JavaScript для сайта техникума

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    
    // Активация активной страницы в навигации
    highlightActiveNav();
    
    // Инициализация формы
    initForms();
    
    // Инициализация таблицы базы данных
    if (document.getElementById('studentsTable')) {
        initDatabaseTable();
    }
    
    // Инициализация карты контактов
    if (document.getElementById('contactMap')) {
        initContactMap();
    }
    
    // Плавная прокрутка для всех внутренних ссылок
    initSmoothScroll();
    
    // Инициализация модальных окон
    initModals();
    
    // Обновление года в футере
    updateFooterYear();
});

// Подсветка активной страницы в навигации
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Инициализация форм
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показываем индикатор загрузки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Отправка...';
            submitBtn.disabled = true;
            
            // Симулируем отправку формы
            setTimeout(() => {
                // Показываем успешное сообщение
                showAlert('Данные успешно отправлены!', 'success');
                
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Очищаем форму (кроме поиска)
                if (!this.classList.contains('search-form')) {
                    this.reset();
                }
            }, 1500);
        });
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = this.querySelector('#username').value;
            const password = this.querySelector('#password').value;
            
            // Простая валидация
            if (!username || !password) {
                showAlert('Пожалуйста, заполните все поля', 'danger');
                return;
            }
            
            // Симуляция успешного входа
            showAlert(`Добро пожаловать, ${username}!`, 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

// Инициализация таблицы базы данных студентов
function initDatabaseTable() {
    // Данные студентов
    const students = [
        { id: 1, name: 'Иванов Иван', group: 'ИТ-21', specialty: 'Программирование', gpa: 4.5 },
        { id: 2, name: 'Петрова Анна', group: 'БУ-22', specialty: 'Бухгалтерия', gpa: 4.7 },
        { id: 3, name: 'Сидоров Алексей', group: 'МЕХ-21', specialty: 'Механика', gpa: 4.2 },
        { id: 4, name: 'Кузнецова Мария', group: 'СТР-22', specialty: 'Строительство', gpa: 4.8 },
        { id: 5, name: 'Васильев Дмитрий', group: 'ИТ-23', specialty: 'Информационные системы', gpa: 4.3 },
        { id: 6, name: 'Николаева Елена', group: 'НГ-21', specialty: 'Нефтегазовое дело', gpa: 4.6 },
        { id: 7, name: 'Александров Павел', group: 'МЕХ-22', specialty: 'Механика', gpa: 4.1 },
        { id: 8, name: 'Дмитриева Ольга', group: 'БУ-23', specialty: 'Бухгалтерия', gpa: 4.9 }
    ];
    
    const tableBody = document.querySelector('#studentsTable tbody');
    const searchInput = document.getElementById('studentSearch');
    
    // Функция отрисовки таблицы
    function renderTable(data) {
        tableBody.innerHTML = '';
        
        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.group}</td>
                <td>${student.specialty}</td>
                <td>
                    <span class="badge ${getGPAClass(student.gpa)}">
                        ${student.gpa}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-btn" data-id="${student.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success edit-btn" data-id="${student.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Добавляем обработчики событий для кнопок
        addTableEventListeners();
    }
    
    // Функция для определения класса успеваемости
    function getGPAClass(gpa) {
        if (gpa >= 4.5) return 'bg-success';
        if (gpa >= 4.0) return 'bg-warning';
        return 'bg-danger';
    }
    
    // Поиск студентов
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(searchTerm) ||
                student.group.toLowerCase().includes(searchTerm) ||
                student.specialty.toLowerCase().includes(searchTerm)
            );
            renderTable(filteredStudents);
        });
    }
    
    // Сортировка таблицы
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            const sortedStudents = [...students].sort((a, b) => {
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortBy === 'gpa') {
                    return b.gpa - a.gpa;
                }
                return a.id - b.id;
            });
            renderTable(sortedStudents);
            
            // Подсветка активной кнопки сортировки
            sortButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Обработчики для кнопок действий
    function addTableEventListeners() {
        // Просмотр студента
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const studentId = this.dataset.id;
                const student = students.find(s => s.id == studentId);
                showStudentModal(student);
            });
        });
        
        // Редактирование студента
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const studentId = this.dataset.id;
                const student = students.find(s => s.id == studentId);
                showEditModal(student);
            });
        });
    }
    
    // Модальное окно просмотра студента
    function showStudentModal(student) {
        const modalHTML = `
            <div class="modal fade" id="studentModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Информация о студенте</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-sm-4 fw-bold">ФИО:</div>
                                <div class="col-sm-8">${student.name}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-sm-4 fw-bold">Группа:</div>
                                <div class="col-sm-8">${student.group}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-sm-4 fw-bold">Специальность:</div>
                                <div class="col-sm-8">${student.specialty}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-sm-4 fw-bold">Средний балл:</div>
                                <div class="col-sm-8">
                                    <span class="badge ${getGPAClass(student.gpa)}">
                                        ${student.gpa}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно на страницу
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
        
        // Удаляем модальное окно после закрытия
        document.getElementById('studentModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
    
    // Модальное окно редактирования студента
    function showEditModal(student) {
        const modalHTML = `
            <div class="modal fade" id="editModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование студента</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editForm">
                                <div class="mb-3">
                                    <label class="form-label">ФИО</label>
                                    <input type="text" class="form-control" value="${student.name}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Группа</label>
                                    <input type="text" class="form-control" value="${student.group}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Средний балл</label>
                                    <input type="number" step="0.1" min="0" max="5" class="form-control" value="${student.gpa}" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" form="editForm" class="btn btn-primary">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно на страницу
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
        
        // Обработка формы редактирования
        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('Данные студента успешно обновлены!', 'success');
            modal.hide();
        });
        
        // Удаляем модальное окно после закрытия
        document.getElementById('editModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
    
    // Изначально рендерим таблицу
    renderTable(students);
}

// Инициализация карты контактов
function initContactMap() {
    // Создаем простую карту с помощью SVG или CSS
    const mapContainer = document.getElementById('contactMap');
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <div class="map-marker">
                <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div class="map-address">
                <h6>Наше местоположение</h6>
                <p>г. Ангарск, ул. Ленина, 123</p>
            </div>
        </div>
    `;
    
    // Добавляем стили для карты
    const style = document.createElement('style');
    style.textContent = `
        .map-placeholder {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            overflow: hidden;
        }
        
        .map-marker {
            font-size: 4rem;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .map-address {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
    `;
    document.head.appendChild(style);
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Инициализация модальных окон
function initModals() {
    // Автоматическое скрытие уведомлений через 5 секунд
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Показать уведомление
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (alertDiv.parentElement) {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }
    }, 5000);
}

// Обновление года в футере
function updateFooterYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Обработка отправки контактной формы
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Валидация
            if (!data.name || !data.email || !data.message) {
                showAlert('Пожалуйста, заполните все обязательные поля', 'danger');
                return;
            }
            
            // Симуляция отправки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showAlert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                this.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}
