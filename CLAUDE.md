# Ballard CrossFit Website

## Stack
- Static HTML/CSS/JS site deployed on Vercel
- Repo: github.com/kwliang1/bcf-marketing
- Branch: main (auto-deploys to Vercel)
- Domain: ballardcrossfit.com (DNS on GoDaddy)
- Class booking: ChalkItPro (app.chalkitpro.com, gym ID 964)

## Structure
- `index.html` — single-page homepage with sections: hero, about, programs, schedule, coaches, testimonials, instagram, membership, drop-in, contact
- `schedule.html` — class schedule page (served at /schedule via cleanUrls)
- `css/style.css` — main styles
- `css/schedule.css` — schedule page styles
- `js/main.js` — navbar, mobile menu, scroll animations, signup modal, coach lightbox, gym gallery lightbox
- `js/schedule.js` — schedule page logic
- `vercel.json` — redirects (old Squarespace URLs, wod subdomain), headers, caching
- `images/` — all assets self-hosted (migrated from Squarespace CDN)

## SEO
- JSON-LD structured data (GymOrSportsActivityLocation) in index.html head
- Open Graph + Twitter Card meta tags on both pages
- Canonical URLs on both pages
- robots.txt and sitemap.xml at root
- 301 redirects for 9 old Squarespace URLs → homepage hash anchors
- wod.ballardcrossfit.com redirects to /schedule

## Business Info
- Address: 6419 15th Ave NW, Seattle, WA 98107
- Phone: (206) 383-2020
- Email: paige@ballardcrossfit.com
- Owner: Paige Wager
- Hours: Mon-Fri 6am-12pm & 3pm-8pm, Sat 7am-12pm, Sun closed

## Coaches
Elise Matheson, Aaron Smith ("Smiles"), Adam Marsh, Scott Winges, Sarah Liang, Paige Wager (owner), Rick Meldrum, JT Brogan, Kirit Thadaka
