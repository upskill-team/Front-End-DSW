type EventHandler = (data?: unknown) => void;

interface Events {
  [eventName: string]: EventHandler[];
}

class EventEmitter {
  private events: Events = {};

  // Escuchar un evento
  on(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  // Dejar de escuchar un evento
  off(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter(h => h !== handler);
  }

  // Emitir (disparar) un evento
  emit(eventName: string, data?: unknown) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach(handler => handler(data));
  }
}

export const eventEmitter = new EventEmitter();