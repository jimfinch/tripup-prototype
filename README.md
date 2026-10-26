# TripUp prototype

Interactive prototype of TripUp, a group-trip planning app, built for a Bending Spoons product design task.

**Live:** https://tripup-task-ari-in-lisbon.netlify.app

## Viewing it

- **Desktop:** the app runs inside a 430 × 932 iPhone frame (no scaling). The panel on the left walks through the scenario, _Last night in Lisbon_, and can jump to any step or reset the demo.
- **Phone:** the app runs full screen. Your phone's own status bar replaces the prototype's fake one, so the story's time and whose phone you're holding are shown on short scene cards (e.g. "Charlie’s phone · 16:30") whenever the scenario moves on.

## Beyond the scenario

The ten steps cover the core journey. These also work, off the main path:

- **Expandable map:** tap the map on the Lisbon trip to open it full screen, then tap a pin to go straight to that activity or stay.
- **Polls:** the Polls tab lists live polls across trips, each labelled with its trip, then links to closed polls. Each trip has its own Polls page too. Vote, View votes and Close poll work the same everywhere, and a vote can be changed or taken back until the poll closes.
- **Groups:** switch Home from Trips to Groups. Open _Intrepid travellers_ to manage members, invite people, see trips taken together and add a group image.
- **Pay as you go:** on the trip view, use Pay share on Pigmeu or the stay, or Pay activity shares / Pay stay shares. The items are marked Paid and the Settle total and payments due drop to match.
- **Participant view:** open any activity Ari didn't organise (e.g. Tasca Baldracca). It's read-only apart from Invite, unlike Belcanto, which Ari edits because her poll created it.
- **After the trip:** once settled, Home shows Milan as the next trip and Lisbon moves to Past trips.

Anything outside the prototype's scope shows a "Not part of this prototype" toast rather than doing nothing.

Editing an activity saves as you go. Tapping Done editing (or back) logs Belcanto's bill and notifies the people who owe Ari.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```
