# TripUp prototype: build instructions

This repo is a coded, hosted, interactive prototype of **TripUp**, a group-trip planning app. It is the primary deliverable for a Bending Spoons product design task. A PM will open a public URL and click through the full scenario with no explanation, so every screen must work, read clearly and look finished.

The design is already done. Your job is to **implement it faithfully**, not to redesign it.

---

## 0. Ground rules

1. **Figma is the source of truth.** Read it through the Figma MCP before building anything visual.
   - Figma file: `https://www.figma.com/design/9lIYMqDOVAaJCuxnKgOEVI/TripUp-Task?node-id=0-1&t=KMNzNMUZSoKhUFiD-1`
   - **Read-only.** Never write to the Figma file. Don't use `use_figma` writes, `generate_figma_design`, `html_to_figma`, Code Connect or anything else that edits the file. The file is a submission artefact and must stay exactly as the designer left it.
   - Node IDs aren't listed here. Find frames **by page and frame name** (see §2), then use their IDs.
2. **Precedence when sources disagree.**
   - **Visual style:** the hi-fi screens (Designs page) win, then components and variables, then the wireflow.
   - **Content, flow and numbers:** the wireflow wins, then this document.
   - If you find a real conflict, **stop and ask**. Don't guess.
3. **Don't invent features, copy or numbers.** All data is in §6. Use the copy exactly as it appears in Figma (UK English, £).
4. **Work in phases (§10).** Stop at the end of each phase with a short summary and screenshots, so the designer can review before you continue.

---

## 1. Brief constraints (non-negotiable)

- **Reference device:** iPhone, **430 × 932 pt**, no scaling. Never use CSS `transform: scale()` or zoom to fit the device frame.
- **Mobile-optimised web app.** It must work on a real phone and in a desktop browser.
- **The full scenario must be demoable end to end** (§7). Mock data and fake computation are fine.
- **The two hi-fi screens must appear in the prototype and visibly match Figma.** Reviewers compare them side by side.
- **Public URL on Netlify, no login wall,** and it must open in any browser.
- **All text in English.**

---

## 2. Figma map

| Page          | What's there                                                                                                                                                        | Use it for                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Designs**   | Hi-fi **01 Home** and **02 Trip view**, the Main Nav, and a **System / Components** frame                                                                           | Visual language, tokens, component styling. Build these two screens pixel-faithfully.                             |
| **Wireflows** | Section **"Wireflow"**: screens **01–10** (some steps have two frames, e.g. 04 and 09), a caption above each, and connectors                                        | The scenario: screen order, content, states, and which element triggers which transition (follow the connectors). |
| **Working**   | **"Wireframe Components"**, section **"Wireflow working"** (the extended set) with purple **Notes**, and the **"Features and functionality that adds value"** group | The added-value screens, the extra states, and the designer's reasoning. Read the Notes.                          |

Steps for each screen:

1. Run `get_screenshot` and `get_design_context` on the frame.
2. Map what you get onto **our** components and tokens. Never paste generated absolute-positioned markup.
3. For the two hi-fi frames, compare your render against the Figma screenshot at 430 px wide before calling them done.

