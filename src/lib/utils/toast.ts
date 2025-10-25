// Toast notification utility
export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

class ToastManager {
  private toasts: ToastOptions[] = [];
  private listeners: ((toasts: ToastOptions[]) => void)[] = [];

  show(options: ToastOptions) {
    const toast: ToastOptions = {
      duration: 5000,
      ...options,
    };
    
    this.toasts.push(toast);
    this.notifyListeners();
    
    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, toast.duration);
    }
    
    return toast;
  }

  remove(toast: ToastOptions) {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
      this.notifyListeners();
    }
  }

  clear() {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener: (toasts: ToastOptions[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

export const toast = new ToastManager();

// Convenience methods
export const showSuccess = (title: string, message?: string) => 
  toast.show({ type: 'success', title, message });

export const showError = (title: string, message?: string) => 
  toast.show({ type: 'error', title, message });

export const showWarning = (title: string, message?: string) => 
  toast.show({ type: 'warning', title, message });

export const showInfo = (title: string, message?: string) => 
  toast.show({ type: 'info', title, message });


