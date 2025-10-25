# Acme Migration - Australia Visa Services

A production-ready React + Vite + Tailwind CSS application for Australia visa services. Built with TypeScript, content-driven from JSON files, and includes a complete booking flow with mock payment integration.

## Features

- 🚀 **Modern Stack**: React 18, Vite, TypeScript, Tailwind CSS
- 📱 **Responsive Design**: Mobile-first approach with modern UI
- 🎯 **Content-Driven**: All content loaded from JSON files with TypeScript validation
- 📅 **Booking System**: Complete 3-step booking wizard with slot selection
- 💳 **Payment Integration**: Mock payment system with clear backend seams
- 📞 **WhatsApp Integration**: Floating button and contact links
- ♿ **Accessible**: Proper ARIA labels, keyboard navigation, focus states
- 🔍 **SEO Ready**: Semantic HTML structure and meta tags

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Validation**: Zod schemas for runtime type checking
- **State Management**: React hooks and context
- **Build Tool**: Vite with TypeScript support

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ServicesGrid.tsx
│   ├── ProcessSteps.tsx
│   ├── ContactCard.tsx
│   ├── FAQ.tsx
│   ├── WhatsAppButton.tsx
│   └── booking/        # Booking flow components
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── ServiceDetail.tsx
│   ├── Book.tsx
│   └── BookingConfirm.tsx
├── routes/             # React Router configuration
├── content/           # JSON content files
│   ├── site.json
│   ├── hero.json
│   ├── services.json
│   ├── process.json
│   ├── contact.json
│   └── faqs.json
├── lib/
│   ├── api/           # API layer with mock adapter
│   ├── types/         # TypeScript interfaces and Zod schemas
│   ├── utils/         # Utility functions
│   └── hooks/         # Custom React hooks
└── App.tsx            # Main app component
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visa-web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=""
   VITE_PUBLIC_URL=""  # optional, can be set to the Network URL during dev
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Mobile Testing on LAN

The development server is configured for LAN mobile testing:

1. **Start the dev server** (already configured with `--host --port 5173`)
   ```bash
   pnpm dev
   ```

2. **Find the Network URL**
   After starting the server, Vite will display both Local and Network URLs:
   ```
   Local:   http://localhost:5173/
   Network: http://192.168.1.23:5173/
   ```

3. **Test on your phone**
   - Ensure your phone and computer are on the same Wi-Fi network
   - Open the **Network URL** (e.g., `http://192.168.1.23:5173`) on your phone's browser
   - The site should load and be fully functional

4. **Alternative: External Testing**
   For testing from outside your network, you can use:
   ```bash
   # Using ngrok (requires account)
   npx ngrok http 5173
   
   # Using Cloudflare Tunnel (free)
   cloudflared tunnel --url http://localhost:5173
   ```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Content Management

All user-facing content is loaded from JSON files in `/src/content/` using **static imports** for reliable production builds:

- `site.json` - Brand info, navigation, contact details
- `hero.json` - Homepage hero section content
- `services.json` - Service listings and details
- `process.json` - How we work steps
- `contact.json` - Contact information and office hours
- `faqs.json` - Frequently asked questions

### Adding New Content

1. Edit the relevant JSON file in `/src/content/`
2. Update the TypeScript interface in `/src/lib/types/site.ts`
3. Update the Zod schema for validation
4. The changes will be reflected immediately in the UI

### Production Build Notes

- **Static Imports**: All JSON content is statically imported and bundled at build time
- **No Runtime Fetching**: Content is loaded synchronously, ensuring reliable production builds
- **Deployment Ready**: Works correctly on Netlify, Vercel, and other static hosting platforms

## API Integration

The application includes a complete API layer with mock adapter for development:

### Development Mode
- Uses `mockAdapter.ts` for all API calls
- Data persisted in localStorage
- Simulated delays and responses

### Production Mode
- Routes to real API endpoints
- Configure `VITE_API_BASE_URL` environment variable
- Replace mock functions with real implementations

### API Endpoints

```typescript
// Services
listServices(): Promise<Service[]>
getService(slug: string): Promise<Service | null>

// Booking Slots
listSlots(serviceId: string, weekStart: string): Promise<BookingSlot[]>
holdSlot(slotId: string): Promise<{ holdId: string; expiresAt: string }>
releaseSlot(holdId: string): Promise<void>

// Orders & Payments
createOrder(payload): Promise<{ orderId: string; amount: number }>
verifyPayment(sigPayload): Promise<boolean>

// Bookings
createBooking(payload): Promise<Booking>
getBooking(reference: string): Promise<Booking | null>
```

## Booking Flow

The booking system includes:

1. **Service Selection** - Choose from available services
2. **Slot Selection** - Pick consultation time with 10-minute hold
3. **Details Collection** - Customer information and verification
4. **Payment Processing** - Mock payment with success/failure simulation
5. **Confirmation** - Booking summary with calendar integration

## Payment Integration

Currently uses mock payment system. To integrate real payment:

1. **Razorpay Integration**
   ```typescript
   // Replace mock payment in usePayment hook
   const razorpay = new Razorpay({
     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
     // ... configuration
   });
   ```

2. **Stripe Integration**
   ```typescript
   // Replace mock payment in usePayment hook
   const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   ```

## Analytics

Analytics events are tracked throughout the application:

- `whatsapp_click` - WhatsApp button interactions
- `book_click` - Booking button clicks
- `service_card_click` - Service card interactions
- `slot_held` - Slot reservation events
- `payment_success` - Successful payments
- `payment_failed` - Failed payments

To integrate real analytics:

1. Add Google Analytics or similar service
2. Replace console.log calls in `/src/lib/utils/analytics.ts`
3. Configure tracking ID in environment variables

## Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `pnpm build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | No (uses mock in dev) |
| `VITE_PUBLIC_URL` | Public URL for external access | No |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email hello@acme.au or join our WhatsApp community.