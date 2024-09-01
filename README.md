# dex-imessage-sync

Read local macOS iMessages to sync with Dex.

Currently setup to compare phones numbers from Dex and iMessages and add a note to the contact on the message date. I limit one message per day for now.

## Setup

```
npm install
```

Copy iMessages database to your desktop or somewhere that does not need full disk access permissions.

## Running

```
node index.js
```

## Environment Variables

```
DEX_API_KEY=XXX
MESSAGES_DB=/Users/XXX/Desktop/chat.db
TIMEZONE=America/Los_Angeles
```
