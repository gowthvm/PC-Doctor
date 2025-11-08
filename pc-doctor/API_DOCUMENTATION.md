# PC Doctor API Documentation

This document describes the API endpoints available in the PC Doctor application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app`

## Authentication

All API routes (except public pages) require authentication via Supabase. The authentication is handled automatically through cookies set by Supabase Auth.

### Authentication Flow

1. User signs up or logs in via Supabase Auth
2. Supabase sets authentication cookies
3. Middleware validates the session on each request
4. Protected routes redirect to `/login` if not authenticated

## API Endpoints

### POST /api/diagnose

Analyzes a computer problem and returns AI-generated diagnosis with solutions.

#### Authentication Required

Yes - User must be logged in

#### Request Body

```json
{
  "systemSpecs": {
    "cpu": "string (optional)",
    "gpu": "string (optional)",
    "ram": "string (optional)",
    "os": "string (optional)",
    "storage": "string (optional)"
  },
  "problem": "string (required)"
}
```

#### Request Example

```javascript
const response = await fetch('/api/diagnose', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    systemSpecs: {
      cpu: 'Intel Core i7-10700K',
      gpu: 'NVIDIA RTX 3070',
      ram: '16GB DDR4',
      os: 'Windows 11',
      storage: '512GB NVMe SSD'
    },
    problem: 'My computer is running very slow and programs freeze frequently.'
  })
})

