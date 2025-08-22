# QA Benchmark Seed

This directory contains seed materials for a QA-style benchmark:

- `tickets.csv`: A list of subtle, realistic, UI-detectable bugs as CSV tickets.
- Optional togglable QA bugs in the app for demo purposes.

## Toggling demo bugs in the UI

A small, safe demo bug is behind a runtime flag and only affects local browsers when enabled.

- Bug: Shift+Enter sends the message (instead of inserting a newline) in the message composer.
- Flag: `localStorage.QA_BUG_SHIFT_ENTER_SEND = '1'`

Enable:

```js
localStorage.setItem('QA_BUG_SHIFT_ENTER_SEND', '1');
```

Disable:

```js
localStorage.removeItem('QA_BUG_SHIFT_ENTER_SEND');
```

Notes:
- The behavior is only modified when the flag is present in `localStorage` for the current browser.
- No impact to production builds without the flag.




## Server toggle: Muted channel shows desktop notifications

This enables a demo bug where a muted channel still triggers desktop notifications.

- Flag: QA_BUG_MUTED_CHANNEL_NOTIF='1'
- Notes: This is a server env var; changing it requires a server restart.

Enable (macOS/Linux):
```bash
QA_BUG_MUTED_CHANNEL_NOTIF=1 meteor run
```

Enable (Windows PowerShell):
```powershell
$env:QA_BUG_MUTED_CHANNEL_NOTIF='1'; meteor run
```

Disable:
- Unset the env var or set it to 0, then restart the server.

Reproduce:
1) In a channel, open Room → Notifications → set Desktop: "Nothing" (muted).
2) From another user, send a message in that channel.
3) With the flag enabled, a desktop notification still appears (bug).


## Draft Management Bug: Draft lost when switching rooms

This bug simulates the scenario where composer drafts are lost when users quickly switch between rooms.

**Bug Description:**
Composer draft disappears when navigating between rooms quickly, causing users to lose their unsaved messages.


Enable:

```js
localStorage.setItem('QA_BUG_ERASE_DRAFT', '1');
```

**Reproduction Steps:**
1. Type a long draft in #general
2. Switch to another room and back within 2s
3. Draft is gone

**Files Modified to Create Bug:**
- `apps/meteor/client/views/room/composer/messageBox/MessageBox.tsx`
- `apps/meteor/app/ui-message/client/messageBox/createComposerAPI.ts`
- `apps/meteor/client/lib/chats/data.ts`


## Paste Image Bug: Past image clears typed text
This bug simulates the scenario where pasting an image attachment clears existing typed text.

**Bug Description:**
Pasting an image attachment clears existing typed text, leaving only the image.

**Reproduction Steps:**
1. Type a sentence in the composer
2. Paste an image from clipboard
3. Text disappears; only image remains

**Enable Bug:**
```js
localStorage.setItem('QA_BUG_PASTE_IMAGE_CLEARS_TEXT', '1');
```

**Disable Bug:**
```js
localStorage.removeItem('QA_BUG_PASTE_IMAGE_CLEARS_TEXT');
```

**Files Modified:**
- `apps/meteor/client/views/room/composer/messageBox/MessageBox.tsx`

**How the Bug Works:**
- Detects when clipboard contains image data
- Clears existing composer text before processing image paste
- Results in loss of user's typed content


## Reaction Count Bug: Reaction count mismatch after undo

This bug simulates the scenario where reaction counts don't update properly after removing reactions.

**Bug Description:**
Adding then removing a reaction leaves a stale count visible to other users until refresh.

**Reproduction Steps:**
1. React to a message
2. Remove the same reaction
3. Counter remains at 1 for other viewers until refresh

**Enable Bug:**
```js
localStorage.setItem('QA_BUG_REACTION_COUNT_MISMATCH', '1');
```

**Disable Bug:**
```js
localStorage.removeItem('QA_BUG_REACTION_COUNT_MISMATCH');
```

