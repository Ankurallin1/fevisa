// Analytics utility functions
// In production, these would integrate with Google Analytics, Mixpanel, etc.

export const analytics = {
  // Track WhatsApp clicks
  whatsappClick: (source: string) => {
    console.log('Analytics: WhatsApp clicked from', source);
    // TODO: Integrate with real analytics service
    // gtag('event', 'whatsapp_click', { source });
  },

  // Track booking button clicks
  bookClick: (source: string) => {
    console.log('Analytics: Book button clicked from', source);
    // TODO: Integrate with real analytics service
    // gtag('event', 'book_click', { source });
  },

  // Track service card clicks
  serviceCardClick: (serviceId: string, serviceName: string) => {
    console.log('Analytics: Service card clicked', { serviceId, serviceName });
    // TODO: Integrate with real analytics service
    // gtag('event', 'service_card_click', { service_id: serviceId, service_name: serviceName });
  },

  // Track slot selection
  slotHeld: (slotId: string, serviceId: string) => {
    console.log('Analytics: Slot held', { slotId, serviceId });
    // TODO: Integrate with real analytics service
    // gtag('event', 'slot_held', { slot_id: slotId, service_id: serviceId });
  },

  // Track payment success
  paymentSuccess: (orderId: string, amount: number) => {
    console.log('Analytics: Payment successful', { orderId, amount });
    // TODO: Integrate with real analytics service
    // gtag('event', 'payment_success', { order_id: orderId, value: amount });
  },

  // Track payment failure
  paymentFailed: (orderId: string, error: string) => {
    console.log('Analytics: Payment failed', { orderId, error });
    // TODO: Integrate with real analytics service
    // gtag('event', 'payment_failed', { order_id: orderId, error });
  },

  // Track page views
  pageView: (page: string) => {
    console.log('Analytics: Page view', { page });
    // TODO: Integrate with real analytics service
    // gtag('config', 'GA_MEASUREMENT_ID', { page_title: page });
  },
};
