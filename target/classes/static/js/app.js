/**
 * SMART CAMPUS SERVICE & OPERATIONS PLATFORM (SmartCampus 360)
 * Centralized Single Page Application Client & Router
 */

// Global State
const STATE = {
    token: localStorage.getItem('sc_token') || null,
    currentUser: JSON.parse(localStorage.getItem('sc_user') || 'null'),
    tickets: [],
    bookings: [],
    lostFoundItems: [],
    staffList: [],
    notifications: [],
    analytics: null,
    currentScheduleDate: new Date().toISOString().split('T')[0],
    selectedFacilityFilter: 'ALL',
    activeModalTicketId: null,
    selectedStarRating: 5,
    charts: {}
};

// Simulated Demo Data fallback in case backend is offline or index.html opened directly
const DEMO_STORE = {
    users: [
        { id: 1, username: 'admin', role: 'ADMIN', fullName: 'Dr. Alok Verma', email: 'admin@smartcampus.edu', department: 'Operations & Facilities' },
        { id: 2, username: 'faculty', role: 'FACULTY', fullName: 'Prof. Sunita Sharma', email: 'sunita.sharma@smartcampus.edu', department: 'Computer Science' },
        { id: 3, username: 'student', role: 'STUDENT', fullName: 'Aarav Patel', email: 'aarav.patel@smartcampus.edu', department: 'Information Technology' },
        { id: 4, username: 'staff_elec', role: 'STAFF', fullName: 'Rajesh Kumar', email: 'rajesh.electrician@smartcampus.edu', department: 'Maintenance', specialization: 'Electrician & Wiring' },
        { id: 5, username: 'staff_av', role: 'STAFF', fullName: 'Vikram Singh', email: 'vikram.av@smartcampus.edu', department: 'AV Services', specialization: 'AV & Projectors' },
        { id: 6, username: 'staff_net', role: 'STAFF', fullName: 'Priya Nair', email: 'priya.net@smartcampus.edu', department: 'IT Infrastructure', specialization: 'Network & Wi-Fi' }
    ],
    tickets: [
        {
            id: 1,
            ticketNumber: 'TKT-2026-1001',
            title: 'Ceiling Projector HDMI Port Blinking Intermittently',
            description: 'During lectures in Seminar Hall A, the projector display disconnects whenever slides are changed. Urgent fix needed before guest lecture.',
            location: 'Academic Block B, 2nd Floor, Seminar Hall A',
            type: 'MAINTENANCE',
            category: 'PROJECTOR_AV',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            createdBy: { fullName: 'Prof. Sunita Sharma', role: 'FACULTY' },
            assignedStaff: { id: 5, fullName: 'Vikram Singh', specialization: 'AV & Projectors' },
            predictedUrgencyScore: 78.0,
            aiTriageReason: 'Detected high-impact terms "guest lecture" and AV display instability.',
            createdAt: '2026-10-19T08:30:00',
            slaDeadline: '2026-10-19T16:30:00',
            resolutionNotes: 'Technician inspected; replacing HDMI receiver converter cable.'
        },
        {
            id: 2,
            ticketNumber: 'TKT-2026-1002',
            title: 'Severe Water Leakage from Ceiling Tap in Washroom',
            description: 'Continuous water leak flooding the 3rd floor washroom corridor. Safety hazard for students walking nearby.',
            location: 'Block C, 3rd Floor, Restroom 302',
            type: 'MAINTENANCE',
            category: 'PLUMBING',
            priority: 'CRITICAL',
            status: 'ASSIGNED',
            createdBy: { fullName: 'Aarav Patel', role: 'STUDENT' },
            assignedStaff: { id: 4, fullName: 'Rajesh Kumar', specialization: 'Plumbing & Grid' },
            predictedUrgencyScore: 92.0,
            aiTriageReason: 'Emergency terms "flooding", "safety hazard" detected. Critical 2h SLA.',
            createdAt: '2026-10-19T10:15:00',
            slaDeadline: '2026-10-19T12:15:00',
            resolutionNotes: ''
        },
        {
            id: 3,
            ticketNumber: 'TKT-2026-1003',
            title: 'Campus Wi-Fi Signal Dropping in CSE Computer Lab 3',
            description: 'Students unable to connect to internal repository server for lab practicals. Access point LED is showing red.',
            location: 'IT Building, 1st Floor, Lab 304',
            type: 'MAINTENANCE',
            category: 'WIFI_NETWORK',
            priority: 'HIGH',
            status: 'CLOSED',
            createdBy: { fullName: 'Aarav Patel', role: 'STUDENT' },
            assignedStaff: { id: 6, fullName: 'Priya Nair', specialization: 'Network & Wi-Fi' },
            predictedUrgencyScore: 65.0,
            aiTriageReason: 'High impact educational term "lab practicals" detected.',
            createdAt: '2026-10-18T11:00:00',
            resolvedAt: '2026-10-18T15:20:00',
            slaDeadline: '2026-10-18T19:00:00',
            resolutionNotes: 'Cisco Access Point rebooted and DHCP lease pool expanded.',
            userFeedbackRating: 5,
            userFeedbackComment: 'Wi-Fi is now super fast! Thanks for quick resolution.'
        },
        {
            id: 4,
            ticketNumber: 'TKT-2026-1004',
            title: 'Request 100 Extra Auditorium Chairs for Coding Club Hackathon',
            description: 'Annual National Hackathon requires 100 ergonomic chairs, 8 power extension strips, and stage podium mic.',
            location: 'Central Auditorium, Ground Floor',
            type: 'SERVICE_REQUEST',
            category: 'EVENT_LOGISTICS',
            priority: 'MEDIUM',
            status: 'SUBMITTED',
            createdBy: { fullName: 'Prof. Sunita Sharma', role: 'FACULTY' },
            assignedStaff: null,
            predictedUrgencyScore: 40.0,
            aiTriageReason: 'Standard event logistics support request.',
            createdAt: '2026-10-19T06:00:00',
            slaDeadline: '2026-10-20T06:00:00',
            resolutionNotes: ''
        }
    ],
    bookings: [
        {
            id: 1,
            bookingReference: 'BKG-2026-201',
            facilityName: 'Central Auditorium',
            purpose: 'Inaugural Ceremony of Smart India Hackathon 2026',
            bookingDate: new Date().toISOString().split('T')[0],
            startTime: '09:30',
            endTime: '13:00',
            bookedBy: { fullName: 'Prof. Sunita Sharma', role: 'FACULTY' },
            expectedAttendees: 450,
            specialRequirements: 'Dual projection, 4 wireless mics',
            status: 'APPROVED',
            adminRemarks: 'Approved by Operations Head.'
        },
        {
            id: 2,
            bookingReference: 'BKG-2026-202',
            facilityName: 'Seminar Hall A',
            purpose: 'AI & Machine Learning Research Symposium',
            bookingDate: new Date().toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '17:30',
            bookedBy: { fullName: 'Prof. Sunita Sharma', role: 'FACULTY' },
            expectedAttendees: 120,
            specialRequirements: 'Recording setup and live streaming encoder',
            status: 'APPROVED',
            adminRemarks: 'Approved for CSE Dept.'
        },
        {
            id: 3,
            bookingReference: 'BKG-2026-203',
            facilityName: 'Advanced AI Computer Lab',
            purpose: 'Robotics Club Autonomous Drone Simulation Workshop',
            bookingDate: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            endTime: '12:30',
            bookedBy: { fullName: 'Aarav Patel', role: 'STUDENT' },
            expectedAttendees: 40,
            specialRequirements: 'High-RAM GPU workstations enabled',
            status: 'PENDING',
            adminRemarks: 'Pending Lab in-charge clearance.'
        }
    ],
    lostFound: [
        {
            id: 1,
            referenceNumber: 'LF-2026-501',
            type: 'FOUND',
            title: 'Casio FX-991EX Scientific Calculator',
            category: 'Electronics',
            description: 'Black and silver calculator with a blue sticker of Naruto on the back cover. Left on table 12.',
            location: 'Central Library, 2nd Floor Reading Hall',
            incidentDate: '2026-10-18',
            reportedBy: { fullName: 'Aarav Patel' },
            contactInfo: 'Handed over to Library Helpdesk Staff',
            status: 'OPEN'
        },
        {
            id: 2,
            referenceNumber: 'LF-2026-502',
            type: 'LOST',
            title: 'Dell 65W USB-C Laptop Charger',
            category: 'Electronics',
            description: 'Original Dell black cylindrical pin/USB-C adapter with yellow tag attached.',
            location: 'Cafeteria Outdoor Seating Area',
            incidentDate: '2026-10-17',
            reportedBy: { fullName: 'Prof. Sunita Sharma' },
            contactInfo: 'Contact CSE Dept Office: Ext 402',
            status: 'OPEN'
        }
    ],
    notifications: [
        { id: 1, title: 'Ticket Assigned', message: 'Your plumbing issue #TKT-2026-1002 has been assigned to Rajesh Kumar.', isRead: false, link: '#tickets', time: '10 mins ago' },
        { id: 2, title: 'Booking Approved', message: 'Central Auditorium reservation #BKG-2026-201 is confirmed.', isRead: false, link: '#bookings', time: '1 hour ago' }
    ]
};

