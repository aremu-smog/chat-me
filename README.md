## Chat Me

This is a simple chat application built with Pusher to explore how PubSubs and maybe websockets work.

## Finding(s)

For some weird reason. I had expected Pusher to persist the data on their 'system'(db) but the data that are sent via a websocket are 'transient' - meaning they are short lived and this also makes sense for an event-driven system. You publish events with data to channel, the users subscribed to that channel receive these events. If you want to persist the data in your system that's up to you.
