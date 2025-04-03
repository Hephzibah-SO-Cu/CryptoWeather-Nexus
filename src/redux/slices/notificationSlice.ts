import { createSlice } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'price_alert' | 'weather_alert';
  message: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: { payload: Notification }) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: { payload: string }) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;