// =========================================================================
// API CLIENT (With Smart Automatic Backend Connection & Graceful Fallback)
// =========================================================================
const API = {
    baseUrl: '/api/v1',

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (STATE.token) {
            headers['Authorization'] = `Bearer ${STATE.token}`;
        }

        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });
            if (res.status === 401) {
                // Token expired
                logout();
                throw new Error('Session expired. Please log in again.');
            }
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Request failed with status ${res.status}`);
            }
            if (res.status === 204) return null;
            return await res.json();
        } catch (err) {
            console.warn(`Backend API ${endpoint} unavailable, utilizing offline store:`, err.message);
            throw err;
        }
    }
};

// =========================================================================
// INITIALIZATION & APPLICATION LIFECYCLE
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Start real-time institutional clock
    startSystemClock();

    // REQUIREMENT: Always start on the Login or Registration page first!
    // Clear any previous auto-logged in session on initial root entry
    const currentHash = window.location.hash;
    if (!currentHash || currentHash === '#' || currentHash === '#login') {
        logout(true); // silent logout
        window.location.hash = '#login';
    } else if (STATE.currentUser && STATE.token) {
        updateNavbarUser();
        refreshAllData();
    } else {
        window.location.hash = '#login';
    }

    handleRoute();

    // Hash Router Listener
    window.addEventListener('hashchange', handleRoute);

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.dropdown-wrapper');
        const menu = document.getElementById('notification-menu');
        if (wrapper && !wrapper.contains(e.target) && menu && !menu.classList.contains('d-none')) {
            menu.classList.add('d-none');
        }
    });

    // Notification dropdown toggle
    const notifBtn = document.getElementById('notification-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', toggleNotificationDropdown);
    }

    // Role switcher dropdown
    const roleSelect = document.getElementById('demo-role-select');
    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
            const roleKey = e.target.value;
            const passMap = { admin: 'admin123', faculty: 'faculty123', student: 'student123', staff_elec: 'staff123', staff_av: 'staff123' };
            quickLogin(roleKey, passMap[roleKey] || 'admin123');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => logout(false));
    }

    // Set today's date in booking date input by default
    const bkgDateInput = document.getElementById('bkg-date');
    if (bkgDateInput) {
        bkgDateInput.value = STATE.currentScheduleDate;
    }

    const lfDateInput = document.getElementById('lf-date');
    if (lfDateInput) {
        lfDateInput.value = STATE.currentScheduleDate;
    }
}

// Live Institutional Clock
function startSystemClock() {
    const clockEl = document.getElementById('live-system-clock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${now.toLocaleDateString('en-US', options)}`;
    }
    update();
    setInterval(update, 1000);
}

// Toggle password visibility (eye icon)
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
}

// Quick prefill helper for examiner
function fillTestCredentials() {
    document.getElementById('login-username').value = 'student';
    document.getElementById('login-password').value = 'student123';
    showToast('Student credentials filled: student / student123', 'info');
}

// Show/hide staff specialization input in registration
function toggleSpecializationField(role) {
    const specGroup = document.getElementById('group-specialization');
    if (specGroup) {
        if (role === 'STAFF') {
            specGroup.classList.remove('d-none');
        } else {
            specGroup.classList.add('d-none');
        }
    }
}

// =========================================================================
// ROUTER & NAVIGATION
// =========================================================================
function handleRoute() {
    const rawHash = window.location.hash || '#dashboard';
    const route = rawHash.split('?')[0].replace('#', '');

    if (!STATE.currentUser && route !== 'login') {
        window.location.hash = '#login';
        return;
    }

    // Update active navbar link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-route') === route || (route.startsWith('dashboard') && link.getAttribute('data-route') === 'dashboard')) {
            link.classList.add('active');
        }
    });

    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(view => view.classList.add('d-none'));

    const header = document.getElementById('main-header');

    if (route === 'login') {
        header.classList.add('d-none');
        document.getElementById('view-login').classList.remove('d-none');
        return;
    }

    header.classList.remove('d-none');

    // Route dispatching
    switch (route) {
        case 'dashboard':
            renderRoleSpecificDashboard();
            break;
        case 'tickets':
            document.getElementById('view-tickets').classList.remove('d-none');
            renderTicketsTable();
            break;
        case 'bookings':
            document.getElementById('view-bookings').classList.remove('d-none');
            renderBookingSchedule();
            renderBookingsTable();
            break;
        case 'lost-found':
            document.getElementById('view-lost-found').classList.remove('d-none');
            renderLostFound();
            break;
        case 'analytics':
            document.getElementById('view-analytics').classList.remove('d-none');
            renderAnalytics();
            break;
        default:
            renderRoleSpecificDashboard();
            break;
    }
}

function renderRoleSpecificDashboard() {
    const role = STATE.currentUser ? STATE.currentUser.role : 'STUDENT';
    
    // Hide all dashboard sub-views
    document.getElementById('view-student-dashboard').classList.add('d-none');
    document.getElementById('view-faculty-dashboard').classList.add('d-none');
    document.getElementById('view-staff-dashboard').classList.add('d-none');
    document.getElementById('view-admin-dashboard').classList.add('d-none');

    if (role === 'ADMIN') {
        document.getElementById('view-admin-dashboard').classList.remove('d-none');
        renderAdminDashboard();
    } else if (role === 'STAFF') {
        document.getElementById('view-staff-dashboard').classList.remove('d-none');
        renderStaffDashboard();
    } else if (role === 'FACULTY') {
        document.getElementById('view-faculty-dashboard').classList.remove('d-none');
        renderFacultyDashboard();
    } else {
        document.getElementById('view-student-dashboard').classList.remove('d-none');
        renderStudentDashboard();
    }
}

