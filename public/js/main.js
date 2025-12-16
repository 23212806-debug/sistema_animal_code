// public/js/main.js
class SistemaAnimal {
    // Verificar autenticación
    static async checkAuth() {
        try {
            const response = await fetch('/api/estadisticas');
            if (!response.ok) {
                window.location.href = '/login.html';
                return null;
            }
            return await response.json();
        } catch (error) {
            window.location.href = '/login.html';
            return null;
        }
    }
    
    // Cerrar sesión
    static async logout() {
        try {
            const response = await fetch('/api/logout');
            const data = await response.json();
            window.location.href = data.redirect || '/login.html';
        } catch (error) {
            window.location.href = '/login.html';
        }
    }
    
    // Mostrar mensaje
    static showMessage(type, message, duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(alert);
        
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, duration);
        }
        
        return alert;
    }
    
    // Formatear fecha
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Validar email
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Cargar imagen con fallback
    static loadImage(imgElement, src, fallback = 'https://via.placeholder.com/400x300?text=Sin+imagen') {
        imgElement.onerror = function() {
            this.src = fallback;
            this.onerror = null;
        };
        imgElement.src = src;
    }
}

// Añadir estilos para las alertas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert {
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .alert-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .alert-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .alert-warning {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
    }
    
    .alert-info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: 15px;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    
    .alert-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);