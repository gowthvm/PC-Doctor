# Wizard Integration Guide

## Files Created

1. ✅ **DiagnosticWizard Component** - `src/components/diagnostic-wizard.tsx`
   - Complete 5-step wizard with category selection, symptoms, timeline, triggers, and review
   - Auto-generates comprehensive problem descriptions
   - Fully styled with glass morphism matching your design system

## How to Integrate into Dashboard

### Step 1: Add Import and State

In `src/app/dashboard/page.tsx`, add these imports at the top (after line 41):

```typescript
import DiagnosticWizard from "@/components/diagnostic-wizard"
import { Wand2 } from "lucide-react"
```

Add this state variable (after line 111, with other state declarations):

```typescript
const [wizardMode, setWizardMode] = useState(false)
```

### Step 2: Add Wizard Handlers

Add these handler functions (after `handleAutoDetectSpecs` function around line 389):

```typescript
const handleWizardComplete = (description: string) => {
  setProblem(description)
  setWizardMode(false)
  toast.success("Problem description generated! Review and diagnose when ready.")
}

const handleWizardCancel = () => {
  setWizardMode(false)
}
```

### Step 3: Add Mode Toggle Button

Find the "Describe Your Problem" Card (around line 795-882). **Before** the Card, add this toggle button:

```typescript
{/* Wizard Mode Toggle */}
<div className="flex items-center justify-center gap-3 mb-4">
  <Button
    variant={wizardMode ? "default" : "outline"}
    onClick={() => setWizardMode(true)}
    className="flex-1 glass-card rounded-xl py-6"
    disabled={loading}
  >
    <Wand2 className="h-5 w-5 mr-2" />
    Wizard Mode
  </Button>
  <Button
    variant={!wizardMode ? "default" : "outline"}
    onClick={() => setWizardMode(false)}
    className="flex-1 glass-card rounded-xl py-6"
    disabled={loading}
  >
    Manual Mode
  </Button>
</div>
```

### Step 4: Conditionally Render Wizard or Manual Input

Replace the existing "Describe Your Problem" Card content with:

```typescript
<Card className="glass-card rounded-2xl shadow-xl">
  <CardHeader>
    <CardTitle>Describe Your Problem</CardTitle>
    <CardDescription>
      {wizardMode 
        ? "Let our wizard guide you through identifying your problem" 
        : "Be as detailed as possible about the issue you're experiencing"
      }
    </CardDescription>
  </CardHeader>
  <CardContent>
    {wizardMode ? (
      <DiagnosticWizard
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    ) : (
      <form onSubmit={handleDiagnose} className="space-y-4">
        {/* Keep existing form content here */}
        {!problem && !diagnosis && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
            {/* Example problems */}
          </div>
        )}
        <Textarea
          placeholder="e.g., My computer is running very slow..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
          rows={6}
          className="glass rounded-xl"
        />
        {/* Keep rest of form: progress indicator, error, buttons */}
      </form>
    )}
  </CardContent>
</Card>
```

## What the Wizard Does

### User Flow:
1. **Step 1**: Select problem category (Performance, Hardware, Software, Network, Display, Audio, Other)
2. **Step 2**: Check symptoms from category-specific list
3. **Step 3**: Answer timeline questions (when started, how often)
4. **Step 4**: Identify trigger event (update, installation, etc.)
5. **Step 5**: Review all info and add additional details

### Output Example:
```
Problem Category: Performance Issues

Symptoms:
- Computer is slow or laggy
- Long boot time (takes forever to start)
- High CPU or RAM usage

Timeline:
Started: This week
Frequency: Frequently (multiple times per day)
Triggered by: Windows/OS update

Recent Changes:
Installed Windows 11 23H2 update last Tuesday

Additional Details:
Especially slow when opening Chrome or Excel
```

## Benefits

✅ **Better Diagnosis Quality**: Structured questions ensure users provide all relevant information  
✅ **Reduced User Friction**: Guided process is easier than writing from scratch  
✅ **Consistent Format**: AI receives well-formatted input every time  
✅ **Beginner-Friendly**: Non-technical users can describe problems effectively  
✅ **Flexible**: Users can still use manual mode if they prefer  

## Testing

1. Start dev server: `npm run dev`
2. Navigate to dashboard
3. Click "Wizard Mode" button
4. Go through all 5 steps
5. Verify generated description appears in textarea
6. Submit for diagnosis

## Next Steps

After testing the wizard:
- Adjust symptom lists based on user feedback
- Add more trigger options if needed
- Consider adding "Skip" option for optional steps
- Track which categories are most used for analytics