**Files Modified:**
- `apps/meteor/client/components/message/content/reactions/Reaction.tsx`
- `apps/meteor/client/components/message/content/Reactions.tsx`

**How the Bug Works:**
- Detects when user removes their reaction
- Keeps the reaction count at minimum 1 instead of 0
- Creates a mismatch between actual reactions and displayed count
- Other users see stale count until page refresh

**Testing the Bug:**
1. Enable the bug flag
2. Add a reaction to a message
3. Remove the same reaction
4. Verify the count stays at 1 instead of 0
5. Check that other users see the incorrect count



## Thread Counter Bug: Thread counter not decremented

This bug simulates the scenario where deleting the last reply in a thread keeps the thread count > 0.

**Bug Description:**
Deleting the last reply in a thread keeps the thread count > 0, showing incorrect reply counts.

**Reproduction Steps:**
1. Create thread with 1 reply
2. Delete the reply
3. Thread counter remains 1

**Enable Bug:**
```js
localStorage.setItem('QA_BUG_THREAD_COUNTER_NOT_DECREMENTED', '1');
```

**Disable Bug:**
```js
localStorage.removeItem('QA_BUG_THREAD_COUNTER_NOT_DECREMENTED');
```

**Files Modified:**
- `apps/meteor/client/views/room/Message/ThreadMetrics.tsx``

**Testing the Bug:**
1. Enable the bug flag
2. Create a thread with one reply
3. Delete the reply
4. Verify the thread counter still shows 1 instead of 0
5. Check that the count doesn't update properly


## Forwarded Thread Bug: Random strings in forwarded thread messages

This bug simulates the scenario where forwarded thread messages display random strings instead of the actual content.

**Bug Description:**
When forwarding messages that are part of a thread, the quoted content shows random strings instead of the original message text.

**Reproduction Steps:**
1. Create a thread with messages
2. Forward a message from the thread to another channel
3. The quoted content shows random strings instead of actual text

**Enable Bug:**
```js
localStorage.setItem('QA_BUG_FORWARDED_THREAD_RANDOM', '1');
```

**Disable Bug:**
```js
localStorage.removeItem('QA_BUG_FORWARDED_THREAD_RANDOM');
```

**Files Modified:**
- `apps/meteor/client/components/message/content/attachments/QuoteAttachment.tsx`

**How the Bug Works:**
- Detects when a forwarded message is part of a thread
- Replaces the actual message content with randomly generated strings
- Affects both plain text and markdown content
- Creates confusion when users try to understand forwarded thread content

**Testing the Bug:**
1. Enable the bug flag
2. Create a thread with meaningful messages
3. Forward a message from the thread to another channel
4. Verify the quoted content shows random strings instead of actual text
5. Check that both text and markdown formatting are corrupted


## Thread Shift+Enter Bug: Shift+Enter sends message in threads

This bug simulates the scenario where Shift+Enter sends a message instead of creating a new line when composing in threads.

**Bug Description:**
In thread composers, pressing Shift+Enter sends the message instead of inserting a new line, breaking the expected behavior.

**Reproduction Steps:**
1. Open a thread and start composing a message
2. Press Shift+Enter expecting a new line
3. Message gets sent instead

**Enable Bug:**
```js
localStorage.setItem('QA_BUG_THREAD_SHIFT_ENTER_SEND', '1');
```

**Disable Bug:**
```js
localStorage.removeItem('QA_BUG_THREAD_SHIFT_ENTER_SEND');
```

**Files Modified:**
- `apps/meteor/client/views/room/composer/messageBox/MessageBox.tsx`

**How the Bug Works:**
- Detects when user is composing in a thread (tmid exists)
- Intercepts Shift+Enter key combination
- Forces message send instead of new line insertion
- Breaks the expected Shift+Enter behavior for multi-line composition

**Testing the Bug:**
1. Enable the bug flag
2. Open a thread and start typing a message
3. Press Shift+Enter expecting a new line
4. Verify the message gets sent instead
5. Check that normal Enter behavior remains unchanged