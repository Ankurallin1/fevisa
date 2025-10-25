import { z } from 'zod';

export const SiteSchema = z.object({
  brandName: z.string(),
  countryFocus: z.string().optional(),
  primaryColor: z.string().optional(),
  whatsappGreen: z.string().optional(),
  whatsappNumber: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  social: z.object({
    facebook: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
  }),
  nav: z.array(z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['button', 'link']).optional(),
  })),
  disclaimer: z.string().optional(),
});

export type Site = z.infer<typeof SiteSchema>;

export const HeroSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
});

export type Hero = z.infer<typeof HeroSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  shortDesc: z.string(),
  longDesc: z.string(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  supportedCountries: z.array(z.string()),
  faqs: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })),
  startingPrice: z.number().optional(),
  durationMin: z.number().optional(),
  timelines: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export const ServicesSchema = z.array(ServiceSchema);

export type Service = z.infer<typeof ServiceSchema>;
export type Services = z.infer<typeof ServicesSchema>;

export const ProcessStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  desc: z.string(),
});

export const ProcessSchema = z.array(ProcessStepSchema);

export type ProcessStep = z.infer<typeof ProcessStepSchema>;
export type Process = z.infer<typeof ProcessSchema>;

export const ContactSchema = z.object({
  address: z.string(),
  mapEmbedUrl: z.string().url(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string(),
  officeHours: z.object({
    weekdays: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  social: z.object({
    facebook: z.string().url(),
    instagram: z.string().url(),
    linkedin: z.string().url(),
  }),
});

export type Contact = z.infer<typeof ContactSchema>;

export const FAQSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export const FAQsSchema = z.object({
  faqs: z.array(FAQSchema),
});

export type FAQ = z.infer<typeof FAQSchema>;
export type FAQs = z.infer<typeof FAQsSchema>;

// Booking types
export const BookingSlotSchema = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  available: z.boolean(),
  heldUntil: z.string().optional(),
  startTime: z.string().optional(),
});

export const BookingDetailsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  countryOfTravel: z.string().min(2),
  notes: z.string().optional(),
});

export const BookingSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  slotId: z.string(),
  details: BookingDetailsSchema,
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  createdAt: z.string(),
  reference: z.string(),
});

export type BookingSlot = z.infer<typeof BookingSlotSchema>;
export type BookingDetails = z.infer<typeof BookingDetailsSchema>;
export type Booking = z.infer<typeof BookingSchema>;

export const PaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'success', 'failed']),
  signature: z.string().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// API Types based on backend response structure
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  countryCode: z.string(),
  isVerified: z.boolean().optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string().optional(),
    user: UserSchema.optional(),
    email: z.string().optional(),
    otpSent: z.boolean().optional(),
  }).optional(),
});

export const SignupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    email: z.string(),
    otpSent: z.boolean(),
  }).optional(),
});

export const OtpVerificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: UserSchema,
  }).optional(),
});

export const ForgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    email: z.string(),
    otpSent: z.boolean(),
  }).optional(),
});

export const ResetPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    email: z.string(),
  }).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;
export type OtpVerificationResponse = z.infer<typeof OtpVerificationResponseSchema>;
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

// Availability API Types
export const AvailabilitySlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  available: z.boolean(),
});

export const AvailabilityResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    available: z.boolean(),
    consultant: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    date: z.string(),
    timezone: z.string(),
    slots: z.array(AvailabilitySlotSchema),
  }),
});

export const CreateBookingRequestSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  notes: z.string().optional(),
});

export const CreateBookingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    userId: z.string(),
    consultantId: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    duration: z.number(),
    amount: z.number(),
    currency: z.string(),
    status: z.string(),
    paymentStatus: z.string(),
    notes: z.string(),
    createdAt: z.string(),
  }),
});

// Booking API Types based on actual API response
export const BookingApiSchema = z.object({
  id: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  consultant: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']),
  notes: z.string().optional(),
  isRescheduled: z.boolean(),
  createdAt: z.string(),
  canBeCancelled: z.boolean(),
  canBeCancelledByUser: z.boolean(),
  canBeRescheduled: z.boolean(),
});

export const BookingsApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(BookingApiSchema),
});

export const BookingApiResponseSchema = z.object({
  success: z.boolean(),
  data: BookingApiSchema,
});

// Pricing API Types
export const PricingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    amount: z.string(),
    currency: z.string(),
    country: z.string(),
    duration: z.number(),
  }),
});

export type PricingResponse = z.infer<typeof PricingResponseSchema>;

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;

// Payment API Types
export const CreatePaymentOrderSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timeout: z.boolean().optional(),
  data: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    approvalUrl: z.string(),
    payment: z.object({
      id: z.string(),
      amount: z.number(),
      currency: z.string(),
      status: z.string(),
      paypalOrderId: z.string(),
    }),
  }).optional(),
});

export const PaymentCaptureSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string(),
    amount: z.number(),
    currency: z.string(),
    paypalOrderId: z.string(),
    capturedAt: z.string(),
  }),
});

export type CreatePaymentOrderResponse = z.infer<typeof CreatePaymentOrderSchema>;
export type PaymentCaptureResponse = z.infer<typeof PaymentCaptureSchema>;
export type BookingApi = z.infer<typeof BookingApiSchema>;
export type BookingsApiResponse = z.infer<typeof BookingsApiResponseSchema>;
export type BookingApiResponse = z.infer<typeof BookingApiResponseSchema>;

// University Types
export const UniversitySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  location: z.string(),
  keyHighlights: z.array(z.string()),
  tuitionRangeAud: z.string(),
  bestForIndianStudentsReason: z.string(),
  url: z.string().url(),
});

export const UniversitiesSchema = z.array(UniversitySchema);

export type University = z.infer<typeof UniversitySchema>;
export type Universities = z.infer<typeof UniversitiesSchema>;