const diagnosis = await response.json()
```

#### Response (200 OK)

```json
{
  "diagnosis": "System performance degradation due to high resource usage",
  "confidence": 85,
  "possibleCauses": [
    "Background processes consuming excessive resources",
    "Insufficient RAM for current workload",
    "Disk fragmentation or failing storage device"
  ],
  "steps": [
    {
      "step": 1,
      "title": "Check Task Manager for Resource Usage",
      "description": "Open Task Manager (Ctrl+Shift+Esc) and identify processes using high CPU or memory. Sort by CPU and Memory columns to find the culprits.",
      "difficulty": "easy",
      "estimatedTime": "5 mins",
      "commands": [
        "taskmgr"
      ],
      "warnings": [
        "Do not end critical system processes"
      ]
    },
    {
      "step": 2,
      "title": "Disable Startup Programs",
      "description": "Many programs start automatically with Windows, consuming resources. Disable unnecessary startup programs to improve boot time and performance.",
      "difficulty": "easy",
      "estimatedTime": "10 mins",
      "commands": [
        "msconfig"
      ]
    },
    {
      "step": 3,
      "title": "Run Disk Cleanup",
      "description": "Clean up temporary files and system cache to free up disk space and improve performance.",
      "difficulty": "easy",
      "estimatedTime": "15 mins",
      "commands": [
        "cleanmgr"
      ]
    },
    {
      "step": 4,
      "title": "Check for Malware",
      "description": "Run a full system scan with Windows Defender or your antivirus software to check for malware that might be slowing down your system.",
      "difficulty": "medium",
      "estimatedTime": "30-60 mins",
      "commands": [
        "windowsdefender:"
      ],
      "warnings": [
        "Full scan may take significant time"
      ]
    },
    {
      "step": 5,
      "title": "Consider RAM Upgrade",
      "description": "If issues persist after optimization, your system may need more RAM. 16GB is recommended for modern Windows 11 usage.",
      "difficulty": "hard",
      "estimatedTime": "30 mins",
      "warnings": [
        "Requires purchasing compatible RAM",
        "Ensure RAM is compatible with your motherboard"
      ]
    }
  ],
  "preventiveTips": [
    "Regularly update Windows and drivers",
    "Keep at least 20% of your storage free",
    "Run disk cleanup monthly",
    "Monitor startup programs and disable unnecessary ones",
    "Consider upgrading to an SSD if using HDD",
    "Restart your computer at least once a week"
  ]
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request**
```json
{
  "error": "Problem description is required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to get diagnosis from AI service"
}
```

or

```json
{
  "error": "No response from AI service"
}
```

or

```json
{
  "error": "Internal server error"
}
```

#### Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting in production using:
- Vercel's built-in rate limiting
- Upstash Redis for custom rate limiting
- API Gateway with rate limiting

#### Cost Considerations

Each diagnosis request costs approximately:
- **GPT-4o-mini**: ~$0.0001 - $0.0005 per request
- Varies based on:
  - Length of problem description
  - System specs detail
  - Response complexity

## Database Schema

### diagnoses Table

Automatically stores all diagnoses for logged-in users.

```sql
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  system_specs JSONB,
  problem_description TEXT,
  diagnosis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE
);
```

#### Columns

- **id**: Unique identifier for the diagnosis
- **user_id**: Reference to the authenticated user
- **system_specs**: JSON object containing system specifications
- **problem_description**: User's description of the problem
- **diagnosis_result**: Complete AI response including diagnosis, steps, and tips
- **created_at**: Timestamp when diagnosis was created

#### Row Level Security (RLS)

Users can only:
- View their own diagnoses
- Insert their own diagnoses
- Update their own diagnoses
- Delete their own diagnoses

## OpenRouter Integration

### Model Used

**openai/gpt-4o-mini**
- Fast and cost-effective
- Good balance of quality and speed
- Suitable for technical diagnostics

### Alternative Models

You can change the model in `/api/diagnose/route.ts`:

```typescript
// Current
model: "openai/gpt-4o-mini"

// Alternatives
model: "anthropic/claude-3-haiku"  // Faster, cheaper
model: "openai/gpt-4o"             // More accurate, expensive
model: "google/gemini-pro"         // Good alternative
```

### Prompt Engineering

The prompt is structured to:
1. Provide system context
2. Include all system specifications
3. Present the problem clearly
4. Request structured JSON response
5. Specify required fields and format

#### Prompt Template

```
You are PC Doctor, an expert computer technician AI assistant.
Analyze the following computer problem and provide a detailed diagnosis
with step-by-step solutions.

System Specifications:
- CPU: {cpu}
- GPU: {gpu}
- RAM: {ram}
- Operating System: {os}
- Storage: {storage}

Problem Description:
{problem}

Please provide your response in the following JSON format:
{...}
```

### Response Parsing

The API handles:
- JSON extraction from markdown code blocks
- Fallback responses if parsing fails
- Error handling for malformed responses

## Frontend Integration

### React Hook Example

```typescript
const useDiagnosis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState(null)

  const diagnose = async (systemSpecs, problem) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemSpecs, problem })
      })
      
      if (!response.ok) throw new Error('Diagnosis failed')
      
      const data = await response.json()
      setDiagnosis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { diagnose, loading, error, diagnosis }
}
```

### Usage in Component

```typescript
const { diagnose, loading, diagnosis } = useDiagnosis()

const handleSubmit = async (e) => {
  e.preventDefault()
  await diagnose(systemSpecs, problem)
}
```

## Security Considerations

### API Key Protection

- OpenRouter API key is stored in environment variables
- Never exposed to the client
- Only accessible server-side

### Authentication

- All requests validated through Supabase middleware
- Session cookies are httpOnly and secure
- Automatic session refresh

### Input Validation

- Problem description is required
- System specs are optional but validated
- SQL injection prevented by Supabase client
- XSS prevented by React's built-in escaping

### Rate Limiting Recommendations

For production, implement:

```typescript
// Example with Upstash Redis
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})

// In API route
const identifier = user.id
const { success } = await ratelimit.limit(identifier)

if (!success) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429 }
  )
}
```

## Monitoring and Logging

### Recommended Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and debugging
- **OpenRouter Dashboard**: API usage and costs

### Key Metrics to Track

- API response times
- Error rates
- OpenRouter API costs
- User engagement
- Diagnosis success rates

## Future API Enhancements

### Planned Endpoints

1. **GET /api/diagnoses** - List user's diagnosis history
2. **GET /api/diagnoses/:id** - Get specific diagnosis
3. **DELETE /api/diagnoses/:id** - Delete diagnosis
4. **POST /api/feedback** - Submit feedback on diagnosis
5. **GET /api/stats** - User statistics and insights

### Planned Features

- Diagnosis history pagination
- Export diagnosis as PDF
- Share diagnosis with others
- Rate diagnosis accuracy
- Save favorite solutions

## Testing

### Manual Testing

Use tools like:
- **Postman**: API testing
- **Thunder Client**: VS Code extension
- **curl**: Command-line testing

### Example curl Request

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "systemSpecs": {
      "cpu": "Intel i7",
      "os": "Windows 11"
    },
    "problem": "Computer is slow"
  }'
```

### Automated Testing

Consider adding:
- Jest for unit tests
- Playwright for E2E tests
- Vitest for component tests

## Support

For API-related issues:
- Check OpenRouter status page
- Review Supabase logs
- Check Vercel function logs
- Enable debug logging in development

---

**Last Updated**: November 2024