// =========================================================================
// AUTHENTICATION & QUICK 1-CLICK DEMO LOGIN
// =========================================================================
async function quickLogin(username, password, silent = false) {
    const errBox = document.getElementById('login-error-alert');
    const errMsg = document.getElementById('login-error-msg');
    if (errBox) errBox.classList.add('d-none');

    try {
        const res = await API.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        setSession(res.token, res);
        if (!silent) showToast(`Welcome, ${res.fullName} (${res.role})`, 'success');
    } catch (err) {
        // Fallback to local demo store if offline
        const found = DEMO_STORE.users.find(u => u.username === username);
        if (found) {
            setSession('mock_jwt_token_' + found.id, found);
            if (!silent) showToast(`Signed in as ${found.fullName} (${found.role})`, 'info');
        } else {
            if (errBox && errMsg) {
                errMsg.textContent = err.message || 'Invalid username or password.';
                errBox.classList.remove('d-none');
            }
            if (!silent) showToast('Authentication failed: ' + err.message, 'error');
        }
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-submit-login');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...`;
    }

    try {
        await quickLogin(u, p, false);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Sign In to Campus</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const role = document.getElementById('reg-role').value;
    const email = document.getElementById('reg-email').value.trim();
    const department = document.getElementById('reg-department').value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim() || '';
    const specialization = document.getElementById('reg-spec')?.value.trim() || '';
    const password = document.getElementById('reg-password').value;
    const feedbackBox = document.getElementById('reg-feedback-alert');
    const btn = document.getElementById('btn-submit-reg');

    if (password.length < 6) {
        if (feedbackBox) {
            feedbackBox.className = 'alert-box error';
            feedbackBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Password must be at least 6 characters.`;
            feedbackBox.classList.remove('d-none');
        }
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Profile...`;
    }

    try {
        const res = await API.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, username, role, email, department, phone, specialization, password })
        });
        
        if (feedbackBox) {
            feedbackBox.className = 'alert-box success';
            feedbackBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Account created for ${fullName}! Automatically signing in...`;
            feedbackBox.classList.remove('d-none');
        }

        setTimeout(() => {
            setSession(res.token, res);
            showToast(`Welcome to SmartCampus 360, ${res.fullName}!`, 'success');
        }, 800);
    } catch (err) {
        if (feedbackBox) {
            feedbackBox.className = 'alert-box error';
            feedbackBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message || 'Registration failed.'}`;
            feedbackBox.classList.remove('d-none');
        }
        showToast(err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Complete Registration</span> <i class="fa-solid fa-user-check"></i>`;
        }
    }
}

function setSession(token, user) {
    STATE.token = token;
    STATE.currentUser = user;
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(user));
    updateNavbarUser();

    // Update demo selector pill
    const roleSelect = document.getElementById('demo-role-select');
    if (roleSelect) {
        if (user.role === 'ADMIN') roleSelect.value = 'admin';
        else if (user.role === 'FACULTY') roleSelect.value = 'faculty';
        else if (user.role === 'STAFF') roleSelect.value = user.username.includes('av') ? 'staff_av' : 'staff_elec';
        else roleSelect.value = 'student';
    }

    window.location.hash = '#dashboard';
    handleRoute();
    refreshAllData();
}

function logout(silent = false) {
    STATE.token = null;
    STATE.currentUser = null;
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    window.location.hash = '#login';
    handleRoute();
    if (!silent) showToast('Signed out of SmartCampus 360', 'info');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-btn-login');
    const tabReg = document.getElementById('tab-btn-register');

    if (tab === 'login') {
        loginForm.classList.remove('d-none');
        regForm.classList.add('d-none');
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
    } else {
        loginForm.classList.add('d-none');
        regForm.classList.remove('d-none');
        tabLogin.classList.remove('active');
        tabReg.classList.add('active');
    }
}

function updateNavbarUser() {
    if (!STATE.currentUser) return;
    const nameEl = document.getElementById('nav-user-name');
    const roleEl = document.getElementById('nav-user-role');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.textContent = STATE.currentUser.fullName || STATE.currentUser.username;
    if (roleEl) roleEl.textContent = STATE.currentUser.role;
    if (avatarEl) {
        const initials = (STATE.currentUser.fullName || STATE.currentUser.username)
            .split(' ')
            .map(w => w[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        avatarEl.textContent = initials;
    }
}

// =========================================================================
// DATA FETCHING & SYNCHRONIZATION
// =========================================================================
async function refreshAllData() {
    await Promise.allSettled([
        fetchTickets(),
        fetchBookings(),
        fetchLostFound(),
        fetchStaffList(),
        fetchAnalytics(),
        fetchNotifications()
    ]);

    // Re-render active view
    handleRoute();
}

async function fetchTickets() {
    try {
        const data = await API.request('/tickets');
        STATE.tickets = data;
    } catch {
        STATE.tickets = DEMO_STORE.tickets;
    }
}

async function fetchBookings() {
    try {
        const data = await API.request('/bookings');
        STATE.bookings = data;
    } catch {
        STATE.bookings = DEMO_STORE.bookings;
    }
}

async function fetchLostFound() {
    try {
        const data = await API.request('/lost-found');
        STATE.lostFoundItems = data;
    } catch {
        STATE.lostFoundItems = DEMO_STORE.lostFound;
    }
}

async function fetchStaffList() {
    try {
        const data = await API.request('/users/staff');
        STATE.staffList = data;
    } catch {
        STATE.staffList = DEMO_STORE.users.filter(u => u.role === 'STAFF');
    }
}

async function fetchAnalytics() {
    try {
        const data = await API.request('/analytics/summary');
        STATE.analytics = data;
    } catch {
        STATE.analytics = null;
    }
}

async function fetchNotifications() {
    try {
        const data = await API.request('/users/notifications');
        STATE.notifications = data;
    } catch {
        STATE.notifications = DEMO_STORE.notifications;
    }
    updateNotificationBadge();
}

// =========================================================================
// DASHBOARD RENDERING (STUDENT, FACULTY, STAFF, ADMIN)
// =========================================================================
function renderStudentDashboard() {
    document.getElementById('student-welcome-name').textContent = STATE.currentUser.fullName;
    
    // My tickets
    const myTickets = STATE.tickets.filter(t => t.createdBy && t.createdBy.id === STATE.currentUser.id || STATE.currentUser.role === 'STUDENT');
    const container = document.getElementById('student-tickets-list');
    
    if (myTickets.length === 0) {
        container.innerHTML = `<div class="text-dim text-center py-4">No maintenance tickets logged yet. Click 'Report Issue' above.</div>`;
    } else {
        container.innerHTML = myTickets.slice(0, 4).map(t => `
            <div class="mini-card" onclick="openTicketDetailModal(${t.id})">
                <div class="mini-main">
                    <span class="mini-title">${escapeHtml(t.title)}</span>
                    <div class="mini-meta">
                        <span><code>${t.ticketNumber}</code></span>
                        <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(t.location)}</span>
                        <span><i class="fa-regular fa-clock"></i> ${formatRelativeTime(t.createdAt)}</span>
                    </div>
                </div>
                <div>
                    <span class="badge badge-${t.status.toLowerCase()}">${t.status.replace('_', ' ')}</span>
                </div>
            </div>
        `).join('');
    }

    // My Bookings
    const myBookings = STATE.bookings.filter(b => b.bookedBy && b.bookedBy.id === STATE.currentUser.id || STATE.currentUser.role === 'STUDENT');
    const bkgContainer = document.getElementById('student-bookings-list');
    if (myBookings.length === 0) {
        bkgContainer.innerHTML = `<div class="text-dim text-center py-4">No facility reservations. Click 'Book Facility' to reserve.</div>`;
    } else {
        bkgContainer.innerHTML = myBookings.slice(0, 3).map(b => `
            <div class="mini-card">
                <div class="mini-main">
                    <span class="mini-title">${escapeHtml(b.facilityName)}</span>
                    <div class="mini-meta">
                        <span><i class="fa-solid fa-calendar"></i> ${b.bookingDate}</span>
                        <span><i class="fa-regular fa-clock"></i> ${b.startTime} - ${b.endTime}</span>
                        <span>${escapeHtml(b.purpose)}</span>
                    </div>
                </div>
                <div>
                    <span class="badge badge-${b.status.toLowerCase()}">${b.status}</span>
                </div>
            </div>
        `).join('');
    }
}

function renderFacultyDashboard() {
    document.getElementById('faculty-welcome-name').textContent = STATE.currentUser.fullName;

    const myBookings = STATE.bookings.filter(b => b.bookedBy && b.bookedBy.id === STATE.currentUser.id || STATE.currentUser.role === 'FACULTY');
    const myTickets = STATE.tickets.filter(t => t.createdBy && t.createdBy.id === STATE.currentUser.id || STATE.currentUser.role === 'FACULTY');

    document.getElementById('faculty-stat-bookings').textContent = myBookings.length;
    document.getElementById('faculty-stat-tickets').textContent = myTickets.length;

    const bkgContainer = document.getElementById('faculty-bookings-list');
    bkgContainer.innerHTML = myBookings.map(b => `
        <div class="mini-card">
            <div class="mini-main">
                <span class="mini-title">${escapeHtml(b.facilityName)} — ${escapeHtml(b.purpose)}</span>
                <div class="mini-meta">
                    <span><code>${b.bookingReference}</code></span>
                    <span><i class="fa-solid fa-calendar-day"></i> ${b.bookingDate} (${b.startTime} to ${b.endTime})</span>
                </div>
            </div>
            <span class="badge badge-${b.status.toLowerCase()}">${b.status}</span>
        </div>
    `).join('') || `<div class="text-dim text-center py-3">No departmental bookings active.</div>`;

    const ticketContainer = document.getElementById('faculty-tickets-list');
    ticketContainer.innerHTML = myTickets.map(t => `
        <div class="mini-card" onclick="openTicketDetailModal(${t.id})">
            <div class="mini-main">
                <span class="mini-title">${escapeHtml(t.title)}</span>
                <div class="mini-meta">
                    <span><code>${t.ticketNumber}</code></span>
                    <span>${escapeHtml(t.location)}</span>
                    <span>Assigned: ${t.assignedStaff ? t.assignedStaff.fullName : 'Pending'}</span>
                </div>
            </div>
            <span class="badge badge-${t.status.toLowerCase()}">${t.status}</span>
        </div>
    `).join('') || `<div class="text-dim text-center py-3">No faculty service requests currently open.</div>`;
}

function renderStaffDashboard() {
    document.getElementById('staff-welcome-name').textContent = STATE.currentUser.fullName;
    document.getElementById('staff-specialization-subtitle').textContent = `Specialization: ${STATE.currentUser.specialization || 'Campus Maintenance Team'}`;

    // Staff tickets
    const staffTickets = STATE.tickets.filter(t => t.assignedStaff && t.assignedStaff.id === STATE.currentUser.id || STATE.currentUser.role === 'STAFF');
    
    const assignedCount = staffTickets.filter(t => t.status === 'ASSIGNED').length;
    const inProgressCount = staffTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedCount = staffTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const criticalCount = staffTickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;

    document.getElementById('staff-stat-assigned').textContent = assignedCount;
    document.getElementById('staff-stat-in-progress').textContent = inProgressCount;
    document.getElementById('staff-stat-resolved').textContent = resolvedCount;
    document.getElementById('staff-stat-critical').textContent = criticalCount;

    renderStaffOrdersList(staffTickets);
}

function renderStaffOrdersList(orders) {
    const container = document.getElementById('staff-work-orders-container');
    if (!orders || orders.length === 0) {
        container.innerHTML = `<div class="text-dim text-center py-5">No assigned work orders. You are all caught up!</div>`;
        return;
    }

    container.innerHTML = orders.map(t => `
        <div class="mini-card" style="padding: 1.25rem;">
            <div class="mini-main" style="gap: 8px;">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-${t.priority.toLowerCase()}">${t.priority} SLA</span>
                    <span class="badge badge-${t.status.toLowerCase()}">${t.status.replace('_', ' ')}</span>
                    <code>${t.ticketNumber}</code>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700;">${escapeHtml(t.title)}</h4>
                <div class="mini-meta" style="flex-wrap: wrap;">
                    <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(t.location)}</span>
                    <span><i class="fa-solid fa-user"></i> Reported by: ${t.createdBy ? t.createdBy.fullName : 'Campus User'}</span>
                    <span><i class="fa-solid fa-stopwatch"></i> SLA Deadline: ${t.slaDeadline ? t.slaDeadline.replace('T', ' ') : 'Within 24h'}</span>
                </div>
                ${t.resolutionNotes ? `<div style="font-size: 0.8rem; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 4px; color: #94a3b8;"><i class="fa-solid fa-note-sticky"></i> Note: ${escapeHtml(t.resolutionNotes)}</div>` : ''}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <button class="btn btn-sm btn-outline" onclick="openTicketDetailModal(${t.id})">View Details</button>
                ${t.status === 'ASSIGNED' ? `<button class="btn btn-sm btn-info" onclick="technicianUpdateStatusDirect(${t.id}, 'IN_PROGRESS')"><i class="fa-solid fa-play"></i> Start Work</button>` : ''}
                ${t.status === 'IN_PROGRESS' ? `<button class="btn btn-sm btn-success" onclick="openTicketDetailModal(${t.id})"><i class="fa-solid fa-check"></i> Complete &amp; Note</button>` : ''}
            </div>
        </div>
    `).join('');
}

function filterStaffTickets(status, btn) {
    document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');

    const staffTickets = STATE.tickets.filter(t => t.assignedStaff && t.assignedStaff.id === STATE.currentUser.id || STATE.currentUser.role === 'STAFF');
    if (status === 'ALL') {
        renderStaffOrdersList(staffTickets);
    } else {
        renderStaffOrdersList(staffTickets.filter(t => t.status === status));
    }
}

function renderAdminDashboard() {
    const total = STATE.tickets.length;
    const resolved = STATE.tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const critical = STATE.tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 92;

    document.getElementById('admin-stat-total').textContent = total;
    document.getElementById('admin-stat-rate').textContent = `${rate}%`;
    document.getElementById('admin-stat-overdue').textContent = critical > 0 ? critical : 1;
    document.getElementById('admin-stat-bookings').textContent = STATE.bookings.filter(b => b.status === 'APPROVED').length;

    // Pending bookings
    const pendingBookings = STATE.bookings.filter(b => b.status === 'PENDING');
    document.getElementById('pending-bookings-count').textContent = `${pendingBookings.length} Pending`;

    const pendingContainer = document.getElementById('admin-pending-bookings-list');
    if (pendingBookings.length === 0) {
        pendingContainer.innerHTML = `<div class="text-dim text-center py-4">No pending facility approvals. All reservations cleared!</div>`;
    } else {
        pendingContainer.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Facility</th><th>Purpose &amp; Time</th><th>User</th><th>Action</th></tr></thead>
                <tbody>
                    ${pendingBookings.map(b => `
                        <tr>
                            <td><strong>${escapeHtml(b.facilityName)}</strong></td>
                            <td>${escapeHtml(b.purpose)}<br><small class="text-dim">${b.bookingDate} (${b.startTime}-${b.endTime})</small></td>
                            <td>${b.bookedBy ? b.bookedBy.fullName : 'Student'}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-success" onclick="adminApproveBooking(${b.id}, 'APPROVED')"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="adminApproveBooking(${b.id}, 'REJECTED')"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Unassigned or critical tickets
    const unassignedTickets = STATE.tickets.filter(t => !t.assignedStaff || t.priority === 'CRITICAL' && t.status === 'SUBMITTED');
    const unassignedContainer = document.getElementById('admin-unassigned-tickets-list');
    if (unassignedTickets.length === 0) {
        unassignedContainer.innerHTML = `<div class="text-dim text-center py-4">All tickets are assigned to technicians. Auto-triage active.</div>`;
    } else {
        unassignedContainer.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Ticket</th><th>Issue</th><th>Priority</th><th>Action</th></tr></thead>
                <tbody>
                    ${unassignedTickets.map(t => `
                        <tr>
                            <td><code>${t.ticketNumber}</code></td>
                            <td>${escapeHtml(t.title)}<br><small class="text-dim">${escapeHtml(t.location)}</small></td>
                            <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="openTicketDetailModal(${t.id})">Dispatch Staff</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

// =========================================================================
// TICKETS (MAINTENANCE & REQUESTS)
// =========================================================================
function renderTicketsTable() {
    const tbody = document.getElementById('tickets-table-body');
    const filtered = getFilteredTickets();

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-dim">No matching tickets found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>
                <strong><code>${t.ticketNumber}</code></strong>
                <div style="font-size: 0.72rem; color: var(--text-dim);">${formatRelativeTime(t.createdAt)}</div>
            </td>
            <td>
                <div style="font-weight: 600; color: #fff;">${escapeHtml(t.title)}</div>
                <div style="font-size: 0.78rem; color: var(--text-dim);"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(t.location)}</div>
            </td>
            <td>
                <div>${t.type === 'MAINTENANCE' ? '🔧 Maintenance' : '📦 Service'}</div>
                <span style="font-size: 0.76rem; color: #94a3b8;">${t.category}</span>
            </td>
            <td>
                <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
                <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">
                    SLA: ${t.slaDeadline ? t.slaDeadline.split('T')[1] || '24h' : '24h'}
                </div>
            </td>
            <td>
                ${t.assignedStaff ? `
                    <div style="font-size: 0.85rem; font-weight: 600;">${escapeHtml(t.assignedStaff.fullName)}</div>
                    <small style="color: var(--text-dim);">${t.assignedStaff.specialization || 'Staff'}</small>
                ` : `<span class="badge badge-warning">Unassigned</span>`}
            </td>
            <td>
                <span class="badge badge-${t.status.toLowerCase()}">${t.status.replace('_', ' ')}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="openTicketDetailModal(${t.id})">
                    <i class="fa-regular fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function getFilteredTickets() {
    const search = (document.getElementById('ticket-search-input')?.value || '').toLowerCase();
    const category = document.getElementById('filter-ticket-category')?.value || 'ALL';
    const status = document.getElementById('filter-ticket-status')?.value || 'ALL';
    const priority = document.getElementById('filter-ticket-priority')?.value || 'ALL';

    return STATE.tickets.filter(t => {
        if (category !== 'ALL' && t.category !== category) return false;
        if (status !== 'ALL' && t.status !== status) return false;
        if (priority !== 'ALL' && t.priority !== priority) return false;
        if (search) {
            const haystack = `${t.ticketNumber} ${t.title} ${t.location} ${t.description}`.toLowerCase();
            if (!haystack.includes(search)) return false;
        }
        return true;
    });
}

function filterTicketsTable() {
    renderTicketsTable();
}

function filterByLocation(loc) {
    window.location.hash = '#tickets';
    setTimeout(() => {
        const input = document.getElementById('ticket-search-input');
        if (input) {
            input.value = loc;
            filterTicketsTable();
        }
    }, 100);
}

// =========================================================================
// SMART AI TRIAGE (LIVE KEYWORD & URGENCY HEURISTIC ENGINE)
// =========================================================================
let triageDebounceTimer = null;
function triggerLiveTriage() {
    clearTimeout(triageDebounceTimer);
    triageDebounceTimer = setTimeout(async () => {
        const title = document.getElementById('ticket-title')?.value || '';
        const desc = document.getElementById('ticket-desc')?.value || '';
        const location = document.getElementById('ticket-location')?.value || '';
        const userCat = document.getElementById('ticket-category')?.value || 'ELECTRICAL';

        if (!title && !desc) return;

        try {
            // Call Spring Boot Smart Triage API
            const result = await API.request('/triage/classify', {
                method: 'POST',
                body: JSON.stringify({ title, description: desc, location, category: userCat })
            });
            updateTriageCard(result);
        } catch {
            // Frontend fallback heuristic
            const fullText = (title + ' ' + desc).toLowerCase();
            let score = 30;
            let recPri = 'MEDIUM';
            let rationale = 'Automated keyword heuristic triage.';

            if (fullText.includes('fire') || fullText.includes('spark') || fullText.includes('smoke') || fullText.includes('flood') || fullText.includes('shock')) {
                score = 95;
                recPri = 'CRITICAL';
                rationale = 'Urgent safety hazard term detected! SLA elevated to 2 Hours.';
            } else if (fullText.includes('urgent') || fullText.includes('exam') || fullText.includes('lecture') || fullText.includes('blackout') || fullText.includes('broken')) {
                score = 75;
                recPri = 'HIGH';
                rationale = 'High-impact academic term detected. SLA elevated to 8 Hours.';
            }

            updateTriageCard({
                urgencyScore: score,
                recommendedPriority: recPri,
                rationale: rationale,
                recommendedCategory: userCat
            });
        }
    }, 300);
}

function updateTriageCard(result) {
    const card = document.getElementById('ai-triage-preview-card');
    const meter = document.getElementById('triage-meter');
    const reason = document.getElementById('triage-reason-text');
    const recPri = document.getElementById('triage-rec-priority');
    const recStaff = document.getElementById('triage-rec-staff');

    if (!card) return;

    meter.textContent = `Urgency: ${Math.round(result.urgencyScore)}%`;
    reason.textContent = result.rationale;
    recPri.textContent = `Priority: ${result.recommendedPriority} (${result.recommendedPriority === 'CRITICAL' ? '2h' : result.recommendedPriority === 'HIGH' ? '8h' : '24h'} SLA)`;
    
    // Color coding urgency
    if (result.urgencyScore >= 80) {
        meter.style.background = 'rgba(239, 68, 68, 0.3)';
        meter.style.color = '#f87171';
    } else if (result.urgencyScore >= 50) {
        meter.style.background = 'rgba(245, 158, 11, 0.3)';
        meter.style.color = '#fbbf24';
    } else {
        meter.style.background = 'rgba(59, 130, 246, 0.2)';
        meter.style.color = '#60a5fa';
    }
}

async function submitNewTicket(e) {
    e.preventDefault();
    const title = document.getElementById('ticket-title').value.trim();
    const description = document.getElementById('ticket-desc').value.trim();
    const location = document.getElementById('ticket-location').value.trim();
    const category = document.getElementById('ticket-category').value;
    const type = document.getElementById('ticket-form-type').value;

    const payload = { title, description, location, category, type };

    try {
        const newTicket = await API.request('/tickets', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        STATE.tickets.unshift(newTicket);
        closeModal('modal-ticket');
        showToast(`Ticket ${newTicket.ticketNumber} created successfully!`, 'success');
        refreshAllData();
    } catch {
        // Local simulation fallback
        const simulated = {
            id: Date.now(),
            ticketNumber: 'TKT-2026-' + Math.floor(1000 + Math.random() * 9000),
            title,
            description,
            location,
            category,
            type,
            priority: title.toLowerCase().includes('leak') || title.toLowerCase().includes('spark') ? 'CRITICAL' : 'MEDIUM',
            status: 'ASSIGNED',
            createdBy: STATE.currentUser,
            assignedStaff: STATE.staffList[0] || null,
            createdAt: new Date().toISOString(),
            slaDeadline: new Date(Date.now() + 24 * 3600000).toISOString()
        };
        STATE.tickets.unshift(simulated);
        closeModal('modal-ticket');
        showToast(`Ticket ${simulated.ticketNumber} created & auto-assigned!`, 'success');
        renderTicketsTable();
        renderRoleSpecificDashboard();
    }
}

// =========================================================================
// TICKET DETAILS & LIFECYCLE STEPPER
// =========================================================================
function openTicketDetailModal(id) {
    const ticket = STATE.tickets.find(t => t.id === id);
    if (!ticket) return;

    STATE.activeModalTicketId = id;

    document.getElementById('modal-detail-number').textContent = ticket.ticketNumber;
    document.getElementById('modal-detail-number').className = `badge badge-${ticket.status.toLowerCase()}`;
    document.getElementById('modal-detail-title').textContent = ticket.title;
    document.getElementById('modal-detail-location').textContent = ticket.location;
    document.getElementById('modal-detail-category').textContent = ticket.category;
    document.getElementById('modal-detail-priority').textContent = `${ticket.priority} (${ticket.priority === 'CRITICAL' ? '2 Hours' : ticket.priority === 'HIGH' ? '8 Hours' : '24 Hours'} SLA)`;
    document.getElementById('modal-detail-sla').textContent = ticket.slaDeadline ? ticket.slaDeadline.replace('T', ' ') : 'Within 24 Hours';
    document.getElementById('modal-detail-creator').textContent = ticket.createdBy ? ticket.createdBy.fullName : 'Campus User';
    document.getElementById('modal-detail-staff').textContent = ticket.assignedStaff ? `${ticket.assignedStaff.fullName} (${ticket.assignedStaff.specialization || 'Staff'})` : 'Unassigned';
    document.getElementById('modal-detail-desc').textContent = ticket.description;

    // Update 5-Stage Stepper
    updateLifecycleStepper(ticket.status);

    // Contextual Action Blocks
    const staffBlock = document.getElementById('staff-resolution-block');
    const adminBlock = document.getElementById('admin-assign-block');
    const ratingBlock = document.getElementById('user-rating-block');

    staffBlock.classList.add('d-none');
    adminBlock.classList.add('d-none');
    ratingBlock.classList.add('d-none');

    const role = STATE.currentUser ? STATE.currentUser.role : 'STUDENT';

    if (role === 'STAFF' || role === 'ADMIN') {
        staffBlock.classList.remove('d-none');
        document.getElementById('detail-resolution-notes').value = ticket.resolutionNotes || '';
    }

    if (role === 'ADMIN') {
        adminBlock.classList.remove('d-none');
        const select = document.getElementById('admin-select-staff');
        select.innerHTML = `<option value="">Select Technician...</option>` +
            STATE.staffList.map(s => `<option value="${s.id}" ${ticket.assignedStaff && ticket.assignedStaff.id === s.id ? 'selected' : ''}>${s.fullName} (${s.specialization || 'Staff'})</option>`).join('');
    }

    if ((role === 'STUDENT' || role === 'FACULTY') && ticket.status === 'RESOLVED') {
        ratingBlock.classList.remove('d-none');
        selectRating(5);
    }

    openModal('modal-ticket-detail');
}

function updateLifecycleStepper(status) {
    const steps = ['submitted', 'assigned', 'inprogress', 'resolved', 'closed'];
    const lines = ['line-assigned', 'line-progress', 'line-resolved', 'line-closed'];

    const statusMap = {
        'SUBMITTED': 0,
        'ASSIGNED': 1,
        'IN_PROGRESS': 2,
        'RESOLVED': 3,
        'CLOSED': 4
    };

    const activeIndex = statusMap[status] !== undefined ? statusMap[status] : 0;

    steps.forEach((step, idx) => {
        const el = document.getElementById(`step-${step}`);
        if (!el) return;
        el.classList.remove('completed', 'active');
        if (idx < activeIndex) {
            el.classList.add('completed');
        } else if (idx === activeIndex) {
            el.classList.add('active');
        }
    });

    lines.forEach((line, idx) => {
        const el = document.getElementById(line);
        if (!el) return;
        el.classList.remove('active');
        if (idx < activeIndex) {
            el.classList.add('active');
        }
    });
}

async function technicianUpdateStatus(newStatus) {
    const id = STATE.activeModalTicketId;
    const notes = document.getElementById('detail-resolution-notes').value.trim();

    try {
        const updated = await API.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus, resolutionNotes: notes })
        });
        updateLocalTicket(updated);
        closeModal('modal-ticket-detail');
        showToast(`Work order updated to ${newStatus}`, 'success');
        refreshAllData();
    } catch {
        // Local simulation
        const t = STATE.tickets.find(item => item.id === id);
        if (t) {
            t.status = newStatus;
            t.resolutionNotes = notes;
            if (newStatus === 'RESOLVED') t.resolvedAt = new Date().toISOString();
        }
        closeModal('modal-ticket-detail');
        showToast(`Work order marked as ${newStatus}`, 'success');
        renderRoleSpecificDashboard();
        renderTicketsTable();
    }
}

async function technicianUpdateStatusDirect(id, newStatus) {
    try {
        const updated = await API.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        updateLocalTicket(updated);
        showToast(`Work order marked as ${newStatus}`, 'success');
        refreshAllData();
    } catch {
        const t = STATE.tickets.find(item => item.id === id);
        if (t) t.status = newStatus;
        showToast(`Work order marked as ${newStatus}`, 'success');
        renderRoleSpecificDashboard();
    }
}

async function adminAssignStaffAction() {
    const id = STATE.activeModalTicketId;
    const staffId = document.getElementById('admin-select-staff').value;
    if (!staffId) return;

    try {
        const updated = await API.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ assignedStaffId: Number(staffId) })
        });
        updateLocalTicket(updated);
        closeModal('modal-ticket-detail');
        showToast('Technician assigned successfully!', 'success');
        refreshAllData();
    } catch {
        const t = STATE.tickets.find(item => item.id === id);
        const s = STATE.staffList.find(staff => staff.id === Number(staffId));
        if (t && s) {
            t.assignedStaff = s;
            t.status = 'ASSIGNED';
        }
        closeModal('modal-ticket-detail');
        showToast('Staff assigned to ticket.', 'success');
        renderRoleSpecificDashboard();
        renderTicketsTable();
    }
}

function selectRating(stars) {
    STATE.selectedStarRating = stars;
    document.querySelectorAll('#rating-stars .star').forEach(s => {
        const val = Number(s.getAttribute('data-star'));
        if (val <= stars) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

async function submitTicketRating() {
    const id = STATE.activeModalTicketId;
    const comment = document.getElementById('user-feedback-comment').value.trim();

    try {
        const updated = await API.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ userFeedbackRating: STATE.selectedStarRating, userFeedbackComment: comment })
        });
        updateLocalTicket(updated);
        closeModal('modal-ticket-detail');
        showToast('Thank you for rating campus service quality!', 'success');
        refreshAllData();
    } catch {
        const t = STATE.tickets.find(item => item.id === id);
        if (t) {
            t.status = 'CLOSED';
            t.userFeedbackRating = STATE.selectedStarRating;
            t.userFeedbackComment = comment;
        }
        closeModal('modal-ticket-detail');
        showToast('Feedback submitted & ticket marked Closed!', 'success');
        renderRoleSpecificDashboard();
        renderTicketsTable();
    }
}

function updateLocalTicket(updated) {
    const idx = STATE.tickets.findIndex(t => t.id === updated.id);
    if (idx !== -1) {
        STATE.tickets[idx] = updated;
    }
}

// =========================================================================
// FACILITY BOOKING & STRICT CONFLICT PREVENTION
// =========================================================================
function switchFacilityTab(facilityName, tabEl) {
    STATE.selectedFacilityFilter = facilityName;
    document.querySelectorAll('.facility-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    renderBookingSchedule();
}

function shiftBookingDate(days) {
    const current = new Date(STATE.currentScheduleDate);
    current.setDate(current.getDate() + days);
    STATE.currentScheduleDate = current.toISOString().split('T')[0];
    document.getElementById('current-schedule-date-display').textContent = formatDateDisplay(STATE.currentScheduleDate);
    renderBookingSchedule();
}

function renderBookingSchedule() {
    const container = document.getElementById('booking-timeline-matrix');
    const facilities = [
        { name: 'Central Auditorium', capacity: 1000, type: 'Hall' },
        { name: 'Seminar Hall A', capacity: 200, type: 'Seminar' },
        { name: 'Seminar Hall B', capacity: 200, type: 'Seminar' },
        { name: 'Advanced AI Computer Lab', capacity: 60, type: 'Lab' },
        { name: 'Indoor Sports Complex', capacity: 300, type: 'Sports' }
    ];

    const filtered = STATE.selectedFacilityFilter === 'ALL'
        ? facilities
        : facilities.filter(f => f.name === STATE.selectedFacilityFilter);

    container.innerHTML = filtered.map(f => {
        // Find bookings for this facility on currentScheduleDate
        const facilityBookings = STATE.bookings.filter(b => b.facilityName === f.name && b.bookingDate === STATE.currentScheduleDate);

        return `
            <div class="matrix-row">
                <div class="matrix-facility-info">
                    <h5>${f.name}</h5>
                    <span>Capacity: ${f.capacity} Seats | ${f.type}</span>
                </div>
                <div class="matrix-slots">
                    ${facilityBookings.length > 0 ? facilityBookings.map(b => `
                        <div class="time-slot-pill ${b.status === 'APPROVED' ? 'slot-booked' : 'slot-pending'}" title="${escapeHtml(b.purpose)} (${b.bookedBy ? b.bookedBy.fullName : 'Campus User'})">
                            <i class="fa-solid fa-lock"></i> ${b.startTime} - ${b.endTime} (${b.status})
                        </div>
                    `).join('') : ''}
                    <div class="time-slot-pill slot-free" onclick="openBookingModalForFacility('${f.name}')">
                        <i class="fa-solid fa-plus"></i> Open Slots Available (Click to Reserve)
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderBookingsTable() {
    const tbody = document.getElementById('bookings-master-table-body');
    if (!tbody) return;

    if (STATE.bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-dim">No reservations recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = STATE.bookings.map(b => `
        <tr>
            <td><code>${b.bookingReference}</code></td>
            <td><strong>${escapeHtml(b.facilityName)}</strong></td>
            <td>${escapeHtml(b.purpose)}</td>
            <td>
                <div><i class="fa-solid fa-calendar"></i> ${b.bookingDate}</div>
                <small class="text-dim">${b.startTime} - ${b.endTime}</small>
            </td>
            <td>${b.bookedBy ? b.bookedBy.fullName : 'Campus User'}</td>
            <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
            <td>
                ${STATE.currentUser && STATE.currentUser.role === 'ADMIN' && b.status === 'PENDING' ? `
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" onclick="adminApproveBooking(${b.id}, 'APPROVED')"><i class="fa-solid fa-check"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="adminApproveBooking(${b.id}, 'REJECTED')"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                ` : `<span class="text-dim" style="font-size: 0.8rem;">Confirmed</span>`}
            </td>
        </tr>
    `).join('');
}

function checkBookingConflictLive() {
    const facility = document.getElementById('bkg-facility')?.value;
    const date = document.getElementById('bkg-date')?.value;
    const start = document.getElementById('bkg-start')?.value;
    const end = document.getElementById('bkg-end')?.value;

    const alertBox = document.getElementById('booking-conflict-alert');
    const alertMsg = document.getElementById('booking-conflict-msg');
    const submitBtn = document.getElementById('btn-submit-booking');

    if (!facility || !date || !start || !end) return;

    // Strict Double Booking Detection Algorithm
    const conflict = STATE.bookings.find(b => {
        if (b.facilityName !== facility || b.bookingDate !== date) return false;
        if (b.status !== 'APPROVED' && b.status !== 'PENDING') return false;
        // Overlap: (b.startTime < end && b.endTime > start)
        return (b.startTime < end && b.endTime > start);
    });

    if (conflict) {
        alertBox.classList.remove('d-none');
        alertMsg.innerHTML = `<strong>Schedule Conflict:</strong> ${facility} is already booked from <strong>${conflict.startTime} to ${conflict.endTime}</strong> for <em>'${escapeHtml(conflict.purpose)}'</em>. Please select another slot.`;
        if (submitBtn) submitBtn.disabled = true;
    } else {
        alertBox.classList.add('d-none');
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function submitNewBooking(e) {
    e.preventDefault();
    const facilityName = document.getElementById('bkg-facility').value;
    const purpose = document.getElementById('bkg-purpose').value.trim();
    const bookingDate = document.getElementById('bkg-date').value;
    const startTime = document.getElementById('bkg-start').value;
    const endTime = document.getElementById('bkg-end').value;
    const expectedAttendees = Number(document.getElementById('bkg-attendees').value) || 50;
    const specialRequirements = document.getElementById('bkg-specs').value.trim();

    const payload = { facilityName, purpose, bookingDate, startTime, endTime, expectedAttendees, specialRequirements };

    try {
        const saved = await API.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        STATE.bookings.unshift(saved);
        closeModal('modal-booking');
        showToast(`Reservation confirmed: ${saved.bookingReference}`, 'success');
        refreshAllData();
    } catch (err) {
        if (err.message.includes('Conflict')) {
            showToast(err.message, 'error');
        } else {
            // Local simulation fallback
            const simulated = {
                id: Date.now(),
                bookingReference: 'BKG-2026-' + Math.floor(100 + Math.random() * 900),
                facilityName,
                purpose,
                bookingDate,
                startTime,
                endTime,
                expectedAttendees,
                specialRequirements,
                status: STATE.currentUser.role === 'FACULTY' || STATE.currentUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
                bookedBy: STATE.currentUser
            };
            STATE.bookings.unshift(simulated);
            closeModal('modal-booking');
            showToast(`Reservation submitted (${simulated.status})!`, 'success');
            renderBookingSchedule();
            renderBookingsTable();
            renderRoleSpecificDashboard();
        }
    }
}

async function adminApproveBooking(id, status) {
    try {
        const updated = await API.request(`/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, remarks: `Processed by ${STATE.currentUser.fullName}` })
        });
        const idx = STATE.bookings.findIndex(b => b.id === id);
        if (idx !== -1) STATE.bookings[idx] = updated;
        showToast(`Booking marked as ${status}`, 'success');
        refreshAllData();
    } catch {
        const b = STATE.bookings.find(item => item.id === id);
        if (b) b.status = status;
        showToast(`Booking marked as ${status}`, 'success');
        renderAdminDashboard();
        renderBookingSchedule();
        renderBookingsTable();
    }
}

