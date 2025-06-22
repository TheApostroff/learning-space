# Environment Configuration

This project uses environment variables to configure API connections and other settings.

## Setup

1. Copy `env.example` to `.env.local` in your project root:
   ```bash
   cp config/env.example .env.local
   ```

2. Edit `.env.local` and configure the variables as needed.

## Environment Variables

### API Configuration

- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `http://localhost:3001/api`)
- `NEXT_PUBLIC_USE_MOCK_DATA`: Set to `'true'` to force using mock data

### Default Behavior

- If `NEXT_PUBLIC_API_URL` is not set, the app will use mock data
- If `NEXT_PUBLIC_USE_MOCK_DATA` is set to `'true'`, mock data will be used regardless of API URL

### Examples

**Development with Mock Data (Default):**
```env
# .env.local
# No variables needed - uses mock data by default
```

**Development with Real Backend:**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**Force Mock Data:**
```env
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## File Locations

- `.env.local` - Local environment variables (not committed to git)
- `config/env.example` - Example configuration file
- `app/lib/api.ts` - API client that reads these variables 