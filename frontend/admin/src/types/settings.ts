export interface ReservationSettings {
  min_hours_advance: number;
  max_days_advance: number;
  max_hours_duration: number;
  cancellation_hours_advance: number;
}

export interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  notification_email: string;
  quiet_hours_start: string; // Format: "HH:MM"
  quiet_hours_end: string; // Format: "HH:MM"
}

export interface CondominiumData {
  name: string;
  address?: string;
  phone?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface Settings {
  id: string;
  name: string;
  domain?: string;
  address?: string;
  phone?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  reservation_settings: ReservationSettings;
  notification_settings: NotificationSettings;
  created_at: string;
  updated_at: string;
}

export interface SettingsUpdate {
  // Condominium data
  name?: string;
  address?: string;
  phone?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  zipcode?: string;

  // Settings
  reservation_settings?: ReservationSettings;
  notification_settings?: NotificationSettings;
}