Get tokens from the file with `get_variable_defs` and the text styles. Expected roles (confirm in the file and use the file's values and names):

- **Colour:**
  - neutrals (light grey, white, charcoal);
  - an electric violet accent;
  - a lime **"needs your action"** colour, used for things the user must act on (Settle, Vote, unpaid, +);
  - plus whatever else the file defines.
- **Type:** Inter. The scale is Display 40/44, Title L 32/36, Title M 22/28, Title S 18/24, Headline 16/22, Body 16/24, Label 14/20, Body S 14/20, Caption 12/16, Caption Strong 12/16 and Micro 10/12.
- **Radius and spacing:** from the variables.

Put all of these into `tailwind.config.ts` as theme tokens, plus CSS variables in `globals.css`. Components must use token classes only, with no stray hex values or pixel sizes.

---

## 3. Stack

- **Next.js** (App Router, TypeScript, strict), **Tailwind CSS**.
- **Static export:** `output: 'export'` in `next.config`, so Netlify serves plain static files with no server functions.
- **State:** Zustand, one store for the scenario (§6–7), in memory only. A reload resets the demo, which is deliberate.
- **Motion:** Framer Motion for sheets, toasts, the map expansion and vote bars. Keep motion snappy, 150–300 ms, iOS-like.
- **Font:** Inter via `next/font/google`.
- **Icons:** export from Figma where they're custom. Otherwise use `lucide-react`, matched to the Figma icon style and weight.
- **Images:** export avatar and illustration assets from Figma into `/public`. Don't hotlink.
- No backend, no auth, no analytics.

Suggested structure:

```
app/
  layout.tsx            # DeviceShell + DemoPanel
  page.tsx              # Splash → Home
  trips/[tripId]/...    # trip view, polls, activity, settle
  polls/  groups/  ...
components/
  shell/                # DeviceShell, StatusBar, HomeIndicator, TabBar
  ui/                   # Button, Pill, Avatar, AvatarStack, Badge, Toggle, Sheet, Toast, Card…
  trip/ poll/ pay/ group/
data/seed.ts            # all mock data (§6)
store/scenario.ts       # Zustand store + actions (§7)
lib/money.ts            # pence-based arithmetic + £ formatting
```

---

## 4. Device shell and presentation

- **Desktop (viewport wider than 430 px):** a 430 × 932 phone frame centred horizontally and vertically on a neutral backdrop. Content scrolls **inside** the frame. The tab bar and sheets are positioned inside the frame, not the browser window.
- **Phone (viewport 430 px or narrower):** full-bleed, with no frame and no backdrop, using `100dvh`. Respect safe areas.
- **If the desktop viewport is shorter than 932 px,** let the page scroll. Don't scale the phone.
- **Fake iOS status bar:** it shows the **scenario clock** for the current step (§7), not the real time.
- **Home indicator** at the bottom, as in Figma.
- **Sheets** slide up inside the frame over a dimmed backdrop, and close on ✕, on a backdrop tap or by dragging down.

### Demo panel (desktop only, outside the phone)

The panel lets a PM follow the story without help. It sits to the left of the phone and should be visually quiet.

- **Title:** "Last night in Lisbon".
- **Scenario steps 01–10:** use the wireflow captions, shortened. The current step is highlighted, and clicking a step jumps there with the correct state.
- **Phone indicator:** "Ari's phone" or "Charlie's phone".
- **Reset demo** button.

On a real phone, hide the panel. Step changes are signalled by short in-frame **scene cards** instead, e.g. "Charlie's phone · 16:30" or "Later that evening · 22:15", shown for about 1.2 s or until tapped.

The core flow must also work purely by tapping inside the phone. The panel is an aid, not a requirement.

### Splash

When the app first loads (and after Reset), show the **Loading screen** frame from the Working page for about 1.5 s, or until tapped, then land on **01 Home**. Ari is already signed in, so there is no auth screen. Don't show it on in-app navigation.

---

## 5. Product rules (decided; implement exactly)

- **Users:**
  - Ari is the signed-in user and a _participant_. Jaimie organised the Lisbon trip.
  - The **poll creator becomes the organiser of the activity it creates**. That's why Ari can close her poll and edit and log Belcanto.
  - The participant view of an activity is read-only apart from **Invite** (see the "Activity view – Read only" frame).
- **Guests:**
  - Ren is invited as a **guest**. Guests are never added to anything automatically; they're opted in.
  - Turning on **"Send poll to guests"** sends the poll to guests _and_ opts them into the winning activity, which is why Belcanto shows **7 coming**.
  - Ren is **Pending** on step 03 and accepts straight after, so from step 04 she counts as "1 guest".
- **Polls:**
  - Votes can be changed until the poll closes (WhatsApp-style): tap another option to move your vote, tap your choice again to take it back.
  - A poll closes at its timer **or** when its creator closes it. It does **not** close when everyone has voted; instead the creator sees an "All N voted · X leads" nudge with a lime **Close poll** button. (Changed from auto-close at the designer's request.)
  - The creator (or the trip organiser) can **Close poll** manually.
  - When it closes, the winner is added to the itinerary as an activity "shell" with a **NEW** badge and an **"Add activity details"** affordance, and a toast appears: **"'Belcanto' won - added to itinerary"**.
  - A closed poll moves to **Closed** with the line "'X' won · in Itinerary" or "in Stays".
- **Payments:**
  - The amounts on itinerary and stay cards are **Ari's share**.
  - **Pay as you go:**
    - "Pay share" pays one item;
    - "Pay activity shares" and "Pay stay shares" pay everything unpaid of that type;
    - **"Settle trip £X"** pays everything outstanding, net of what others owe Ari.
  - Each payment marks its items **Paid**, reduces the Settle total, and decrements "N payments due".
- **Bill statuses on the activity (08):**
  - **Bill:** Ari paid the bill.
  - **Paid:** this person has already paid Ari back.
  - **Owes:** this person still owes Ari.
  - "You are owed" is the sum of the **Owes** rows.
- **Settling:** debts are consolidated to minimise transfers. Ari makes **1 transfer instead of 5**, to Jaimie, and the people who owe Ari for Belcanto pay Jaimie instead.
- **Map:**
  - Tapping the trip-view map expands it to full screen.
  - Tapping a pin navigates **straight to** that activity or stay screen. There is no pin-selected state.
  - The collapse control returns to the trip view.
- **Not designed, so stub them:**
  - **Search, Payments and Profile tabs:** show a simple, on-brand "Coming soon" screen with the tab bar intact. They must never be blank or broken.
  - **"Add group" chip on Invite (03):** show it as **visibly inactive** (disabled styling, no action).
  - **Not built at all:** trip creation, real payments, real contacts, receipt OCR. Fake the scan with the existing receipt thumbnails.

---

## 6. Mock data (`data/seed.ts`)

Store money in **integer pence** and format as `£1,080.99`. Every number below must reconcile, so don't round mid-calculation.

### People

| id      | Name           | Role on Lisbon trip         | Status                          |
| ------- | -------------- | --------------------------- | ------------------------------- |
| ari     | You (Ari)      | participant, signed-in user | Yes                             |
| charlie | Charlie Brooke | member                      | Yes                             |
| jaimie  | Jaimie Garcia  | **trip organiser**          | Yes                             |
| matteo  | Matteo Lorenzo | member                      | Yes                             |
| nic     | Nic Noble      | member                      | Yes                             |
| tim     | Tim Lee        | member                      | Yes                             |
| aylin   | Aylin Kaya     | invited                     | Pending (not coming)            |
| ren     | Ren Lindqvist  | **guest**                   | Pending → accepts after step 03 |

- **Contacts not on the trip:** Jon Cohen, Tristan Thomas, Maria Cortez.
- **Lisbon counts:**
  - before Ren: 8 invited (after Ren's invite), **6 coming**;
  - after Ren accepts: 6 coming + **1 guest** = 7 people.
- **Who's coming line:** "You, Charlie, Jaimie +3 others" (6) → "+4 others" once Ren has joined. On Charlie's phone, Charlie is "You": "You, Ren, Jaimie +4 others".

### Trips (Home)

- **Current trip:**
  - **Lisbon**, 17–24 Oct 2026, organised by Jaimie;
  - "1 live poll" / "2 payments due" (these values change as the scenario runs).
- **Pending invite:** "You're invited to Dubrovnik with Steff +5 more" with an **Accept Trip** button.
- **Upcoming trips** (all organised by Jaimie, avatar overflow +2):
  - Milan, 11–13 Dec 2026;
  - Kraków, 5–7 Feb 2027;
  - Sardinia, 5–12 June 2027.
- **Needs your vote card:** "Fado in Alfama after dinner?", "Poll doesn't expire", "5 of 6 voted - you haven't voted", **Vote**.

### Lisbon itinerary (Ari's shares)

| Date   | Title                          | Type   | Time        | Ari's share          | Coming | State                              |
| ------ | ------------------------------ | ------ | ----------- | -------------------- | ------ | ---------------------------------- |
| 19 Oct | Tasca Baldracca                | Dinner | 19:00–21:00 | £92.49               | 5      | Paid                               |
| 20 Oct | O Velho Eurico                 | Lunch  | 12:00–13:30 | £60.00               | 6      | Paid                               |
| 22 Oct | Cervejaria Ramiro              | Dinner | 19:30–21:15 | £110.50              | 6      | Paid                               |
| 24 Oct | Pigmeu                         | Drinks | 13:00–14:30 | £30.99               | 5      | **Pay share**                      |
| 24 Oct | _Belcanto_ (added by the poll) | Dinner | 18:30       | £82.15 after logging | 7      | NEW, then Paid (Ari paid the bill) |

### Stay

**Antiga Casa Pessoa**, 17 Oct → 24 Oct, 7 nights, 6 beds, check-in 15:00, 6 coming, Ari's share **£1,050.00**, **Pay share**.

### Polls

- **Live:**
  - "Fado in Alfama after dinner?": Yes 5 / No 0, no expiry.
  - The new dinner poll (§7), once created.
- **Closed:**
  - Lisbon: "Seafood night on the 22nd?", 'Yes' won · in Itinerary, closed 22 Oct 2026.
  - Lisbon: "Where should we stay?", 'Antiga Casa Pessoa' won · in Stays, closed 2 Jan 2026.
  - Vietnam (2–16 Aug 2025): "Where to eat on Thursday night?", 'Hoi An Riverside' won · in Itinerary, closed 14 Aug 2025.
  - Vietnam: "Where should we stay in Hoi An?", 'Dechiu' won · in Stays, closed 14 Aug 2025.

### The dinner bill (Belcanto)

- **Address:** Rua Serpa Pinto 10A, 1200-445 Lisboa, Portugal. Date 24 Oct 2026, 18:30, type Dinner, 7 attending.
- **Items:**
  - Food & soft drinks: **£412.09**, split among all 7;
  - Wine: 3 bottles: **£116.40**, split among whoever isn't excluded.
- **Total:** £528.49.
- **Payment status:** Ari = Bill; Jaimie, Matteo and Tim = Paid; Charlie, Nic and Ren = Owes.
- **After Ren and Nic are excluded from the wine:**
  - food £58.87 each (7 ways), wine £23.28 each (5 ways);
  - full share **£82.15**; Nic and Ren **£58.87**;
  - **You are owed £199.89** (Charlie £82.15 + Nic £58.87 + Ren £58.87).
- **Before any exclusion:** wine is split 7 ways. Compute it live, don't hard-code it.

### Settle

Ari's Lisbon balance:

|                                 | Amount      |
| ------------------------------- | ----------- |
| Stay, Antiga Casa Pessoa        | £1,050.00   |
| Drinks, Pigmeu                  | £30.99      |
| Owed to you, Dinner at Belcanto | −£199.89    |
| **You pay**                     | **£881.10** |

- Before the bill is logged, **Settle trip £1,080.99**.
- Ari's transfer goes **to Jaimie**: "1 transfer instead of 5". Supporting line: "Charlie, Ren and Nic will pay Jaimie what they owe you for Belcanto, so everyone settles in one go."
- **Pay with:** Apple Pay, Bank transfer (Zero fees), saved Visa ···· 7492, New card. CTA **Settle £881.10**.
- **Settled screen:**
  - "You've settled, Ari!";
  - Transfers: 5 instead of 23;
  - Your trip total: **£1,426.13**;
  - "3 of 5 transfers done": You paid Jaimie £881.10, Nic paid Jaimie £1,108.87, Ren paid Jaimie £58.87, "+ 2 more";
  - **Back to Lisbon trip**.

### Groups (added value)

- **Your groups:**
  - **Intrepid travellers**: created by you, 5 members, 6 trips together. Members: You, Aylin Kaya (Pending), Adam Bright, Jaimie Garcia, Even Olson, Nic Noble ("6 invited · 5 joined"). Trips together: Vietnam 2–16 Aug 2025, Peru 4–25 May 2024, Cuba 4–18 Feb 2023 (organised by Jaimie), then "View all".
  - **Family**: created by you, avatar overflow +5, 7 trips together.
- **Other groups:**
  - **Beach brigade**: created by Jon, +2, 2 trips.
  - **Hen dos**: created by Ren, +10, 2 trips.
- The bottom link is **Archive**. Groups are archived or deleted from Manage group's ••• menu.

Take any other copy you need from the Figma frames verbatim.

---

## 7. Scenario script (the core journey)

The status-bar clock follows the times shown on the wireflow frames for each step. Use those values; if a frame and this list disagree, the frame wins.

| Step                      | Phone       | What the user does                                                                            | What the app must do                                                                                                                                                                                                                                                                                                         |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01 Home**               | Ari         | Lands after the splash and taps the Lisbon card                                               | Hi-fi Home. Live poll and payments-due counts come from the store.                                                                                                                                                                                                                                                           |
| **02 Trip view**          | Ari         | Taps **Invite** on "Who's coming"                                                             | Hi-fi Trip view. Shows Settle trip £1,080.99 and the Polls / Itinerary / Stays counts.                                                                                                                                                                                                                                       |
| **03 Invite Ren**         | Ari         | Taps **Add to trip** on Ren and marks her as **Guest**                                        | Ren → Invited / Pending, Guest. "8 invited · 6 coming". Then Ren accepts, with a short toast or state change. Closing returns to the trip view with "+4 others · 1 guest".                                                                                                                                                   |
| **04 Create poll**        | Ari         | Opens **New poll** from the trip view (or from the trip's Polls page)                         | Form pre-filled as in Figma for the demo: "Where should we eat tonight?", Today 18:30, Belcanto / O Velho Eurico (Traditional) / Cervejaria Ramiro (Seafood), Send poll to guests **on**, Close automatically **on**, **2 hrs**. Fields stay editable. **Create poll** → step 05.                                            |
| **05 Notification**       | **Charlie** | Taps the push notification                                                                    | Scene card "Charlie's phone". iOS-style banner: "Ari started a poll - Lisbon", "Where should we eat tonight?", the options, "Closes in 2 hrs". Polls badge is 2. Tapping it → step 06.                                                                                                                                       |
| **06 Vote, live results** | Ari         | Watches the votes come in, votes **Belcanto** (can change it), then taps **Close poll**        | Scene card "Back on Ari's phone · 17:52". Vote sheet. Votes **animate in live** (~600 ms apart) until Belcanto 4, Eurico 0, Ramiro 2, "6 of 7 voted", "Closes in 38 min". The **leading option updates in real time**: bar widths and highlight animate as the lead changes. Then Ari taps Belcanto: "All 7 voted · Belcanto leads" and a lime Close poll button appear. |
| **07 Winner added**       | Ari         | Taps the new Belcanto card                                                                    | Ari closes the poll (status bar 17:53). The sheet closes and the toast shows "'Belcanto' won - added to itinerary". Belcanto slides into the itinerary with **NEW**, 24 Oct 18:30, 7 coming, "Add activity details". Itinerary count goes 4→5, Polls count 2→1, and the poll moves to Closed. |
| **08 Log dinner**         | Ari         | Scans or adds the receipt, taps **Nic** and **Ren** on the Wine row, then taps back            | Scene card "Later that evening · 22:15". Edit-activity view with the bill items. Tapping an avatar on an item toggles exclusion (dimmed avatar). **Per-person shares, "You are owed" and the split labels recalculate live.** No update button: changes autosave ("Saved"); leaving logs the bill and toasts "'Belcanto' updated - Charlie, Nic & Ren notified". (Changed at the designer's request; wireflow updated.) |
| **09 Settle**             | Ari         | Taps **Settle trip £881.10** and picks a payment method                                       | Trip view now shows Belcanto £82.15 Paid and **Settle trip £881.10**. The settle sheet shows the breakdown and the simplified transfer. **Settle £881.10** → step 10.                                                                                                                                                        |
| **10 All squared up**     | Ari         | Taps **Back to Lisbon trip**                                                                  | Confirmation screen. Stay and Pigmeu become Paid, payments due → 0, and the Settle button is replaced by a settled state.                                                                                                                                                                                                    |

Things that must never happen in the demo:

- a dead tap on anything that looks tappable;
- a number that doesn't match §6;
- a blank screen;
- a layout that overflows the 430 px frame.

---

## 8. Added-value features (build after the core is approved)

Build these from the Working page frames and their Notes. In priority order:

1. **Expandable map:** the "Trip view – Map expanded" frame. Tap map → animate to full screen, pins → activity or stay screens.
2. **Polls:**
   - Trip-level Polls page: live polls plus Closed links.
   - **"All polls"** from the Polls tab: live polls across trips, each labelled with its trip, then "View closed polls".
   - **"Closed polls"**, with "Archive".
   - Vote, View votes and Close poll behave the same everywhere. Use **one PollCard component**.
3. **Groups:**
   - Home **Trips / Groups** toggle → the Groups list.
   - **Manage group:** members, invite, trips together, and Add group image (opens the attach sheet).
4. **Partial payments:**
   - "Pay share" on any card, plus "Pay activity shares" / "Pay stay shares", **reuse the settle sheet** with that amount.
   - On success, the items become Paid and the Settle total and payments due update.
   - These must stay mathematically consistent with step 09. If Ari pays the Pigmeu or stay share early, the Settle total drops by that amount.

Also implement the extra states shown on the Working page where they support the story:

- the activity read-only view (participant);
- the home view after the trip;
- the invite states.

---

## 9. Quality bar

- **Visual fidelity:** the two hi-fi screens should match Figma when viewed side by side at 430 px, including spacing, type, colour, radius, shadows and imagery.
- **Consistency:** every other screen is assembled from the same components and tokens, so it looks like the hi-fi.
- **Usability:**
  - minimum tap target 44 × 44 pt;
  - visible pressed states;
  - clear disabled states;
  - text contrast of at least 4.5:1 for body text.
- **Accessibility:** semantic buttons and links, `aria-label`s on icon buttons, focus-visible styles, and `prefers-reduced-motion` respected.
- **Performance:** no layout shift on load, images sized, and fonts preloaded via `next/font`.
- **Metadata:** set the `<title>` to "TripUp prototype". Add a favicon and an OG image (a hi-fi Home screenshot) so the link previews well.

---

## 10. How to approach the build (phases; stop for review after each)

1. **Scaffold:**
   - Next.js + Tailwind + TypeScript, static export, `netlify.toml`;
   - lint and format;
   - deploy an empty shell to Netlify early, so hosting is proven on day one.
2. **Tokens and shell:**
   - pull variables and text styles from Figma into Tailwind;
   - DeviceShell, StatusBar, TabBar, Sheet, Toast, DemoPanel, Splash.
3. **Components:** build each one from the Figma components and their variants or states (buttons, pills, avatars and stacks, badges, cards, toggles, poll option rows, pay states). Add a hidden `/dev/components` page showing every variant, for review.
4. **Hi-fi screens:** 01 Home and 02 Trip view, pixel-faithful. Compare against `get_screenshot` and list any deviations.
5. **Core journey:** steps 03–10 with the store, scenario clock, scene cards and the live behaviours from §7.
6. **Added value:** §8, in priority order.
7. **Polish:**
   - motion, empty and disabled states;
   - the stub tabs;
   - a full click-through on a real phone and on desktop;
   - confirm every number against §6.
8. **Ship:**
   - production deploy;
   - a README with the live URL, how to run locally, and a short "what's real vs faked" list;
   - tag the release.

After submission, **don't change the live URL or the repo**. The brief forbids changes after submission.

---

## 11. Netlify

- `next.config`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`.
- `netlify.toml`: `command = "npm run build"`, `publish = "out"`.
- Dynamic routes need `generateStaticParams` (the trip ID is fixed to `lisbon`, plus any group IDs).
- Make sure the site is public, with no password protection and no Netlify auth.
