// Source of truth for the static, single-purpose calculator pages that exist
// at their own URLs (e.g. /vacation-savings-calculator) for search traffic.
// Each entry drives three things that must stay in sync:
//   1. the page's <head> (title/description/canonical/OG + FAQ JSON-LD) —
//      built in src/entry-server.jsx
//   2. the visible page — src/pages/seoCalculators/SeoCalculatorPage.jsx
//   3. the sitemap — scripts/prerender.js
//
// Keep this file plain data with no JSX or non-node imports: scripts/prerender.js
// imports it directly in Node, outside the Vite bundle.

// `preset` seeds the embedded calculator: `amount` (dollars), `months` until
// the target date, and the default pay frequency. `months` is also used for
// the "rough example" line, computed with plain division — no calendar — so it
// renders identically on the server and client.
export const SEO_CALCULATORS = [
  {
    slug: 'savings-goal-calculator',
    navLabel: 'Savings goal calculator',
    title: 'Savings Goal Calculator — How Much to Save per Week or Month',
    description:
      'Enter any savings goal and a target date to see how much to set aside per day, week, month, or paycheck to reach it on time. Free, no sign-up, private.',
    h1: 'Savings goal calculator',
    lede:
      "Tell it your target amount and the date you want the money by. It divides what's left by the time you have and shows the amount to set aside each day, week, month, or paycheck — no interest assumptions, no account required.",
    amountLabel: 'Savings goal',
    amountPlaceholder: '5,000',
    preset: { amount: 5000, months: 12, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'How the calculation works',
        p: "Take your goal amount, subtract what you've already saved, and divide the rest by the number of days between today and your target date. That's your daily amount. The weekly, monthly, and per-paycheck figures are the same daily number scaled up. There's no compounding or interest — it's the plain amount to put aside on a steady schedule.",
      },
      {
        h2: 'Picking a target date you can hit',
        p: "If the weekly number feels too high, move the date out and recalculate — a few extra months usually brings it down to something comfortable. If a wider period like 'per month' drops out of the results, that means your target date is closer than that period, so the shorter windows are the honest way to look at it.",
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month to reach my goal?',
        a: 'Divide the amount you still need by the number of months until your target date. $6,000 in 12 months is $500 a month. This calculator does that for you and also shows the weekly and per-paycheck equivalents.',
      },
      {
        q: 'Does this account for interest or investment growth?',
        a: "No. It uses simple division so the number is something you can act on directly. If your savings earn interest, you'll reach the goal a little early — treat that as a cushion.",
      },
      {
        q: 'Is my information saved anywhere?',
        a: "Everything stays in your browser. There's no account, no server, and nothing is shared. Open the full planner to keep several goals and track progress — still stored only on your device.",
      },
    ],
  },
  {
    slug: 'how-much-to-save-per-paycheck',
    navLabel: 'How much to save per paycheck',
    title: 'How Much to Save per Paycheck to Reach a Goal',
    description:
      "Pick your goal, target date, and how often you're paid to see exactly how much of each paycheck to set aside. Works for weekly, biweekly, or monthly pay.",
    h1: 'How much to save per paycheck',
    lede:
      'Set your goal, your deadline, and your pay schedule. It works out the share of each paycheck that gets you there on time — the amount to move to savings the day you are paid.',
    amountLabel: "What you're saving for",
    amountPlaceholder: '4,000',
    preset: { amount: 4000, months: 9, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'Why per-paycheck is easier to stick to',
        p: "Saving right when money lands, before it's spent, is the habit that actually holds. A weekly or monthly target can drift; 'this much every payday' lines up with how you're actually paid. Set it as an automatic transfer and the goal takes care of itself.",
      },
      {
        h2: 'Matching the math to your pay schedule',
        p: 'Choose weekly, biweekly, or monthly and the per-paycheck figure adjusts. Biweekly means 26 paychecks a year, not 24, so the per-check amount is a little lower than dividing by two months would suggest. If your target date is very close, the calculator falls back to a per-day number so it stays realistic.',
      },
    ],
    faqs: [
      {
        q: 'How do I figure out how much of each paycheck to save?',
        a: 'Divide the amount you still need by the number of paychecks left before your target date. Enter your goal and pay frequency above and it calculates that for you.',
      },
      {
        q: 'I get paid biweekly — how many paychecks is that?',
        a: 'About 26 a year, or roughly 2.17 a month. Two months of biweekly pay is about 4.3 paychecks, not 4, which is why dividing by pay period gives a slightly smaller number than dividing by month.',
      },
      {
        q: 'What if the amount is more than I can spare each payday?',
        a: 'Push the target date further out and recalculate. Every extra pay period lowers the per-check amount.',
      },
    ],
  },
  {
    slug: 'vacation-savings-calculator',
    navLabel: 'Vacation savings calculator',
    title: 'Vacation Savings Calculator — Save for a Trip by Your Travel Date',
    description:
      'Add up your trip cost and your departure date to see how much to save each week or paycheck to have it all before you go. Free and private.',
    h1: 'Vacation savings calculator',
    lede:
      "Put in what the trip will cost and when you're leaving. It shows the weekly, monthly, or per-paycheck amount that gets the whole thing paid for before you pack.",
    amountLabel: 'Trip cost',
    amountPlaceholder: '3,000',
    preset: { amount: 3000, months: 8, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'Estimating the trip cost',
        p: 'Add flights or fuel, lodging, food, local transport, activities, and a bit for souvenirs and the unexpected. A round number slightly above your rough estimate is a good target — coming home without travel debt is worth the small buffer.',
      },
      {
        h2: 'Working back from your travel date',
        p: "Your target date is the day you leave, or a week or two earlier if you want spending money ready. The calculator divides the cost by the time until then. Booking flights early often means a deposit now and the balance later — lower the goal amount as you pay pieces off.",
      },
    ],
    faqs: [
      {
        q: 'How much should I save per month for a vacation?',
        a: 'Divide the total trip cost by the number of months until you leave. A $2,400 trip eight months out is $300 a month. Enter your numbers above for the weekly and per-paycheck versions.',
      },
      {
        q: 'When should I start saving for a trip?',
        a: "As soon as you have a rough date and cost. The earlier you start, the smaller each week's amount — starting a year out instead of six months roughly halves it.",
      },
      {
        q: 'Should I include a buffer?',
        a: "Yes. Add 10–15% over your estimate for exchange rates, price changes, and things you'll want to do once you're there.",
      },
    ],
  },
  {
    slug: 'wedding-savings-calculator',
    navLabel: 'Wedding savings calculator',
    title: 'Wedding Savings Calculator — How Much to Save Before the Date',
    description:
      'Enter your wedding budget and date to see how much to set aside each month or paycheck. Split it between two people to see each share.',
    h1: 'Wedding savings calculator',
    lede:
      'Enter your budget and the wedding date. It shows the monthly, weekly, or per-paycheck amount to have it covered in time — and if two of you are saving, halve the number for each share.',
    amountLabel: 'Wedding budget',
    amountPlaceholder: '15,000',
    preset: { amount: 15000, months: 18, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'Building the budget',
        p: "Venue and catering are usually the largest pieces, then photography, attire, rings, flowers, music, and stationery. Vendors typically take a deposit up front and the balance in the month or two before the date, so your timeline is really a series of smaller deadlines — the calculator's steady number keeps you ahead of all of them.",
      },
      {
        h2: 'Saving as a couple',
        p: 'If both partners contribute, take the per-week or per-paycheck figure and split it by whatever ratio you have agreed on. Two people each saving half of a $12,000 goal over 15 months is around $400 a month each.',
      },
    ],
    faqs: [
      {
        q: 'How much should we save each month for our wedding?',
        a: 'Divide your total budget by the months until the wedding. $18,000 over 18 months is $1,000 a month between you. Enter your budget and date above for the exact figures.',
      },
      {
        q: 'How far ahead should we start saving?',
        a: 'Most couples plan 12–18 months out. A longer runway gives you a smaller monthly amount and room for deposits as you book vendors.',
      },
      {
        q: 'What if family is contributing?',
        a: "Subtract any contributions you're confident about from the budget first, then calculate on the amount that's actually yours to save.",
      },
    ],
  },
  {
    slug: 'baby-savings-calculator',
    navLabel: 'Baby savings calculator',
    title: 'Baby Savings Calculator — How Much to Save Before the Due Date',
    description:
      'Add up your one-time baby costs and your due date to see how much to save each week or paycheck to be ready before the baby arrives.',
    h1: 'Baby savings calculator',
    lede:
      'Put in what you expect the first year to cost up front and your due date. It shows the weekly, monthly, or per-paycheck amount to have that set aside before the baby is here.',
    amountLabel: 'Amount to save for baby',
    amountPlaceholder: '5,000',
    preset: { amount: 5000, months: 7, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'What to add up',
        p: 'Focus on the one-time and upfront costs: the crib, car seat, stroller, and other gear; a stock of newborn clothing and diapers; hospital or birth-center out-of-pocket costs; and any nursery changes at home. Leave out ongoing monthly costs like childcare — those come out of future income, not this fund.',
      },
      {
        h2: 'Working back from the due date',
        p: "Set your target date a few weeks before the due date so the money is in place while you're settling in, not something to think about afterward. Borrowed or hand-me-down gear lowers the number — adjust the goal down as friends and family offer things.",
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month before the baby comes?',
        a: 'Divide your upfront baby costs by the months until your due date. $4,000 over eight months is $500 a month. Enter your own figure above for the weekly and per-paycheck amounts.',
      },
      {
        q: 'What does this calculator not cover?',
        a: 'Ongoing costs like childcare, formula, and diapers month after month, plus any income change during parental leave. Those belong in your regular budget, not a one-time savings goal.',
      },
      {
        q: 'When should we start saving?',
        a: 'As early in the pregnancy as you can. Starting at eight months out instead of four roughly halves the weekly amount.',
      },
    ],
  },
  {
    slug: 'college-savings-calculator',
    navLabel: 'College savings calculator',
    title: 'College Savings Calculator — How Much to Save per Month',
    description:
      "Enter a savings target and the year college starts to see how much to set aside each month or paycheck. Simple division — pair it with a 529 for growth.",
    h1: 'College savings calculator',
    lede:
      'Enter the amount you want saved and the date the first tuition bill is due. It shows the steady monthly, weekly, or per-paycheck amount to get there.',
    amountLabel: 'College savings target',
    amountPlaceholder: '30,000',
    preset: { amount: 30000, months: 60, payFrequency: 'monthly' },
    body: [
      {
        h2: 'Setting a target you can actually save',
        p: "Full sticker-price tuition is out of reach for most families to save in cash, and that's fine — pick a share you want to cover from savings (say the first year, or half of a state-school total) and let grants, scholarships, current income, and student contributions handle the rest. The number you choose is the goal here.",
      },
      {
        h2: 'Simple division vs. a 529 plan',
        p: 'This calculator uses plain division with no investment growth, which suits shorter timelines and keeps the number honest. If college is many years away, a tax-advantaged 529 account can add meaningful growth — use the amount here as your contribution target and expect to arrive early if the market cooperates.',
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month for college?',
        a: 'Divide your savings target by the months until college starts. $30,000 over five years is $500 a month. Enter your own numbers above for the weekly and per-paycheck versions.',
      },
      {
        q: 'Should I use a 529 plan?',
        a: "A 529 offers tax-free growth for education costs and is worth considering for timelines of several years or more. This tool gives you the contribution amount; the 529 is where you'd put it.",
      },
      {
        q: 'Do I need to save the full cost of college?',
        a: 'No. Most families cover college from a mix of savings, income during the college years, financial aid, and scholarships. Save toward the share you want to have in hand.',
      },
    ],
  },
  {
    slug: 'emergency-fund-calculator',
    navLabel: 'Emergency fund calculator',
    title: 'Emergency Fund Calculator — How Much to Save Each Month',
    description:
      'Set a target of three to six months of expenses and a date, and see how much to save each week or paycheck to build your emergency fund.',
    h1: 'Emergency fund calculator',
    lede:
      "Decide how many months of expenses you want set aside and when you'd like it in place. It shows the steady weekly, monthly, or per-paycheck amount to get there.",
    amountLabel: 'Emergency fund target',
    amountPlaceholder: '9,000',
    preset: { amount: 9000, months: 12, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'Setting your target',
        p: 'A common target is three to six months of essential expenses — rent or mortgage, food, utilities, insurance, minimum debt payments, transport. Add those up and multiply by the number of months you want covered. If that feels far off, start with a smaller milestone like one month or $1,000 and set the date for that first.',
      },
      {
        h2: 'Where to keep it',
        p: "An emergency fund works best somewhere separate from your everyday account but still reachable within a day or two — a high-yield savings account is the usual choice. This calculator doesn't count interest, so any yield you earn just gets you there sooner.",
      },
    ],
    faqs: [
      {
        q: 'How much should I have in an emergency fund?',
        a: 'Three to six months of essential expenses is the common guideline. Someone with $3,000 a month in essentials would aim for $9,000–$18,000.',
      },
      {
        q: 'How long should it take to build one?',
        a: "There's no fixed answer — pick a date that keeps the monthly amount sustainable. Twelve to twenty-four months is realistic for many people building from a small base.",
      },
      {
        q: 'Should I save an emergency fund or pay off debt first?',
        a: 'A common approach is a small starter fund (about one month or $1,000) first, then high-interest debt, then the full fund. Set the starter amount as your goal here to begin.',
      },
    ],
  },
  {
    slug: 'house-down-payment-savings-calculator',
    navLabel: 'House down payment calculator',
    title: 'House Down Payment Savings Calculator',
    description:
      'Enter your target down payment and the date you want to buy, and see how much to save each month or paycheck to be ready.',
    h1: 'House down payment savings calculator',
    lede:
      "Put in the down payment you're aiming for and roughly when you want to buy. It shows the monthly, weekly, or per-paycheck amount to have it ready — closing costs included if you add them in.",
    amountLabel: 'Down payment target',
    amountPlaceholder: '40,000',
    preset: { amount: 40000, months: 36, payFrequency: 'monthly' },
    body: [
      {
        h2: 'Choosing a down payment amount',
        p: 'Down payments commonly range from 3% to 20% of the price. Twenty percent lets you skip mortgage insurance, but many buyers put down less and adjust. Decide on a price range, pick your percentage, and add a few thousand for closing costs and moving — that total is your goal here.',
      },
      {
        h2: 'Long timelines and where to keep the money',
        p: 'Down payment saving often runs three to five years. This calculator uses plain division with no growth assumption; if you keep the money in a high-yield savings account or short-term instrument, treat any interest as getting ahead of schedule. Money you need within a couple of years usually should not go into the stock market.',
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month for a house down payment?',
        a: 'Divide your target down payment by the months until you want to buy. $36,000 over three years is $1,000 a month. Enter your own numbers above.',
      },
      {
        q: 'Should I include closing costs?',
        a: "Yes — add roughly 2–5% of the purchase price to your goal so you're not caught short at closing.",
      },
      {
        q: 'How much house can that down payment cover?',
        a: "At 10% down, a $40,000 down payment corresponds to about a $400,000 home; at 20%, about $200,000. Your lender's pre-approval gives you the real range.",
      },
    ],
  },
  {
    slug: 'car-savings-calculator',
    navLabel: 'Car savings calculator',
    title: 'Car Savings Calculator — Save for a Car or Down Payment',
    description:
      "Enter the price or down payment you're aiming for and your target date to see how much to save each week or paycheck.",
    h1: 'Car savings calculator',
    lede:
      "Whether you're buying outright or saving a down payment, enter the amount and the date you want it by. It shows the weekly, monthly, or per-paycheck amount to get there.",
    amountLabel: 'Amount to save',
    amountPlaceholder: '8,000',
    preset: { amount: 8000, months: 15, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'Buying outright vs. a down payment',
        p: 'Paying cash for a used car means saving the full price and skipping interest entirely. Financing means saving a down payment — often 10–20% of the price — plus tax, title, and registration. Decide which you are doing and set the goal amount to match.',
      },
      {
        h2: "Don't forget the extras",
        p: 'Add sales tax, registration, and any immediate maintenance or insurance changes to your target. A slightly high round number leaves room for these so the car does not arrive with a surprise bill attached.',
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month for a car?',
        a: 'Divide the price or down payment by the months until you want to buy. $9,000 over 15 months is $600 a month. Enter your figures above for weekly and per-paycheck amounts.',
      },
      {
        q: 'How much should a car down payment be?',
        a: 'A common guideline is 20% down on a new car and 10% on a used one, which lowers your loan and monthly payment. Saving more shortens the loan further.',
      },
      {
        q: 'Is it better to save up and pay cash?',
        a: 'Paying cash avoids all loan interest and keeps your monthly budget clear. If that means a longer wait, a down payment now plus a short loan is a reasonable middle path.',
      },
    ],
  },
  {
    slug: 'christmas-savings-calculator',
    navLabel: 'Christmas savings calculator',
    title: 'Christmas Savings Calculator — Save for the Holidays by December',
    description:
      'Set your holiday spending total and start now to see how much to save each week or paycheck to reach December without the credit card.',
    h1: 'Christmas savings calculator',
    lede:
      'Add up what you expect to spend on gifts, travel, food, and hosting, then set your date for early December. It shows the weekly or per-paycheck amount to have it all set aside before the season starts.',
    amountLabel: 'Holiday spending total',
    amountPlaceholder: '1,200',
    preset: { amount: 1200, months: 6, payFrequency: 'biweekly' },
    body: [
      {
        h2: 'What to include',
        p: 'Gifts are only part of it — add travel, food and drink for gatherings, decorations, cards and postage, tips, and any donations you make this time of year. Listing it out now usually lands higher than a guess, and that is the number worth saving toward.',
      },
      {
        h2: 'Start early, finish before December',
        p: 'Set your target date to late November or early December so the money is ready before the shopping starts, not arriving in January as a card bill. Starting in the summer means a small weekly amount; starting in November means a large one.',
      },
    ],
    faqs: [
      {
        q: 'How much should I save each month for Christmas?',
        a: 'Divide your total holiday budget by the months between now and December. A $1,200 budget over six months is $200 a month. Enter your own total above.',
      },
      {
        q: 'When should I start a Christmas savings fund?',
        a: "January isn't too early. Spreading the same total over eleven months instead of three cuts the monthly amount by roughly two-thirds.",
      },
      {
        q: 'How do I keep from dipping into it?',
        a: 'Keep it in a separate savings account and set an automatic transfer for the per-paycheck amount so it builds without a monthly decision.',
      },
    ],
  },
]

// Match a URL path ("/vacation-savings-calculator", with or without slashes)
// to its registry entry. Returns null for anything that isn't one of these
// pages, so callers fall through to the normal app.
export function findSeoCalculator(pathname) {
  const slug = String(pathname || '').replace(/^\/+|\/+$/g, '')
  if (!slug) return null
  return SEO_CALCULATORS.find((c) => c.slug === slug) || null
}
