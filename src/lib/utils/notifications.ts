"use client";

import { toast } from "sonner";

// Notification types
export type Notification = {
  id: string;
  type: 'task' | 'journal' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

// Store notifications in localStorage for persistence
const STORAGE_KEY = 'mindsync_notifications';

// Helper functions to work with localStorage
const saveNotificationsToStorage = (notifications: Notification[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
};

const getNotificationsFromStorage = (): Notification[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }
  return [];
};

// Notifications API
export const NotificationsAPI = {
  // Get all notifications
  getNotifications: (): Notification[] => {
    return getNotificationsFromStorage();
  },

  // Get unread notifications count
  getUnreadCount: (): number => {
    const notifications = getNotificationsFromStorage();
    return notifications.filter(n => !n.read).length;
  },

  // Add a new notification
  addNotification: (
    type: 'task' | 'journal' | 'system',
    title: string,
    message: string,
    showToast = true
  ): Notification => {
    const notifications = getNotificationsFromStorage();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
    };
    
    notifications.unshift(newNotification);
    saveNotificationsToStorage(notifications);
    
    // Show toast if enabled
    if (showToast) {
      toast(title, {
        description: message,
        duration: 5000,
      });
    }
    
    // Request permission and send browser notification if possible
    NotificationsAPI.sendBrowserNotification(title, message);
    
    return newNotification;
  },

  // Mark notification as read
  markAsRead: (notificationId: string): void => {
    const notifications = getNotificationsFromStorage();
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    saveNotificationsToStorage(updatedNotifications);
  },

  // Mark all notifications as read
  markAllAsRead: (): void => {
    const notifications = getNotificationsFromStorage();
    
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    
    saveNotificationsToStorage(updatedNotifications);
  },

  // Delete a notification
  deleteNotification: (notificationId: string): void => {
    const notifications = getNotificationsFromStorage();
    
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    saveNotificationsToStorage(updatedNotifications);
  },

  // Delete all notifications
  clearAllNotifications: (): void => {
    saveNotificationsToStorage([]);
  },

  // Send browser notification (if permitted)
  sendBrowserNotification: (title: string, body: string): void => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  },
}; 