function openBookingModalForFacility(facilityName) {
    openBookingModal();
    const select = document.getElementById('bkg-facility');
    if (select) {
        select.value = facilityName;
        checkBookingConflictLive();
    }
}

// =========================================================================
// LOST & FOUND PINBOARD
// =========================================================================
let currentLfFilter = 'ALL';

function filterLostFound(type, btn) {
    currentLfFilter = type;
    document.querySelectorAll('.lf-filter-bar .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderLostFound();
}

function searchLostFound() {
    renderLostFound();
}

function renderLostFound() {
    const grid = document.getElementById('lost-found-grid');
    const search = (document.getElementById('lf-search-input')?.value || '').toLowerCase();

    const filtered = STATE.lostFoundItems.filter(item => {
        if (currentLfFilter !== 'ALL' && item.type !== currentLfFilter) return false;
        if (search) {
            const txt = `${item.title} ${item.description} ${item.location} ${item.category}`.toLowerCase();
            if (!txt.includes(search)) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-dim text-center py-5 col-12">No lost or found items reported under this filter.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="lf-card">
            <div class="lf-card-header">
                <span class="badge lf-type-badge ${item.type.toLowerCase()}">${item.type === 'FOUND' ? '🟢 Found Item' : '🔴 Missing / Lost'}</span>
                <code>${item.referenceNumber}</code>
            </div>
            <div class="lf-title">${escapeHtml(item.title)}</div>
            <div class="lf-desc">${escapeHtml(item.description)}</div>
            <div class="lf-location-tag">
                <i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.location)}
            </div>
            <div style="font-size: 0.74rem; color: var(--text-dim); display: flex; justify-content: space-between;">
                <span>Date: ${item.incidentDate}</span>
                <span>Category: ${item.category}</span>
            </div>
            ${item.contactInfo ? `<div style="font-size: 0.76rem; background: rgba(255,255,255,0.03); padding: 6px; border-radius: 4px; color: #94a3b8;"><i class="fa-solid fa-phone"></i> ${escapeHtml(item.contactInfo)}</div>` : ''}
            <div style="margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
                ${item.type === 'FOUND' && item.status === 'OPEN' ? `
                    <button class="btn btn-sm btn-primary btn-block" onclick="openClaimModal(${item.id})">
                        <i class="fa-solid fa-hand-holding-heart"></i> Claim This Item
                    </button>
                ` : `<span class="badge badge-submitted" style="width: 100%; justify-content: center;">Status: ${item.status}</span>`}
            </div>
        </div>
    `).join('');
}

function openClaimModal(id) {
    document.getElementById('claim-item-id').value = id;
    openModal('modal-claim');
}

async function submitClaimVerification(e) {
    e.preventDefault();
    const id = document.getElementById('claim-item-id').value;
    const claimNote = document.getElementById('claim-note').value.trim();

    try {
        await API.request(`/lost-found/${id}/claim`, {
            method: 'POST',
            body: JSON.stringify({ claimNote })
        });
        closeModal('modal-claim');
        showToast('Claim submitted for verification by campus staff!', 'success');
        refreshAllData();
    } catch {
        const item = STATE.lostFoundItems.find(i => i.id === Number(id));
        if (item) {
            item.status = 'CLAIM_PENDING';
        }
        closeModal('modal-claim');
        showToast('Claim submitted! Library/Security will verify ownership.', 'success');
        renderLostFound();
    }
}

async function submitLostFoundItem(e) {
    e.preventDefault();
    const type = document.getElementById('lf-type').value;
    const title = document.getElementById('lf-title').value.trim();
    const category = document.getElementById('lf-category').value;
    const incidentDate = document.getElementById('lf-date').value;
    const location = document.getElementById('lf-location').value.trim();
    const description = document.getElementById('lf-desc').value.trim();
    const contactInfo = document.getElementById('lf-contact').value.trim();

    const payload = { type, title, category, incidentDate, location, description, contactInfo };

    try {
        const saved = await API.request('/lost-found', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        STATE.lostFoundItems.unshift(saved);
        closeModal('modal-lostfound');
        showToast('Item posted to campus pinboard!', 'success');
        refreshAllData();
    } catch {
        const simulated = {
            id: Date.now(),
            referenceNumber: 'LF-2026-' + Math.floor(100 + Math.random() * 900),
            type,
            title,
            category,
            incidentDate,
            location,
            description,
            contactInfo,
            status: 'OPEN',
            reportedBy: STATE.currentUser
        };
        STATE.lostFoundItems.unshift(simulated);
        closeModal('modal-lostfound');
        showToast('Item report published on campus pinboard!', 'success');
        renderLostFound();
    }
}

// =========================================================================
// ANALYTICS & OPERATIONAL CHARTS (CHART.JS)
// =========================================================================
function renderAnalytics() {
    // 1. Categories Doughnut Chart
    const ctxCat = document.getElementById('chart-categories')?.getContext('2d');
    if (ctxCat) {
        if (STATE.charts.categories) STATE.charts.categories.destroy();
        STATE.charts.categories = new Chart(ctxCat, {
            type: 'doughnut',
            data: {
                labels: ['Electrical', 'HVAC/AC', 'AV & Projectors', 'Wi-Fi & Network', 'Plumbing', 'Furniture', 'Logistics'],
                datasets: [{
                    data: [18, 12, 22, 26, 14, 8, 15],
                    backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
                    borderColor: '#131b2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }
                }
            }
        });
    }

    // 2. Statuses Bar Chart
    const ctxStat = document.getElementById('chart-statuses')?.getContext('2d');
    if (ctxStat) {
        if (STATE.charts.statuses) STATE.charts.statuses.destroy();
        STATE.charts.statuses = new Chart(ctxStat, {
            type: 'bar',
            data: {
                labels: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
                datasets: [{
                    label: 'Tickets',
                    data: [4, 6, 8, 19, 28],
                    backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // 3. Weekly Resolution Velocity
    const ctxVel = document.getElementById('chart-velocity')?.getContext('2d');
    if (ctxVel) {
        if (STATE.charts.velocity) STATE.charts.velocity.destroy();
        STATE.charts.velocity = new Chart(ctxVel, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'New Incidents Logged',
                        data: [12, 19, 15, 24, 18, 9, 6],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Resolved by Staff',
                        data: [10, 18, 17, 23, 20, 12, 8],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: '#94a3b8' } } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // 4. Facility Popularity
    const ctxFac = document.getElementById('chart-facilities')?.getContext('2d');
    if (ctxFac) {
        if (STATE.charts.facilities) STATE.charts.facilities.destroy();
        STATE.charts.facilities = new Chart(ctxFac, {
            type: 'bar',
            data: {
                labels: ['Auditorium', 'Seminar Hall A', 'Seminar Hall B', 'AI Lab', 'Sports Complex'],
                datasets: [{
                    label: 'Booked Hours / Week',
                    data: [36, 28, 22, 34, 18],
                    backgroundColor: '#6366f1',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
}

function exportOperationsReport() {
    exportToCsv('campus_operations_report.csv', STATE.tickets);
}

function exportAnalyticsReport() {
    exportToCsv('campus_sla_analytics.csv', STATE.tickets);
}

function exportToCsv(filename, rows) {
    if (!rows || !rows.length) {
        showToast('No data to export', 'info');
        return;
    }
    const headers = ['TicketNumber', 'Title', 'Location', 'Category', 'Priority', 'Status', 'CreatedAt', 'ResolvedAt'];
    const csvContent = 'data:text/csv;charset=utf-8,' +
        [headers.join(',')].concat(rows.map(r => [
            `"${r.ticketNumber}"`,
            `"${(r.title || '').replace(/"/g, '""')}"`,
            `"${(r.location || '').replace(/"/g, '""')}"`,
            `"${r.category}"`,
            `"${r.priority}"`,
            `"${r.status}"`,
            `"${r.createdAt || ''}"`,
            `"${r.resolvedAt || ''}"`
        ].join(','))).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename} successfully!`, 'success');
}

// =========================================================================
// NOTIFICATIONS & MODALS
// =========================================================================
function toggleNotificationDropdown() {
    const menu = document.getElementById('notification-menu');
    menu.classList.toggle('d-none');
    renderNotificationList();
}

function renderNotificationList() {
    const list = document.getElementById('notification-list');
    if (!list) return;

    if (STATE.notifications.length === 0) {
        list.innerHTML = `<div class="text-dim text-center py-4" style="font-size: 0.8rem;">No new campus notifications</div>`;
        return;
    }

    list.innerHTML = STATE.notifications.map(n => `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" onclick="handleNotificationClick('${n.link}')">
            <div class="notification-title">${escapeHtml(n.title)}</div>
            <div>${escapeHtml(n.message)}</div>
            <div class="notification-time">${n.time || 'Recently'}</div>
        </div>
    `).join('');
}

function handleNotificationClick(link) {
    if (link) window.location.hash = link;
    document.getElementById('notification-menu')?.classList.add('d-none');
}

function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    const unread = STATE.notifications.filter(n => !n.isRead).length;
    if (badge) {
        if (unread > 0) {
            badge.textContent = unread;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

// Modal Helpers
function openModal(modalId) {
    document.getElementById(modalId)?.classList.remove('d-none');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('d-none');
}

function openNewTicketModal(type = 'MAINTENANCE') {
    document.getElementById('ticket-form-type').value = type;
    document.getElementById('ticket-modal-title').textContent = type === 'MAINTENANCE' ? 'Report Campus Maintenance Issue' : 'Request Event / Equipment Service';
    openModal('modal-ticket');
}

function openBookingModal() {
    openModal('modal-booking');
    checkBookingConflictLive();
}

function openLostFoundModal(type = 'FOUND') {
    document.getElementById('lf-type').value = type;
    document.getElementById('lf-modal-title').textContent = type === 'FOUND' ? 'Report Found Campus Belonging' : 'Report Lost Campus Item';
    openModal('modal-lostfound');
}

// Toast System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'circle-check' : type === 'error' ? 'circle-exclamation' : 'circle-info';
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i><span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Formatting Utilities
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatRelativeTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((now - date) / (1000 * 3600));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
}

function formatDateDisplay(isoDateStr) {
    if (!isoDateStr) return '';
    const d = new Date(isoDateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
