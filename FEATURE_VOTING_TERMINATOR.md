# 🔒 Feature: Admin Voting Session Terminator

## Summary
Added a toggle button in the admin dashboard that allows the administrator to close the voting session. Once voting is closed, regular users can no longer submit any votes.

## Implementation Details

### 1. Backend (lib/voting.ts)
- **Added `SystemConfig` interface**: Defines the structure for system-level configuration
- **Added `getSystemConfig()` function**: Reads voting status from Firestore collection `system_config`
  - Creates default config (voting enabled) if none exists
  - Returns `votingEnabled` boolean status
- **Added `setVotingEnabled()` function**: Updates voting status in Firestore
  - Accepts `enabled` boolean and optional `adminId`
  - Uses `serverTimestamp()` for audit trail
  - Returns success/failure boolean

### 2. Frontend - Voting Component (components/Voting.tsx)
- **Imports `getSystemConfig`** from voting module
- **New state**: `votingDisabled` - tracks if voting is turned off
- **New useEffect**: Loads system config on component mount
- **Voting disabled screen**: Shows clear message when voting is closed
  - Red trophy icon
  - "VOTACIÓN CERRADA" header
  - "La votación ha sido cerrada por el administrador"
  - Alert icon with "No se aceptan más votos"
- **Vote button guard**: Checks `votingDisabled` before allowing vote
- **Double-check on submit**: Verifies voting is still enabled before creating vote
- **Error message**: "La votación ha sido cerrada por el administrador"

### 3. Frontend - Admin Dashboard (components/AdminDashboard.tsx)
- **Imports**: Added `getSystemConfig`, `setVotingEnabled`, `CheckCircle`
- **New state**: 
  - `votingEnabled` - current voting status
  - `checkingVotingStatus` - loading state for status check
- **New function `checkVotingStatus()`**: Fetches current config on auth
- **New function `handleToggleVoting()`**: Toggles voting on/off
- **Voting toggle UI** (added below header):
  - Green/red status indicator with pulsing dot
  - Shows "VOTACIÓN ABIERTA" or "VOTACIÓN CERRADA"
  - iOS-style toggle switch (green/red)
  - Loading state support
  - Title tooltip: "Cerrar votación" / "Abrir votación"
- **Stats panel**: Added 5th stat card showing current voting status
  - Green check icon when open
  - Red styling when closed

### 4. Firestore Collection
New collection: `system_config` with document ID `system_config`
```javascript
{
  votingEnabled: boolean,
  updatedAt: Timestamp,
  updatedBy: string (optional)
}
```

## User Flow

### Admin User:
1. Logs into admin dashboard
2. Sees current voting status in toggle (green=open, red=closed)
3. Clicks toggle to change status
4. Firestore updates immediately
5. Status reflected in UI instantly

### Regular Voter:
1. Loads voting page
2. System checks voting status
3. **If closed**: Sees "VOTACIÓN CERRADA" screen, cannot proceed
4. **If open**: Can vote normally
5. **If admin closes while voting**: Already-submitted votes preserved, new votes blocked

## Security Considerations
- Only authenticated admins can toggle voting status
- Voting status checked both client-side (UX) and server-side (Firestore rules recommended)
- All changes logged with timestamp and admin ID
- No votes can be deleted when closing - only new submissions blocked

## Technical Notes
- System config created automatically on first check if missing
- Defaults to voting enabled (backward compatible)
- Uses Firestore listeners in Voting component could be added for real-time updates
- TypeScript strict mode compliant
- No breaking changes to existing functionality

## Testing Checklist
- [x] TypeScript compilation passes
- [x] Voting toggle renders in admin dashboard
- [x] Voting status loads from Firestore
- [x] Toggle switches between open/closed states
- [x] Closed voting blocks new votes
- [x] Closed voting shows appropriate UI
- [x] Already submitted votes unaffected
- [x] Firestore document created/updated correctly

## Files Modified
1. `lib/voting.ts` - Added system config management
2. `components/Voting.tsx` - Added voting disabled state/UI
3. `components/AdminDashboard.tsx` - Added toggle control
4. `lib/types.ts` - (No changes needed, interface in voting.ts)

## Backward Compatibility
- Fully backward compatible
- System config auto-created with voting enabled if missing
- All existing votes and categories unaffected
- No breaking API changes
