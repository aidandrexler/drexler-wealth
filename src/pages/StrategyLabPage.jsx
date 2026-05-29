import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { LAYER_SITUATION_SUBITEMS } from '../data/architectureSituationSubitems'
import './StrategyLabPage.css'

const CALIBRATION_SYSTEM = {
  INSURANCE: { level: 1, color: '#1A4A2E', label: 'Insurance Review' },
  TITLING: { level: 2, color: '#2A4A1A', label: 'Titling & Designations' },
  DOCUMENTS: { level: 3, color: '#7A5A1A', label: 'Estate Documents' },
  FUNDING: { level: 4, color: '#6A4A10', label: 'Trust Funding' },
  ENTITIES: { level: 5, color: '#7A3010', label: 'Entity Structure' },
  ADVANCED: { level: 6, color: '#8B2020', label: 'Advanced Planning' },
}

const MASTER_DISCLAIMER =
  'This diagnostic is for educational purposes only and does not constitute legal, tax, investment, or financial planning advice, and nothing here creates a professional relationship of any kind. These tools identify questions to explore with your licensed estate planning attorney, CPA, and registered investment adviser. Aidan M. Drexler is not currently providing investment advisory services. This site does not constitute a solicitation or offer of securities or investment advisory services in any jurisdiction.'

const TOOL_TABS = [
  'Coordination Gap Visualizer',
  'Wealth Architecture Visualizer',
  'Asset Exposure Profile',
]

const PROFESSIONALS = [
  { id: 'a', label: 'Estate Attorney', emoji: '⚖️', short: 'A' },
  { id: 'c', label: 'CPA', emoji: '📊', short: 'C' },
  { id: 'f', label: 'Financial Advisor', emoji: '📈', short: 'F' },
  {
    id: 'i',
    label: 'Insurance Adviser',
    emoji: '🛡️',
    short: 'I',
    sublabel: 'P&C, Umbrella & DI',
  },
]

const GAP_CARD_DATA = {
  none: [
    {
      title: 'No Professional Coordination',
      scenario:
        "You are coordinating your own financial and estate plan without professional guidance. Florida's asset protection framework — the constitutional homestead exemption, the tenancy-by-entireties rules for joint accounts, the creditor protection for retirement accounts — all operate by default. Default is not always wrong. But it is rarely optimal for someone with meaningful assets, a business, a professional license, or a family that depends on their income. The gap at this stage is not what you have done wrong. It is what you do not yet know to ask.",
      authority:
        'Gassman & Markham on Florida and Federal Asset Protection Law (2025 ed.), Introduction',
      question:
        'If something happened to you tomorrow — disability or death — does anyone in your family know where every account is, who the beneficiaries are, and how to access what they need in the first 30 days?',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
  ],
  f_only: [
    {
      title: 'Portfolio Without a Plan',
      scenario:
        "Your financial adviser manages your investments and monitors your portfolio. But a financial adviser cannot draft legal documents, re-title your accounts, or review whether your beneficiary designations still reflect your current family situation. Here is the specific risk: every IRA, 401(k), life insurance policy, and annuity in your name has a beneficiary designation form on file with the custodian. That form is a legally binding contract. It supersedes your will. It supersedes your trust. The U.S. Supreme Court confirmed this in Kennedy v. Plan Administrator for DuPont Savings and Investment Plan (2009), holding that a plan must pay the designated beneficiary even when a divorce decree said otherwise. Your adviser has no way to know if those designations are current unless you have told them — and even then, they cannot update them for you.",
      authority:
        'Kennedy v. Plan Administrator, 555 U.S. 285 (2009) · Choate, Life and Death Planning for Retirement Benefits (8th ed. 2019)',
      question:
        'When did you last review — on paper, not from memory — the primary and contingent beneficiary designations on every retirement account, life insurance policy, and annuity you own? If the answer involves a life event more than 12 months ago, the review is overdue.',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
  ],
  i_only: [
    {
      title: 'Coverage Without Coordination',
      scenario:
        "Your insurance adviser has reviewed your umbrella policy, your professional liability, and your property and casualty coverage. This is genuinely valuable — most families have never had this review done professionally. But insurance planning in isolation is incomplete. Your insurance adviser cannot see whether your umbrella limits are matched to your actual exposed net worth as reflected in your investment portfolio. They cannot see whether your life insurance policy is owned by an ILIT or is sitting inside your taxable estate. They cannot see whether your professional liability policy covers the specific risks your attorney has identified in your business structure. Insurance planning without financial and legal coordination is coverage without context.",
      authority:
        'Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 20 · Rojeck, Wealth (2019) Ch. 5',
      question:
        'Does your insurance adviser know your current net worth, the details of your business entity structure, and whether any of your life insurance is held in an irrevocable trust?',
      calibration: CALIBRATION_SYSTEM.INSURANCE,
    },
  ],
  a_only: [
    {
      title: 'Trust Without Funding',
      scenario:
        "Your estate attorney drafted a revocable living trust — a legal structure designed to control how your assets are distributed at death and managed during incapacity, while avoiding the public probate court process. Here is what almost no one tells clients after signing: the trust only controls what is legally titled to it. Signing the trust document creates the legal structure. Funding the trust means actually re-titling your assets — changing the name on your brokerage account from 'John Smith' to 'John Smith, Trustee of the John Smith Revocable Trust dated January 1, 2024.' Until that re-titling happens, your brokerage account passes through probate (a public Florida court process) regardless of what the trust document says. In practice, the most common scenario: a client signs a revocable trust, opens two new brokerage accounts after that meeting, and never re-titles them. The attorney assumed the client would handle the funding. The client assumed the attorney handled everything. Neither assumption was correct.",
      authority:
        'Gassman & Markham (2025 ed.) Ch. 5, citing Fla. Stat. §736.0401 · Pfau, Retirement Planning Guidebook (2021), Ch. 11 (on estate plan components)',
      question:
        'Has every brokerage account, bank account, and real estate parcel you own been re-titled to reflect your revocable trust as the legal owner — not just listed in an appendix to the trust document?',
      calibration: CALIBRATION_SYSTEM.FUNDING,
    },
    {
      title: 'The Guardianship Gap',
      scenario:
        "Your estate attorney has drafted a revocable trust that governs the distribution of your estate at death. But there is a set of documents that governs what happens before death — during any period when you are alive but unable to manage your own affairs. A durable financial power of attorney names someone who can access your accounts and manage your finances during incapacity. A healthcare surrogate designation names someone who can make medical decisions for you. A living will documents your end-of-life care preferences. Without these documents, incapacity triggers a guardianship proceeding — a public, court-supervised process that can cost tens of thousands of dollars and takes weeks or months to establish. Most estate attorneys draft these documents as part of a complete estate plan. If yours did not, or if yours are more than five years old, schedule a review. The revocable trust alone is not a complete incapacity plan.",
      authority:
        'Fla. Stat. §765.202 · §709.2104 · Pfau, Retirement Planning Guidebook (2021) Ch. 11 · Hallman & Rosenbloom (9th ed. 2014)',
      question:
        'Were a durable financial power of attorney, healthcare surrogate designation, and living will drafted at the same time as your revocable trust — and have all of them been reviewed since your Florida residency was established?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  c_only: [
    {
      title: 'Tax Returns Without Estate Coordination',
      scenario:
        "Your CPA optimizes your annual tax return and may identify certain tax reduction opportunities. But the CPA's view is primarily backward-looking — they see what happened last year. They do not automatically design how your assets are titled, who inherits them, or what happens to the value inside your retirement accounts after you die. Here is a specific coordination gap that falls entirely in the space between a CPA and an estate attorney: the step-up in income tax basis. When you die, most assets you own get a new tax basis equal to their fair market value on the date of death. An heir who inherits appreciated stock worth $500,000 can sell it the next day with no capital gains tax — because the basis 'steps up' to the current value. But retirement accounts (IRAs, 401ks) do NOT receive a step-up in basis. Every dollar in a traditional retirement account will be taxed as ordinary income when your heirs withdraw it. The decision about which assets to give to which heirs — and whether to convert retirement accounts to Roth before death — depends on coordination between your CPA and your estate attorney that rarely happens automatically.\nSource: Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014, McGraw-Hill) Ch. 11 — step-up in basis strategies and the capital gains lock-in problem.",
      authority:
        'IRC §1014 (step-up in basis) · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 11 · Rojeck, Wealth (2019) Ch. 2 (estate planning and asset location coordination)',
      question:
        "Has your CPA modeled which of your assets will receive a step-up in basis at death — and which won't — and coordinated with your estate attorney on how to structure your estate plan around that distinction?",
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  af: [
    {
      title: 'Gift Tax Compliance Gap',
      scenario:
        "Your attorney created an Irrevocable Life Insurance Trust (ILIT) — a trust that owns a life insurance policy on your life, keeping the death benefit outside of your taxable estate. Your financial adviser purchased the policy and transfers premium money to the trust each year. What neither may have confirmed: each time you transfer money to the ILIT, a technical requirement must be met to treat the transfer as a gift eligible for your annual gift-tax exclusion (currently $18,000 per beneficiary per year under IRC §2503(b)). This requirement is called a 'Crummey notice' — a written notice to each trust beneficiary that they have the right to withdraw their share of the gift within a short window (typically 30 days). Without these notices being sent within that window every single year, the IRS can reclassify those premium transfers as using lifetime gift-tax exemption rather than the annual exclusion. Over a 10-year permanent life policy, missing Crummey notices can mean hundreds of thousands of dollars of lifetime exemption consumed that you did not intend to use. It is one of the most easily preventable compliance failures in irrevocable trust planning — and one of the most commonly overlooked.",
      authority:
        'IRC §2503(b) · Rev. Rul. 81-7 · Crummey v. Commissioner, 397 F.2d 82 (9th Cir. 1968)',
      question:
        'Has your attorney or trust administrator confirmed in writing that Crummey notices were sent to every ILIT beneficiary within 30 days of each premium transfer, every year since the trust was created?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
    {
      title: 'Missing CPA on Roth Conversion',
      scenario:
        "Your financial adviser has shown you a projection of the long-term benefits of a Roth conversion — moving money from a traditional IRA (where growth is tax-deferred and withdrawals are taxed as ordinary income) into a Roth IRA (where qualifying withdrawals are completely tax-free for the rest of your life and for your beneficiaries). The long-term math is often compelling. But a Roth conversion triggers taxable income in the year it is executed — that income stacks on top of all your other income for that year and is taxed at your marginal rate. Without your CPA involved before the conversion is executed, three specific problems can go undetected: (1) the conversion amount may push you into a higher IRMAA bracket for Medicare premiums two years later; (2) the conversion income may cause more of your Social Security benefits to become taxable, creating what Pfau calls the 'tax torpedo'; (3) the timing may be in a year when other income events — a business sale, a real estate transaction, a large bonus — are already filling your lower brackets. The adviser sees the 30-year projection. The CPA sees this year's tax return. Both are necessary for the decision.",
      authority:
        'Pfau, Retirement Planning Guidebook (2021) Ch. 10 (Social Security tax torpedo, IRMAA, strategic Roth conversions) · IRC §408A',
      question:
        'Before your last Roth conversion was executed, did your CPA model: (1) the impact on Medicare premiums two years forward; (2) the Social Security taxation impact; and (3) any other income events in that same tax year that might make the conversion cost more than projected?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  ac: [
    {
      title: 'Investment Accounts Not Coordinated',
      scenario:
        'Trust drafted, return filed, but brokerage accounts are still titled in your individual name. No advisor brought in to re-register them.',
      authority: 'Fla. Stat. §689.075 · §736.0401',
      question:
        'Are your brokerage and bank accounts titled to your trust, or to you individually?',
      calibration: CALIBRATION_SYSTEM.FUNDING,
    },
    {
      title: 'Buy-Sell Funding Gap',
      scenario:
        "Your estate attorney drafted the buy-sell agreement — a legally binding contract between business owners that governs what happens to each owner's share if one owner dies, becomes disabled, divorces, or wants to exit. Your CPA reviewed the tax treatment. But a critical question may have gone unanswered: is the buy-sell actually funded with sufficient life and disability insurance to honor the agreement's obligations? A buy-sell agreement that promises to pay a surviving owner $2M for their deceased partner's share — but has no insurance in place to deliver that cash — is a promise, not a guarantee. There is also a significant legal update every business owner with partners must know: in Connelly v. United States (June 2024), the U.S. Supreme Court held 9-0 that life insurance proceeds used by a corporation to fund a stock redemption must be included in calculating the corporation's fair market value for estate tax purposes. This reversed how many buy-sell agreements were structured. Agreements drafted before June 2024 under entity-redemption structures may now generate unexpected estate tax liability for the deceased owner's estate.",
      authority:
        'Connelly v. United States, 144 S. Ct. 1406 (2024) · Gassman & Markham (2025 ed.) Ch. 1',
      question:
        "Has your buy-sell agreement been reviewed by both your business attorney and your CPA since June 2024? And has your financial adviser confirmed the life and disability insurance funding is sufficient to actually honor the agreement's obligations at current business valuations?",
      calibration: CALIBRATION_SYSTEM.ENTITIES,
    },
  ],
  cf: [
    {
      title: 'Beneficiary Designations Override the Return',
      scenario:
        "Your CPA optimizes your tax-deferred withdrawals and your adviser manages your portfolio. Together, they have built a thoughtful plan for generating income in retirement. None of it matters if the beneficiary designations on your retirement accounts are wrong. Here is why this is the most consequential and most overlooked gap in American wealth planning: a beneficiary designation on a retirement account (IRA, 401k, 403b), life insurance policy, or annuity is a legally binding contract. It supersedes your will. It supersedes your trust. The U.S. Supreme Court confirmed this in Kennedy v. Plan Administrator for DuPont (2009). Common disasters that result from outdated designations: a former spouse inheriting a $400,000 IRA because the designation was never updated after divorce; a deceased parent named as primary beneficiary, causing the account to flow to 'my estate' and go through probate; an adult child inheriting a large IRA at peak earning years, forced by the 10-year rule under SECURE 2.0 to distribute the entire account within a decade — potentially all taxed at 37%. Under current law, most non-spouse beneficiaries of inherited IRAs cannot stretch distributions over their lifetime. They must empty the account within 10 years of the original owner's death, and if the owner died after their required beginning date, must also take annual distributions during the first nine years.",
      authority:
        'Kennedy v. Plan Administrator, 555 U.S. 285 (2009) · Choate, Estate Planning for Retirement Benefits (Sept 2025 outline) — Part 3 (10-year rule) · Choate, Life and Death Planning for Retirement Benefits (8th ed. 2019)',
      question:
        'Have you reviewed and confirmed — on paper, not from memory — every primary and contingent beneficiary designation on every retirement account, life insurance policy, and annuity in the past 12 months?',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
    {
      title: 'No Estate Documents',
      scenario:
        "Your adviser manages the investments. Your CPA files the returns. But there are four documents that no financial adviser or CPA can create for you — because they require a licensed attorney — and without them, Florida law decides what happens to you and your family in a crisis. The four documents every adult Florida resident needs: (1) A will or revocable living trust, specifying who inherits what. Without one, Florida's intestacy statute (Fla. Stat. §732.102) decides — and the result may surprise you. (2) A durable financial power of attorney, naming someone to manage your finances if you are incapacitated. Without one, your family may need a court-supervised guardianship proceeding to access your accounts — which is expensive, public, and slow. (3) A healthcare surrogate designation (Fla. Stat. §765.202), naming someone to make medical decisions if you cannot. (4) A living will, specifying your wishes about end-of-life care. These documents cost a few hundred to a few thousand dollars to have an attorney prepare. Not having them can cost your family far more — in court fees, family conflict, and decisions made by strangers instead of the people you trust.",
      authority:
        'Fla. Stat. §732.102 (intestate succession) · Fla. Stat. §765.202 (healthcare surrogate) · Pfau, Retirement Planning Guidebook (2021) Ch. 11 (estate plan components)',
      question:
        'Do you have a current will or revocable trust, durable financial power of attorney, and healthcare surrogate designation — all executed under Florida law after you established Florida residency?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  acf: [
    {
      title: 'The Integration Gap',
      scenario:
        "You have all three professionals — which is genuinely rare and genuinely valuable. At this level, the remaining gap is almost never what any individual adviser does in isolation. It is the absence of a shared picture. Your attorney knows your trust documents. Your CPA knows your tax return. Your adviser knows your portfolio. But consider what none of them may know: that you have opened three new brokerage accounts since your trust was drafted and none are titled to it; that the Roth conversion your adviser executed last year pushed you into the IRMAA Medicare premium surcharge two years forward; that the buy-sell agreement your attorney drafted in 2021 now creates estate tax exposure under the Connelly decision that neither your CPA nor your adviser knows about.\n\nHughes, Massenzio and Whitaker describe this as the gap between advisers who work in silos around a client's financial capital and advisers who work together on the client's complete wealth — integrating the financial, legal, and family dimensions into a single coherent strategy. The solution is a quarterly or at minimum annual coordination call among all three professionals. Most clients have never had one. Most professionals know they should happen and never initiate them.\nSource: Hughes, Massenzio & Whitaker, Complete Family Wealth (2nd ed. 2022, Wiley) Ch. 10 (Advisers) — 'Make sure fee proposals are clear and written. Ask your adviser to put his or her fees in context' — and the broader framework of the book on complete wealth vs. financial capital alone.",
      authority:
        'Hughes, Massenzio & Whitaker, Complete Family Wealth (2nd ed. 2022) Ch. 10 · Rojeck, Wealth (2019) Ch. 9 (the financial planner as quarterback of the advisory team)',
      question:
        'In the past 12 months, have your attorney, CPA, and financial adviser spoken directly to each other about your situation — not through you as a relay, but directly — to share what each of them knows?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
    {
      title: 'Out-of-State Documents, Florida Assets',
      scenario:
        "You have all three advisors. Here is a gap that catches even well-organized transplants: if any of your estate documents were drafted in another state before you established Florida residency, they may not reflect Florida's distinct legal framework — and the differences are significant. Florida has no state estate tax, which changes the optimization for many clients who planned around a state-level tax they no longer owe. Florida's homestead law (Article X §4 of the Florida Constitution) restricts who can inherit your primary residence — a New York will that leaves the house however you want may partially conflict with Florida's homestead devise restrictions (Fla. Stat. §732.4015). Florida's Trust Code (Chapter 736 of the Florida Statutes) has its own requirements for trust administration. And Florida's creditor exemptions — the unlimited homestead, the tenancy-by-entireties protection for joint accounts, the annuity and life insurance cash value exemptions — only apply if your assets are correctly titled and structured under Florida law. Out-of-state documents are not automatically wrong. But they require a Florida review by a Florida-licensed estate planning attorney — and that review has likely not happened if your documents predate your Florida residency.",
      authority:
        'Gassman & Markham (2025 ed.) Ch. 2, Ch. 5 · Fla. Const. Art. X §4 · Fla. Stat. §732.4015 · Ch. 736',
      question:
        'Were your estate planning documents — will, trust, power of attorney — drafted or formally reviewed by a Florida-licensed estate planning attorney after you established permanent Florida residency?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  fi: [
    {
      title: 'The Investment-and-Insurance Silo',
      scenario:
        "You have your financial adviser managing your portfolio and your insurance adviser reviewing your coverage. This is the most common two-adviser combination in affluent Florida families — and it addresses approximately half of the planning picture. What is missing: legal structure and tax strategy. Without an estate attorney, your accounts have no governing document for what happens at your death or incapacity. Without a CPA coordinating with both advisers, your Roth conversion strategy may be triggering IRMAA surcharges, and your insurance proceeds may be sitting in a taxable estate rather than an ILIT because nobody completed the legal work to move them out. Evensky and Horan describe this as the life balance sheet gap — the adviser managing assets without visibility into the legal claims against them.",
      authority:
        'Evensky, Horan & Robinson, The New Wealth Management (CFA Institute, 2011) Ch. 1 (life balance sheet) · Rojeck, Wealth (2019) Ch. 9 (the financial planner as quarterback)',
      question:
        'Does either your financial adviser or your insurance adviser know the current provisions of your estate plan — specifically who inherits your accounts and whether your life insurance death benefit is inside or outside your taxable estate?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  ai: [
    {
      title: 'Structure Without Strategy',
      scenario:
        "Your estate attorney has drafted your documents and your insurance adviser has reviewed your coverage. Between them, you have legal protection and the first layer of financial defense. What is absent: the ongoing investment management, the tax optimization, and the retirement income planning that keep the legal structure relevant as your financial situation evolves. An ILIT created five years ago with a $2M death benefit may be dramatically undersized if your net worth has grown substantially since. A trust structure that was optimal for your estate at $3M may need revision at $8M. Without a financial adviser modeling your portfolio and a CPA modeling your taxes, the legal structure is a snapshot of your situation as it was, not as it is.",
      authority:
        'Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 1 (the financial planning process as ongoing)',
      question:
        'When did your estate attorney last receive a current financial statement showing your complete asset picture — so they can confirm the legal structure still reflects your actual situation?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  ci: [
    {
      title: 'Taxes and Coverage Without a Plan',
      scenario:
        "Your CPA manages your tax obligations and your insurance adviser covers your exposures. Both are doing important work. But neither professional holds the legal architecture that governs what happens to your wealth when you are no longer able to manage it — or after you are gone. There is no trust directing the distribution of your estate. There is no durable power of attorney naming someone to manage your finances if you are incapacitated. The insurance proceeds from the policy your insurance adviser placed will go directly to the named beneficiary — which may or may not align with your estate plan, because there is no estate plan.",
      authority: 'Pfau, Retirement Planning Guidebook (2021) Ch. 11 (components of an estate plan)',
      question:
        'Do you have a current will or revocable trust, a durable financial power of attorney, and a healthcare surrogate designation — all executed under Florida law?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  aci: [
    {
      title: 'No Investment Governance',
      scenario:
        "You have legal structure, tax coordination, and insurance coverage — three of the four dimensions of a comprehensive wealth plan. The missing dimension is investment governance: the ongoing management of your portfolio against a written strategy, the modeling of withdrawal sequencing in retirement, the asset location decisions that determine which assets sit in taxable versus tax-deferred accounts. Without a financial adviser, these decisions are being made informally — or not at all. Evensky and his co-authors at the CFA Institute describe the Investment Policy Statement as the foundational document of wealth management — the written agreement that defines your goals, risk tolerance, asset allocation, and the rules governing every investment decision. Without one, your largest financial asset has no governing document.",
      authority:
        'Evensky, Horan & Robinson, The New Wealth Management (CFA Institute, 2011) — the Investment Policy Statement as governing document · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 9',
      question:
        'Does a written Investment Policy Statement exist that defines your asset allocation targets, your risk tolerance, and the rules that govern how your investments are managed?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  afi: [
    {
      title: 'The Tax Blind Spot',
      scenario:
        "You have legal structure, insurance coverage, and investment management. This is a more complete team than most affluent families assemble. The missing professional — the CPA — is also the least visible gap, because the damage it creates shows up years later and is difficult to trace back to the absence. The Roth conversion your financial adviser executed increased your MAGI, which will push your Medicare premiums higher in two years — the CPA would have caught this. The appreciated stock you plan to donate to charity could be donated directly from your brokerage account with no capital gains tax — the CPA would have modeled this. The step-up in basis at death means some assets should be held until death rather than gifted during life — the CPA would have identified which ones. Pfau describes these as the three tax torpedo risks: Social Security provisional income effects, IRMAA Medicare premium surcharges, and bracket stacking from simultaneous income events. All three require CPA coordination to navigate.",
      authority:
        'Pfau, Retirement Planning Guidebook (2021) Ch. 10 (the Social Security tax torpedo, IRMAA, strategic Roth conversions)',
      question:
        'Does your CPA receive a copy of your investment account statements and review them before filing your return — or do they only see what you provide them in a document upload at tax time?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  cfi: [
    {
      title: 'The Legal Foundation Is Missing',
      scenario:
        "Your CPA, insurance adviser, and financial adviser form a productive team around your financial life. They optimize your taxes, protect your exposures, and manage your portfolio. What they cannot do — because none of them are licensed to practice law — is draft the legal documents that govern what happens to everything you have built. Without an estate attorney: your brokerage accounts have no legal direction at death and pass through Florida's public probate process. Your incapacity is managed by whoever a court appoints, not by the person you trust. Your homestead's constitutional protection may be jeopardized if the property is titled incorrectly. Your retirement accounts' beneficiary designations — which supersede every other document — may not have been reviewed since you were 35. The legal layer is not the most expensive layer to add. It is the layer whose absence costs the most.",
      authority:
        'Gassman & Markham (2025 ed.) Ch. 5 · Fla. Stat. §732.102 (intestate succession) · Fla. Stat. §765.202 (healthcare surrogate)',
      question:
        'If you became incapacitated tomorrow, who has the legal authority to access your bank accounts, manage your investments, and make healthcare decisions for you — and is that authority documented in a signed Florida legal document?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  acfi: [
    {
      title: 'The Complete Team — One Gap Remains',
      scenario:
        "You have assembled all four professionals. This is rare. Most affluent families in Palm Beach County have two or three, rarely four, and almost never all four working in coordination rather than in parallel. At this level, the gap is not a missing professional. It is the absence of someone who is accountable for the integrated picture — someone who knows what each professional is doing, who identifies the gaps between them, and who initiates the annual coordination conversation that most advisory teams never have. Rojeck calls this the quarterback role. Hallman and Rosenbloom describe it as the core function of private wealth management: not the management of any single domain, but the development of a comprehensive plan across all domains simultaneously. Most clients are their own quarterback by default. Most are not equipped for the role.",
      authority:
        'Rojeck, Wealth (2019) Ch. 9 (the financial planner as quarterback of the advisory team) · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 1 (the nature of private wealth management)',
      question:
        'Among your four advisers, who is explicitly responsible for identifying the gaps between them — and when did that person last do a review of the complete picture with all four professionals in the same conversation?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
}

const ARCHITECTURE_LAYERS = [
  {
    id: 'layer1',
    name: 'Insurance Layer',
    sublabel: 'First Line of Defense — Start Here Before Anything Else',
    color: '#1A4A2E',
    what: "Personal umbrella liability policy — sized to at least 1× your net worth, with a practical floor of $2M and an upper range of $10M–$25M for high-net-worth families. Professional liability with tail coverage (critical for physicians, attorneys, architects, and other licensed professionals). Commercial general liability if you own a business or investment property. Personal auto policy at minimum 250/500/100 underlying limits (this is often the requirement your umbrella policy demands). Homeowner's policy with at least $300,000 in personal liability coverage. For business owners: key-man life and disability insurance on principals. For anyone with boats, pools, teen drivers, short-term rentals, or a domestic staff: each requires a specific endorsement review.",
    defends:
      "Insurance is the only layer in this entire architecture that pays for your legal defense — attorney fees, expert witnesses, court costs — before any other protection is ever tested. Every other layer (your homestead, your retirement accounts, your LLC, your trusts) assumes that a creditor has already won a judgment and is trying to collect. Insurance stops the judgment from being entered in the first place. A well-defended case that costs $200,000 to litigate and settles for $400,000 costs you nothing if your umbrella covers it. The same case without an umbrella forces you to test whether every other layer of your planning actually holds. The answer may be yes — but why test it if you don't have to? Source: Gassman & Markham (2025 ed.) Ch. 1.",
    failure:
      "Two failures dominate. The first: umbrella policy limits set when net worth was $500,000 and never reviewed as it grew to $3M or $5M. The second — and more technical — is a coverage gap that most policyholders do not know exists: umbrella policies require the underlying policies (auto, homeowner's) to carry minimum liability limits before the umbrella kicks in. A typical requirement is 250/500/100 on the auto policy ($250K per person, $500K per accident, $100K property damage). If your auto policy only carries 100/300, there is a gap between what your auto covers and where your umbrella begins. In that gap, you pay personally. Your insurance agent should audit this annually — this is a 20-minute conversation that costs nothing.",
    florida:
      "Florida has no cap on personal injury jury verdicts. Palm Beach County is consistently among the highest-verdict counties in the state. A single serious automobile accident — one where another driver is severely injured — can produce a multi-million dollar verdict in a Palm Beach County courtroom. The 'Romeo defense' is not available here: Florida's pure comparative negligence rule means you can be held liable even when the other party was also at fault. An umbrella policy is the single most cost-effective protection purchase available to anyone with meaningful assets. Source: Gassman & Markham (2025 ed.) Ch. 1 (identifying insurance as the foundational creditor defense).",
    calibration:
      "This is Step 1 for a reason. Before your attorney discusses LLCs. Before your adviser discusses trusts. Before anyone discusses advanced structures. The right umbrella policy, properly sized and properly linked to underlying coverage, is more valuable than almost any other protective structure you could put in place — because it prevents the creditor from reaching your protected layers entirely. Call your property and casualty agent this week. Ask two questions: (1) What are my current umbrella limits? (2) Do my underlying auto and homeowner's limits meet my umbrella's requirements?",
    authority: 'Gassman & Markham (2025 ed.) Ch. 1, Ch. 7 (disability insurance)',
    profileNotes: {
      'Young Professional':
        'At this stage, insurance is the entire asset protection plan. Own-occupation disability income, personal umbrella, and professional liability with tail coverage are non-negotiable for licensed professionals. Human capital is your largest asset — protect it first. Source: Evensky et al., The New Wealth Management (2011).',
      'Business Owner':
        'Commercial GL + business umbrella + key-man life on principals.',
      'Professional Practice':
        "Professional liability with tail coverage + personal umbrella $2M minimum. Florida §621.07 preserves personal malpractice — entity doesn't eliminate it.",
      'Real Estate Investor':
        'Landlord liability on each property + commercial umbrella.',
      'HNW Family':
        'Personal umbrella min $2M, sized to 1× net worth. Teen drivers, boats, pools, short-term rentals each require explicit endorsement review.',
    },
  },
  {
    id: 'layer2',
    name: 'Florida Exempt Assets',
    sublabel:
      'Constitutional & Statutory Bedrock — Free and Automatic If Correctly Titled',
    color: '#1A4A35',
    what: 'Five categories of assets receive automatic creditor protection under Florida law — meaning no judgment creditor, regardless of the size of their judgment, can force you to surrender them: (1) YOUR PRIMARY RESIDENCE (homestead): Protected by Article X, Section 4 of the Florida Constitution with no dollar cap. Unlimited in value. Applies to a half-acre of property within a municipality or 160 acres outside one. The Florida Supreme Court held in Havoco of America, Ltd. v. Hill that even a homestead purchased with specific intent to defraud creditors is protected — making this the most powerful single asset protection in any U.S. state. (2) JOINT SPOUSAL ACCOUNTS titled as tenancy by the entireties: Protects joint marital bank and brokerage accounts from the individual creditors of either spouse (not from joint debts of both spouses). The Florida Supreme Court confirmed this in Beal Bank, SSB v. Almand & Associates (2001). (3) RETIREMENT ACCOUNTS (IRAs, 401(k)s, 403(b)s, pensions): Protected under Fla. Stat. §222.21 with no dollar cap. (4) LIFE INSURANCE CASH VALUE and annuity proceeds: Protected under Fla. Stat. §222.14 for Florida residents. (5) HEAD-OF-HOUSEHOLD WAGES: Protected from garnishment under Fla. Stat. §222.11.',
    defends:
      "These protections exist because Florida's legislature and constitution have made a policy decision that certain assets are beyond the reach of creditors, period — regardless of the amount owed and regardless of the legitimacy of the creditor's claim. A physician who loses a $5M malpractice verdict cannot be forced to sell their $3M home if it is their Florida homestead. A couple with $1.5M in IRAs retains that money even in bankruptcy, because federal bankruptcy law honors Florida's exemption (§222.21). These protections are not loopholes. They are the law. Source: Gassman & Markham (2025 ed.) Ch. 2, 3, 4, 5, 6, 8.",
    failure:
      "Deeding the homestead into an LLC. This is the single most common and most costly titling mistake Florida estate planners encounter. The moment your primary residence is owned by an LLC, it loses the unlimited constitutional protection of Article X §4 entirely, and is replaced by the LLC's charging-order protection — which is weaker and can be defeated by domestic creditors. The property tax Save Our Homes cap (limiting annual assessment increases to 3% for homesteaded property) is also lost. The fix is simply to title the property to you personally or to a revocable trust. Note: property held in a revocable trust IS protected — multiple Florida appellate courts have confirmed this since the initial confusion created by In re Bosonetto (2001) was reversed. Source: Gassman & Markham (2025 ed.) Ch. 5 — 'The Florida Constitution provides an almost supernatural protection for homeowners against creditors.'",
    florida:
      "Florida residents benefit from a creditor-protection framework that is significantly stronger than most other states. The homestead exemption is unlimited in value — there is no cap. The retirement account exemption under §222.21 protects IRAs and qualified plans without dollar limit, and Florida amended the statute in 2011 to extend this protection to inherited IRAs. The life insurance and annuity cash value exemption under §222.14 protects the accumulated cash value in policies and annuity proceeds — making permanent life insurance and annuities meaningful planning tools for creditor protection, not just income or investment products. These protections are why Florida is one of the most asset-protection-friendly states in the country for residents who structure correctly. Source: Gassman & Markham (2025 ed.) Ch. 3, 4, 8.",
    calibration:
      'These protections are free and automatic — but only if assets are correctly titled. Reviewing your account titling and beneficiary designations costs nothing. It should happen every time you open a new account, buy property, or experience a life event. This is Step 2 — after insurance, before any discussion of trusts, entities, or advanced planning.',
    authority:
      'Fla. Const. Art. X §4 · Fla. Stat. §§222.11, 222.14, 222.21 · Beal Bank v. Almand (Fla. 2001) · Gassman & Markham (2025 ed.) Ch. 2, 3, 4, 5, 6, 8',
    profileNotes: {
      all: 'Check: Is your primary residence titled in your individual name or jointly as TBE? Not in an LLC or out-of-state trust?',
      'Young Professional':
        'Your primary residence in Florida receives unlimited creditor protection under Article X §4 if titled correctly (individually or in a revocable trust, not in an LLC). If married, title joint accounts as tenancy by the entireties. IRAs and 401(k)s are protected without limit under Fla. Stat. §222.21 — automatic if titling is correct.',
    },
    retirementArchitecture:
      "Retirement accounts — IRAs, 401(k)s, 403(b)s — receive unlimited creditor protection under Florida Statute §222.21. This is the asset protection dimension. But retirement assets also require their own planning architecture for how they are drawn down, when they are converted, and who inherits them.\n\nThe 10-year rule under SECURE 2.0 (IRC §401(a)(9)(H)) requires most non-spouse beneficiaries to fully distribute an inherited IRA within 10 years of the original owner's death. For an adult child inheriting a large IRA during peak earning years, the forced distributions can be taxed at the highest federal brackets. The planning response — Roth conversions during low-income years, strategic beneficiary designation review, coordination between financial adviser and estate attorney on trust-as-beneficiary structures — requires all three professionals to be working from the same picture simultaneously.\n\nSocial Security, though not a retirement account, is the most significant source of retirement income for most households. Pfau describes it as 'the best annuity money can buy' — government-backed, inflation-adjusted, with a survivor benefit. The decision of when to claim it is one of the highest-return planning decisions available. Delaying to age 70 for the higher earner in a couple can increase lifetime benefits by 76% or more compared to claiming at 62.\n\nSource: Choate, Estate Planning for Retirement Benefits (Sept 2025 outline) · Pfau, Retirement Planning Guidebook (2021) Chs. 4, 6, 11.",
  },
  {
    id: 'layer3',
    name: 'Trust & Estate Documents',
    sublabel: 'Probate Avoidance & Transfer Architecture',
    color: '#3A3010',
    what: 'Revocable living trust — provides probate avoidance and privacy in distribution. Does NOT provide creditor protection during your lifetime (you can revoke it; creditors can reach it). Pour-over will — a backup document that directs any assets not titled to the trust at your death to flow into it, catching anything that was missed. Irrevocable Life Insurance Trust (ILIT) — if you own significant life insurance, an ILIT keeps the death benefit outside of your taxable estate (preventing IRC §2042 inclusion) and, if properly drafted with a spendthrift provision, protects the death benefit from the beneficiaries\' creditors.\n\nNote on family governance documents: for families with significant wealth and multiple generations involved, the trust layer often extends beyond legal documents to include what Hughes, Massenzio and Whitaker call the governance infrastructure of a family enterprise — family mission statements, family councils, and family meeting frameworks that ensure qualitative capital (relationships, values, shared purpose) is preserved alongside financial capital. These are not legal documents drafted by attorneys; they are planning conversations facilitated by advisers who understand both the legal and the human dimensions of family wealth. For most families at the $1M–$5M level, this is aspirational. For families above $5M with multiple generations involved, it is the difference between wealth that endures and wealth that dissipates in three generations.\nSource: Hughes, Massenzio & Whitaker, Complete Family Wealth (2nd ed. 2022) Chs. 17–20.',
    defends:
      'The revocable trust controls the distribution of your estate without the public probate court process. Incapacity governance during your lifetime belongs in the Incapacity & Access Layer — durable POA, healthcare surrogate, and living will are separate documents, not trust documents. The ILIT serves a different function: it keeps your life insurance death benefit outside your taxable estate. A $3M policy owned personally adds $3M to your taxable estate; owned by an ILIT, the death benefit passes to your beneficiaries outside the estate entirely. For those approaching federal estate tax exposure, this distinction can materially reduce estate taxes. Source: Pfau, Retirement Planning Guidebook (2021) Ch. 11.',
    failure:
      "A signed trust that has never been funded. Funding means actually re-titling your assets — changing the name on your brokerage account, re-deeding real estate, assigning business interests — so the trust legally owns them. Without this step, those assets go through probate (a public Florida court process under Chapter 733 of the Florida Statutes) regardless of what your trust document says. The second most common failure: an ILIT where the annual Crummey notices were never sent. Each year that a premium is transferred to the ILIT without a proper Crummey notice, the IRS may treat that transfer as using lifetime gift-tax exemption rather than the $18,000 annual exclusion. Over 15 years of premiums, this can consume hundreds of thousands of dollars of exemption that the family did not intend to use. Source: Gassman & Markham (2025 ed.) Ch. 5 · IRC §2503(b).",
    florida:
      "Florida probate (Chapter 733) is a public court process. The inventory of your estate, including what you owned and who inherits it, becomes public record. For families with business interests, real estate, or simply a desire for privacy, a funded revocable trust makes the entire distribution private. Florida does NOT recognize self-settled domestic asset protection trusts — a trust you create, naming yourself as a beneficiary, does not protect assets from your own creditors under Florida law. This is a critical distinction from states like Nevada, South Dakota, and Alaska, which do recognize such trusts. Structures marketed as 'asset protection trusts' that work in those states do not provide the same protection for Florida residents with Florida assets and Florida creditors. Source: Gassman & Markham (2025 ed.) Ch. 11.",
    calibration:
      'Estate documents are Step 3 — after insurance and after titling corrections. For most families — especially those without estates approaching federal estate tax thresholds — a properly funded revocable trust with correct beneficiary designations is the complete answer. Advanced irrevocable structures (SLATs, GRATs, ILITs) belong in Layer 5, only after this foundation is solid.',
    authority:
      'Fla. Stat. Ch. 736 (Trust Code) · Ch. 733 (Probate) · §765.202 · IRC §2042 (ILIT estate inclusion rule)',
    profileNotes: {
      'Young Professional':
        'A revocable trust is not urgent for most young professionals unless you own real estate or want to avoid probate. What IS urgent: a simple will, durable financial POA, and healthcare surrogate — a few hundred dollars. Get these before any other planning discussion.',
      'HNW Family':
        'If you have an ILIT: confirm Crummey notices were sent within 30 days of each premium payment. This is the most commonly overlooked compliance item in irrevocable trust administration.',
      'Business Owner':
        'If you have an ILIT: confirm Crummey notices were sent within 30 days of each premium payment. This is the most commonly overlooked compliance item in irrevocable trust administration.',
    },
  },
  {
    id: 'layer_incapacity',
    name: 'Incapacity & Access Layer',
    sublabel: 'Documents That Work While You Are Alive',
    color: '#4A3A10',
    what: "Durable Financial Power of Attorney — a legal document naming a person (your 'agent') who has the authority to manage your financial affairs if you become incapacitated: access your bank and brokerage accounts, pay your bills, file your tax returns, and make financial decisions on your behalf. 'Durable' means it survives your incapacity — a non-durable power of attorney becomes void precisely when you need it most. Healthcare Surrogate Designation (Fla. Stat. §765.202) — names the person who makes medical decisions for you when you cannot make them yourself: consenting to or refusing treatment, communicating with physicians, and directing your care. Living Will — your documented instructions about end-of-life care, including whether you want life-prolonging procedures if there is no reasonable expectation of recovery. HIPAA Authorization — allows your designated individuals to receive your medical information from healthcare providers. Without this, your spouse may be unable to speak with your physician.",
    defends:
      "Incapacity without these documents does not mean your family takes over. It means a court takes over. In Florida, if you become incapacitated without a durable power of attorney, your family must petition a court for a guardianship proceeding — a public, expensive, time-consuming process in which a judge determines who controls your finances and your healthcare. The guardianship becomes public record. It requires ongoing court supervision. It takes weeks or months to establish during exactly the period when your family needs immediate access to funds to pay for your care. A durable POA and healthcare surrogate prevent guardianship entirely. They cost a few hundred dollars to have an attorney draft. The absence of them can cost tens of thousands of dollars and months of family stress to remedy through the court system.\nSource: Pfau, Retirement Planning Guidebook (2021) Ch. 11.",
    failure:
      "The most common failure is having these documents but having them in a form that is rejected. A durable POA drafted in another state may not be accepted by Florida financial institutions. A healthcare surrogate designation that is more than a few years old may not reflect your current wishes or your current choice of surrogate. A HIPAA authorization that only names one person may fail to cover the right person at the critical moment. The second most common failure is having a revocable trust but not updating the durable POA to reflect the trust's existence — meaning the agent under the POA may not have authority to act as trustee. All four documents should be reviewed together by a Florida-licensed attorney.",
    florida:
      "Florida Statute §765.202 governs healthcare surrogate designations. Florida Statute §709.2104 governs durable powers of attorney. Florida Statute §765.101 defines the conditions under which a healthcare surrogate's authority becomes operative. Florida law requires the durable POA to be signed before two witnesses and a notary. Financial institutions in Florida are generally not required to accept a POA that does not substantially comply with the Florida Power of Attorney Act (Ch. 709). A New York or New Jersey POA may be rejected by a Florida bank. Source: Gassman & Markham (2025 ed.) Ch. 5.",
    calibration:
      "This layer is urgent for every adult — not just those with significant assets. A 30-year-old physician with no estate plan, no trust, and no retirement savings still needs a durable POA and healthcare surrogate. The cost of these documents is measured in hundreds of dollars. The cost of not having them during an unexpected medical crisis is measured in family anguish and legal fees. If you have these documents, review them every five years or after any significant life change.",
    authority:
      'Fla. Stat. §765.202 (Healthcare Surrogate) · Fla. Stat. §709.2104 (Durable Power of Attorney) · Fla. Stat. §765.101 · Pfau, Retirement Planning Guidebook (2021) Ch. 11 · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014)',
    profileNotes: {
      all: 'These documents apply universally. A physician facing a malpractice judgment is not more likely to become incapacitated than anyone else — but the cost of guardianship is equally unacceptable for every family. Every profile at every wealth level needs all four documents.',
      'Young Professional':
        'This is the most important layer for young professionals and the most commonly skipped. You are more likely to be incapacitated by an accident, illness, or surgery in your 30s than you are to die. A durable POA and healthcare surrogate cost less than one hour of your professional billing rate to have drafted.',
      'Business Owner':
        'Your durable POA agent needs explicit authority to act on behalf of the business — the generic form may not cover this. Ask your business attorney to review whether your POA grants sufficient business management authority.',
    },
  },
  {
    id: 'layer4',
    name: 'Entity Layer',
    sublabel:
      'Business & Investment Segregation — Relevant for Business Owners and Investors',
    color: '#5A2010',
    what: 'Multi-member operating LLC or PLLC (for licensed professionals) — segregates business liabilities from personal assets. For licensed professionals in Florida (physicians, attorneys, architects, engineers), the entity must be a Professional LLC (PLLC) or Professional Association (PA). Separate holding LLC — owns investment real estate, equipment, or intellectual property that is leased back to the operating entity. This separation prevents a judgment against the operating business from reaching the holding company\'s assets. Neither entity replaces professional liability insurance — they are complementary layers.',
    defends:
      "A properly maintained multi-member LLC receives 'charging-order exclusivity' under Florida Statute §605.0503. This means a creditor who wins a judgment against you personally cannot seize the LLC's assets directly. Their only remedy is a 'charging order' — a court order directing the LLC to pay them if and when you choose to make distributions. If you never make distributions, the creditor receives nothing — and in some cases may owe phantom income tax on undistributed allocated income, further discouraging them from pursuing the claim. Source: Gassman & Markham (2025 ed.) Ch. 1, citing Fla. Stat. §605.0503(6).",
    failure:
      "Owning an LLC entirely by yourself — a single-member LLC. Under Florida Statute §605.0503(4), a charging order is NOT the sole and exclusive remedy for judgment creditors of a single-member LLC. The Florida Supreme Court confirmed in Olmstead v. FTC, 44 So. 3d 76 (2010) that a court may order the single-member LLC owner to surrender their entire membership interest to satisfy a judgment. Gassman & Markham state directly: 'Single-member LLC ownership offers no substantive protection from a charging order standpoint under Florida law.' The practical fix is straightforward: add a genuine second member. Some planners use a disregarded irrevocable trust as the second member so the LLC remains a disregarded entity for income tax purposes. The second most common failure: a professional LLC that the owner believes protects against malpractice claims. Under Florida Statute §621.07, a licensed professional remains personally liable for their own professional negligence regardless of the entity form. The entity does not eliminate malpractice exposure — only insurance does.",
    florida:
      "Florida §605.0503 provides charging-order exclusivity for multi-member LLCs — and specifically, under §605.0503(6), prevents foreclosure on the LLC interest even when all members' interests are subject to charging orders. This was a significant improvement over the predecessor statute. Florida also maintains the Olmstead vulnerability for single-member LLCs, which means the single most important word in Florida entity planning is 'multi-member.' Source: Gassman & Markham (2025 ed.) Ch. 1.",
    calibration:
      'Entity structure is Step 5 — appropriate only when insurance, titling, estate documents, and trust funding are already confirmed in place. For most Florida families without an operating business, this layer is not the priority. For business owners and real estate investors, it is essential — but it is not a substitute for insurance.',
    authority:
      'Fla. Stat. §605.0503 · §621.07 · Olmstead v. FTC (Fla. 2010)',
    profileNotes: {
      'Young Professional':
        'Entity structure is almost never the right priority at this stage. If you are starting a practice or business, a properly maintained multi-member LLC or PLLC provides liability segregation — but insurance comes first, and the entity does not replace insurance.',
      'Business Owner':
        'Multi-member operating LLC + separate holding LLC. Single-member LLCs do not receive FL charging-order exclusivity per Olmstead.',
      'Professional Practice':
        'PLLC or PA for the practice. Holding LLC for equipment owned separately and leased to the practice entity.',
      'Real Estate Investor':
        'Separate multi-member LLC per property or cluster, owned by common holding company. Eliminates cross-contamination of liability between properties.',
      'HNW Family':
        'HNW families without operating businesses still often benefit from entity structures for investment assets — particularly real estate, family investment accounts, or discounted transfers to heirs via a family LLC. Source: Hallman & Rosenbloom (9th ed. 2014) Ch. 27.',
    },
  },
  {
    id: 'layer5',
    name: 'Advanced Planning Layer',
    sublabel: 'Irrevocable Structures & Transfer Strategies',
    color: '#8B2020',
    what: "Spousal Lifetime Access Trust (SLAT) — one spouse creates an irrevocable trust for the benefit of the other, removing assets from both spouses' taxable estates while the beneficiary spouse retains access during their lifetime. Grantor Retained Annuity Trust (GRAT) — the grantor transfers assets to an irrevocable trust while retaining an annuity payment stream; if the assets grow faster than the IRS hurdle rate (Section 7520 rate), the appreciation passes to heirs estate-tax-free. Irrevocable Life Insurance Trust (ILIT) — described in Layer 3. Charitable Remainder Trust (CRT) — provides an income stream to the donor during life while passing the remainder to charity at death; generates a partial charitable income tax deduction at funding. Charitable Lead Trust (CLT) — the reverse of a CRT; charity receives income for a term, then assets pass to heirs. Donor-Advised Fund (DAF) — allows a current-year charitable deduction for a contribution that can be invested and granted to charities over time; the simplest and most flexible charitable vehicle for most HNW families.\nFamily limited partnership (FLP) or family LLC — transfers business or investment assets to younger generations at a valuation discount, reducing the taxable estate.\nSource: Rojeck, Wealth (2019) Ch. 2 (estate planning tools including GRATs, SLATs, CRTs, CLTs, QPRTs, and IDGTs) · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 27 (lifetime giving strategies).",
    defends:
      'These structures primarily address estate tax efficiency — removing assets from your taxable estate during life so that the federal estate tax (currently 40% above the applicable exclusion amount) does not apply to the transferred assets. They also provide long-term creditor protection for beneficiaries through spendthrift provisions in irrevocable trusts. For clients with taxable estates, the combination of lifetime gifting, GRAT strategies, and SLAT structures can permanently remove millions of dollars from estate tax exposure at relatively low gift-tax cost. Source: Pfau, Retirement Planning Guidebook (2021) Ch. 11 (estate planning tax strategies).',
    failure:
      "Implementing advanced structures before the foundation is in place — before the umbrella is sized correctly, before accounts are properly titled, before the revocable trust is funded. Advanced planning on an unstable foundation is a waste of legal fees and planning time. The second most common failure: self-settled structures that don't work in Florida. Any transfer of assets made with the intent to hinder, delay, or defraud creditors is a 'voidable transfer' under Florida's Uniform Voidable Transactions Act (Chapter 726), allowing creditors to unwind the transfer for up to four years (or one year from discovery, whichever is later). Source: Gassman & Markham (2025 ed.) Ch. 1, citing Fla. Stat. Ch. 726.",
    florida:
      "Florida has no state estate tax — this alone makes many structures that were designed to minimize state-level estate taxes unnecessary for Florida residents. Federal estate tax planning, however, remains relevant for estates that exceed the federal applicable exclusion amount. The TCJA provisions currently in effect are set to revert without Congressional action — meaning the exclusion could be significantly reduced. Pfau notes in the Retirement Planning Guidebook (2021): 'it is a common belief that tax rates are currently as low as they will ever be.' That sentiment applies to estate taxes as well.",
    calibration:
      "Step 6. Appropriate for individuals with fully funded foundational planning, taxable estates, or specific business succession needs. If the word 'advanced' appeals to you because it sounds like the most protection — resist that instinct. A properly sized umbrella policy and correctly titled assets protect far more families far more effectively than a SLAT ever will. Source: the entire framework of this architecture, as confirmed by Gassman & Markham (2025 ed.).",
    authority:
      'Fla. Stat. Ch. 726 (UVTA) · IRC §§2036, 2038, 2042 · Fla. Stat. §736.0505 (spendthrift provisions)',
    profileNotes: {
      'Young Professional':
        'Advanced planning is not relevant at this stage. Start with insurance, titling, and basic estate documents — discussing GRATs and SLATs before confirming umbrella sizing and beneficiary designations wastes time and legal fees.',
      'HNW Family':
        'SLAT or third-party spendthrift trust for next-generation creditor protection. ILIT for life insurance death benefit outside the taxable estate.',
      'Business Owner':
        'Buy-sell reviewed post-Connelly (2024). Business succession plan with insurance-funded mechanism.',
      'Real Estate Investor':
        'Real estate investors frequently benefit from charitable planning structures — CRTs and 1031-to-GRAT sequences — that allow appreciated real estate to be sold without immediate capital gains recognition. A donor-advised fund can absorb gain from a property sale if timed with a charitable deduction. Requires attorney, CPA, and financial adviser coordination. Source: Rojeck, Wealth (2019) Ch. 2 · Hallman & Rosenbloom (9th ed. 2014) Ch. 27.',
    },
  },
]

const EXPOSURE_QUESTIONS = [
  {
    id: 'prof',
    text: 'Are you a physician, surgeon, dentist, attorney, contractor, real estate developer, or do you serve on a corporate or nonprofit board of directors?',
    riskLabel: 'High-Liability Profession',
    riskNote:
      "In Florida, licensed professionals — physicians, surgeons, dentists, attorneys, architects, engineers — practice under entities (PLLC or PA) that do not eliminate personal liability for their own professional negligence. Florida Statute §621.07 preserves full personal malpractice liability regardless of entity form. The entity protects you from business creditors. It does not protect you from your own professional errors. Professional liability insurance (with adequate limits and tail coverage) is the only layer that addresses this exposure directly. For board members: directors and officers face personal liability for certain corporate actions, which is why D&O insurance exists. Source: Gassman & Markham (2025 ed.) Ch. 1 · Fla. Stat. §621.07.",
    calibration: CALIBRATION_SYSTEM.INSURANCE,
    followUp:
      'Does your professional liability include tail coverage, and do you carry a personal umbrella policy of at least $2M?',
    inverted: false,
    core: true,
  },
  {
    id: 'smllc',
    text: 'Do you own any LLC, company, or real estate investment by yourself, with no other owner or partner?',
    riskLabel: 'Single-Member LLC Exposure',
    riskNote:
      "Under Florida Statute §605.0503(4), a charging order — the standard creditor remedy against an LLC owner's interest — is not the 'sole and exclusive remedy' for judgment creditors of a single-member LLC. In plain English: a creditor who wins a judgment against you personally may be able to ask a court to hand over your entire ownership interest in that single-member LLC. In a multi-member LLC, this is prevented under §605.0503(6) — the foreclosure remedy is simply not available. The Florida Supreme Court confirmed this distinction in Olmstead v. FTC (2010). Gassman & Markham state directly: 'Single-member LLC ownership offers no substantive protection from a charging order standpoint under Florida law.' The fix is adding a genuine second member. Source: Gassman & Markham (2025 ed.) Ch. 1.",
    calibration: CALIBRATION_SYSTEM.ENTITIES,
    followUp:
      'Is this primarily an operating business or a real estate holding? The appropriate structure differs.',
    inverted: false,
    core: true,
  },
  {
    id: 'homestead',
    text: "Is your Florida primary residence titled in an LLC, in a trust created in another state, or in only one spouse's name when you are married?",
    riskLabel: 'Homestead Protection at Risk',
    riskNote:
      "Article X, Section 4 of the Florida Constitution provides unlimited creditor protection for your primary residence — there is no dollar cap. The Florida Supreme Court has described this as 'almost supernatural protection.' But this protection disappears entirely the moment the property is titled to an LLC. It is replaced by the LLC's charging-order protection, which is weaker and can be defeated by domestic creditors. The property tax Save Our Homes cap — which limits annual assessment increases to 3% for homesteaded property — is also lost. An out-of-state trust creates a different problem: Florida's homestead devise restrictions (Fla. Stat. §732.4015) restrict how you can leave the homestead to your heirs, and an out-of-state trust may not be drafted to comply with these rules. Note: a properly drafted Florida revocable trust does protect the homestead — Florida appellate courts have confirmed this repeatedly. Source: Gassman & Markham (2025 ed.) Ch. 5.",
    calibration: CALIBRATION_SYSTEM.TITLING,
    followUp:
      'When did a Florida-licensed estate attorney last review how your residence is titled?',
    inverted: false,
    core: true,
  },
  {
    id: 'tbe',
    text: "If you are married, are your primary bank and brokerage accounts titled jointly with your spouse with the phrase 'tenants by the entireties' in the account agreement?",
    riskLabel: 'TBE Account Titling',
    riskNote:
      "'Tenancy by the entireties' (TBE) is a form of joint ownership that Florida law makes available only to married couples. When a bank or brokerage account is properly titled as TBE, a judgment creditor of only one spouse cannot reach that account. The protection applies to individual creditors — it does not protect against joint debts that both spouses owe together. The Florida Supreme Court confirmed this protection for personal property accounts in Beal Bank, SSB v. Almand & Associates (2001), and the court extended it further in Loumpos v. Bank One (Fla. Dec. 2025). The critical point: TBE protection requires that the account agreement actually use the phrase 'tenants by the entireties' or its equivalent. Many joint accounts opened at brokerage firms default to 'joint tenants with right of survivorship' (JTWROS) — which is joint ownership but does NOT carry the same creditor protection. Source: Gassman & Markham (2025 ed.) Ch. 2.",
    calibration: CALIBRATION_SYSTEM.TITLING,
    followUp:
      'Have you confirmed this in writing with your financial institution?',
    inverted: true,
    core: true,
  },
  {
    id: 'beneficiary',
    text: 'Has any beneficiary designation on a 401(k), IRA, life insurance policy, or annuity gone unchanged through a marriage, divorce, birth of a child, or death of a named beneficiary?',
    riskLabel: 'Beneficiary Designation Override',
    riskNote:
      "This is one of the most consequential and most overlooked planning gaps in American estate planning. A beneficiary designation on a retirement account (IRA, 401k, 403b, pension), life insurance policy, or annuity is a legally binding contract that supersedes your will, your trust, and every other estate planning document you have ever signed. The U.S. Supreme Court confirmed this in Kennedy v. Plan Administrator for DuPont (2009).\n\nCommon disasters: a former spouse inheriting a $400,000 IRA because the designation was never updated after divorce. A deceased parent named as primary beneficiary, causing the account to flow to 'my estate' and go through probate. An adult child inheriting a large retirement account at peak earning years, forced by the 10-year rule under SECURE 2.0 (IRC §401(a)(9)(H)) to distribute the entire account within 10 years of the original owner's death — potentially all taxed at the 37% federal bracket.\n\nUnder current law, most non-spouse beneficiaries of inherited IRAs cannot stretch distributions over their lifetime. They must empty the account within 10 years. If the original owner died after their required beginning date, the beneficiary must also take annual distributions during the first nine years. Source: Choate, Estate Planning for Retirement Benefits (Sept 2025 outline), Part 3.",
    calibration: CALIBRATION_SYSTEM.TITLING,
    followUp:
      'Which accounts are affected, and when were they last formally reviewed?',
    inverted: false,
    core: true,
  },
  {
    id: 'umbrella',
    text: 'Do you carry a personal umbrella liability policy — and does it have limits of at least $1M for every $1M in your estimated net worth?',
    riskLabel: 'Insurance Layer Gap',
    riskNote:
      "An umbrella liability policy is the first line of defense and the only layer that pays for your legal defense costs — attorney fees, expert witnesses, court costs, the cost of a defense — before any other protection is tested. Without it, a single automobile accident, slip-and-fall on your property, or social host liability claim can consume your savings, your investment accounts, and your business equity while your attorney fights in court.\n\nTwo sizing rules of thumb: (1) At minimum, $1M of umbrella coverage for every $1M in estimated net worth. (2) Your underlying auto liability policy must meet the umbrella's required minimum (typically 250/500/100). If your auto policy carries only 100/300, there is a coverage gap between where your auto ends and where your umbrella begins — in that gap, you pay personally.\n\nAnnual umbrella premiums for $2M–$5M in coverage typically cost $300–$600 per year — one of the most cost-effective risk management purchases available. Source: Gassman & Markham (2025 ed.) Ch. 1.\n\nRojeck emphasizes that 'no financial plan should be considered complete without an asset protection plan incorporating sound personal and business practices, insurance, and careful entity selection' — and that insurance is always the first element, not the last. Evensky and Horan's wealth management framework treats insurance as a core component of the life balance sheet — an implied liability that must be addressed before any meaningful asset allocation work can begin. Hallman and Rosenbloom call this the 'large-loss principle': in buying insurance, the primary emphasis should be on risks that could wipe out or substantially deplete net worth. An underinsured umbrella is the most common version of this failure. Sources: Rojeck, Wealth (2019) Ch. 5 · Evensky et al., The New Wealth Management (2011) Ch. 1 · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 20.",
    calibration: CALIBRATION_SYSTEM.INSURANCE,
    followUp:
      'Does your auto policy meet the underlying limit requirements of an umbrella (typically 250/500/100)?',
    inverted: true,
    core: true,
  },
  {
    id: 'buysell',
    text: 'If you own a business with one or more partners, has your buy-sell agreement been reviewed by counsel since June 2024?',
    riskLabel: 'Buy-Sell Exposure Post-Connelly',
    riskNote:
      "In Connelly v. United States (144 S. Ct. 1406, June 2024), the U.S. Supreme Court held 9-0 that life insurance proceeds received by a corporation to fund a stock redemption must be included in calculating the corporation's fair market value for estate tax purposes — and are NOT offset by the redemption obligation. In plain English: if your business owns a life insurance policy on you and uses the proceeds to buy back your shares from your estate, the IRS now includes those insurance proceeds in the business's value. This can significantly increase the estate tax exposure for your heirs. Most entity-purchase buy-sell agreements (where the company owns the policy) drafted before June 2024 were structured assuming the offset — which the Supreme Court has now said is not available. Cross-purchase agreements (where the co-owners own policies on each other) are generally not affected, but create their own administrative challenges at scale. Any buy-sell with entity-owned insurance requires immediate review. Source: Gassman & Markham (2025 ed.) Ch. 1.",
    calibration: CALIBRATION_SYSTEM.ENTITIES,
    inverted: true,
    core: false,
    conditionalOn: (answers) => answers.prof === 'yes' || answers.smllc === 'yes',
  },
  {
    id: 'disability_income',
    text: 'Do you own an individual own-occupation disability income policy — not just group coverage through your employer or professional association?',
    riskLabel: 'Human Capital Unprotected',
    riskNote:
      "Your ability to earn income is almost certainly the largest asset on your personal balance sheet — particularly early in your career. Evensky and Horan, in The New Wealth Management (CFA Institute, 2011), describe human capital as the present value of all future earnings from employment, and identify it as typically the dominant asset for working professionals. A 35-year-old physician earning $500,000 per year with 30 years remaining has over $15 million in human capital. An own-occupation disability income policy protects that asset.\n\nGroup disability coverage through an employer or professional association typically covers only 60% of base salary up to a monthly cap, excludes bonus and partnership distributions, is taxable as ordinary income when employer-paid, and terminates when you leave the employer. Individual own-occupation policies — purchased directly from a carrier and owned by you — are portable, non-cancellable, and can be structured to cover your total compensation including variable income.\n\nThe critical feature is the definition of disability. An 'own-occupation' definition pays benefits if you cannot perform the specific duties of your own occupation — even if you could theoretically work in another field. An 'any-occupation' definition pays only if you cannot work in any gainful employment. A surgeon who loses fine motor function receives benefits under own-occupation and potentially nothing under any-occupation.\n\nSource: Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 22, 30 · Evensky et al., The New Wealth Management (CFA Institute, 2011) Ch. 1 (human capital as the dominant asset).",
    calibration: CALIBRATION_SYSTEM.INSURANCE,
    followUp:
      'Does your current group disability coverage follow you if you change employers — and have you confirmed whether it uses an own-occupation or any-occupation definition of disability?',
    inverted: true,
    core: false,
    conditionalOn: (answers) => answers.prof === 'yes',
  },
  {
    id: 'trustfunding',
    text: 'If you have a revocable trust, have you confirmed in the past 24 months that every account, real estate parcel, and business interest you own is actually titled to the trust?',
    riskLabel: 'Unfunded Trust',
    riskNote:
      "A revocable living trust only controls assets that are legally titled to it. Signing the trust document creates the legal structure. Funding the trust means actually re-titling your assets — changing the name on your brokerage account from 'John Smith' to 'John Smith, Trustee of the John Smith Revocable Trust dated January 1, 2024.' Re-deeding real estate. Assigning business interests. Changing the ownership on other accounts.\n\nUntil this re-titling happens, those assets go through Florida probate (Chapter 733 of the Florida Statutes) — a public court process — regardless of what your trust document says. The trust controls only what is in its name.\n\nThe most common scenario: a client signed a trust seven years ago, has opened three new brokerage accounts since then, and none of them are titled to the trust. The trust controls the old accounts. The new accounts go through public probate. Pfau notes in the Retirement Planning Guidebook that trust funding 'provides survivors with sufficient access while simplifying the probate process.' Source: Gassman & Markham (2025 ed.) Ch. 5 · Pfau, Retirement Planning Guidebook (2021) Ch. 11.",
    calibration: CALIBRATION_SYSTEM.FUNDING,
    inverted: true,
    core: false,
    conditionalOn: (answers) => Boolean(answers.beneficiary),
  },
  {
    id: 'investment_governance',
    text: 'Has your financial adviser provided you with a written Investment Policy Statement — a document that defines your financial goals, your asset allocation targets, and the rules governing how your portfolio is managed?',
    riskLabel: 'No Investment Governance Document',
    riskNote:
      "An Investment Policy Statement (IPS) is the governing document of your portfolio — the written agreement between you and your adviser that defines what you are trying to accomplish financially, how your assets should be allocated to achieve it, what level of risk is appropriate, and the rules that govern every investment decision. Every pension fund, university endowment, and institutional investor operates under an IPS. Most individual investors — including most high-net-worth families — have never seen one.\n\nEvensky, Horan and Robinson, in The New Wealth Management (CFA Institute, 2011), identify the IPS as the foundational document of every wealth management engagement — 'the document that all other decisions flow from.' Without one, your adviser is managing your portfolio against an unstated and possibly inconsistent set of objectives. Without one, when a market decline of 30% occurs, there is no document establishing that you agreed to accept equity volatility in exchange for long-term growth — and no document protecting you from an emotional decision to sell at the worst moment.\n\nThe IPS also documents the life balance sheet framework: not just your financial assets but the complete picture of your human capital (present value of future earnings), your financial capital, and your implied liabilities (present value of retirement spending needs and other obligations). Without this complete picture, your portfolio allocation may be systematically wrong for your actual financial situation.\n\nSource: Evensky, Horan & Robinson, The New Wealth Management (CFA Institute, 2011) Ch. 4, 13 · Hallman & Rosenbloom, Private Wealth Management (9th ed. 2014) Ch. 9.",
    calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    followUp:
      'Have you had a comprehensive conversation with your financial adviser about your goals, your fears, your time horizon, and what a successful financial life looks like to you — and has that conversation produced any written document?',
    inverted: true,
    core: false,
    conditionalOn: (answers) =>
      Boolean(answers.smllc) || Boolean(answers.umbrella),
  },
]

const PROFILE_TIERS = [
  {
    min: 0,
    max: 1,
    color: '#1A4A2E',
    label: 'Foundational Profile',
    tagline: 'Your structure aligns with Florida defaults.',
    text: 'Your responses indicate no immediately critical gaps. The highest-leverage next step is typically a coordination review — confirming that your attorney, CPA, and financial advisor share a current picture of your situation.',
  },
  {
    min: 2,
    max: 4,
    color: '#7A5A1A',
    label: 'Elevated Profile',
    tagline: 'Two or more structural gaps identified.',
    text: 'Your responses indicate structural gaps that Florida practitioners commonly identify and address. The calibrated path starts with the simplest, least-invasive correction first.',
  },
  {
    min: 5,
    max: Number.POSITIVE_INFINITY,
    color: '#8B2020',
    label: 'Critical Profile',
    tagline: 'Multiple compounding exposures identified.',
    text: 'Your responses indicate multiple layered gaps. Priority: immediate insurance review and titling corrections — before any discussion of advanced structures. The calibrated path starts at the foundation, not the top.',
  },
]

function tint(color, alphaHex = '18') {
  return `${color}${alphaHex}`
}

function getGapKey(selection) {
  if (selection.length === 0) return 'none'
  const sorted = [...selection].sort().join('')
  if (sorted === 'a') return 'a_only'
  if (sorted === 'c') return 'c_only'
  if (sorted === 'f') return 'f_only'
  if (sorted === 'i') return 'i_only'
  return sorted
}

function isRisky(question, answer) {
  if (!answer) return false
  if (question.inverted) return answer === 'no'
  return answer === 'yes'
}

function ToolDisclaimer() {
  return <p className="strategy-lab__tool-disclaimer">{MASTER_DISCLAIMER}</p>
}

function LayerSituationSection({ layerId }) {
  const subItems = LAYER_SITUATION_SUBITEMS[layerId]
  const [openItem, setOpenItem] = useState(null)

  if (!subItems?.length) return null

  return (
    <div className="strategy-lab__situation">
      <p className="strategy-lab__situation-label">
        WHAT THIS MEANS FOR YOUR SITUATION
      </p>
      {subItems.map((item) => {
        const isOpen = openItem === item.label
        return (
          <div key={item.label} className="strategy-lab__situation-item">
            <button
              type="button"
              className="strategy-lab__situation-header"
              onClick={() =>
                setOpenItem(isOpen ? null : item.label)
              }
              aria-expanded={isOpen}
            >
              <span>{item.label}</span>
              <span className="strategy-lab__situation-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen ? (
              <div className="strategy-lab__situation-body">{item.content}</div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function CoordinationGapTool() {
  const [selected, setSelected] = useState([])
  const [expandedCard, setExpandedCard] = useState(null)

  const key = getGapKey(selected)
  const cards = GAP_CARD_DATA[key] || []

  const toggleProfessional = (id) => {
    setExpandedCard(null)
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id].sort()
    )
  }

  return (
    <section className="strategy-lab__tool-shell">
      <div className="strategy-lab__selector-row">
        {PROFESSIONALS.map((pro) => {
          const active = selected.includes(pro.id)
          return (
            <button
              key={pro.id}
              type="button"
              className={`strategy-lab__circle-toggle ${active ? 'is-active' : ''}`}
              onClick={() => toggleProfessional(pro.id)}
            >
              <span>{pro.emoji}</span>
              <span>{pro.label}</span>
              {pro.sublabel ? (
                <span className="strategy-lab__circle-sublabel">{pro.sublabel}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="strategy-lab__venn-wrap" aria-hidden="true">
        <svg width="280" height="180" viewBox="0 0 280 180">
          <circle
            cx="90"
            cy="58"
            r="42"
            fill={selected.includes('a') ? '#B08D4C4D' : '#B08D4C26'}
            stroke="#B08D4C"
            strokeWidth="1.5"
            strokeOpacity={selected.includes('a') ? 1 : 0.3}
          />
          <circle
            cx="190"
            cy="58"
            r="42"
            fill={selected.includes('c') ? '#C9A96E4D' : '#C9A96E26'}
            stroke="#C9A96E"
            strokeWidth="1.5"
            strokeOpacity={selected.includes('c') ? 1 : 0.3}
          />
          <circle
            cx="90"
            cy="122"
            r="42"
            fill={selected.includes('f') ? '#8A9BB04D' : '#8A9BB026'}
            stroke="#8A9BB0"
            strokeWidth="1.5"
            strokeOpacity={selected.includes('f') ? 1 : 0.3}
          />
          <circle
            cx="190"
            cy="122"
            r="42"
            fill={selected.includes('i') ? '#8A9BB04D' : '#8A9BB026'}
            stroke="#8A9BB0"
            strokeWidth="1.5"
            strokeOpacity={selected.includes('i') ? 1 : 0.3}
          />
          <text x="78" y="62" className="strategy-lab__venn-letter">
            A
          </text>
          <text x="178" y="62" className="strategy-lab__venn-letter">
            C
          </text>
          <text x="78" y="126" className="strategy-lab__venn-letter">
            F
          </text>
          <text x="178" y="126" className="strategy-lab__venn-letter">
            I
          </text>
        </svg>
      </div>

      <div className="strategy-lab__cards">
        {cards.map((card, index) => {
          const cardId = `${key}-${index}`
          const open = expandedCard === cardId
          const teaser = `${card.scenario.slice(0, 90)}...`
          return (
            <article
              key={cardId}
              className={`strategy-lab__gap-card ${open ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="strategy-lab__gap-toggle"
                onClick={() => setExpandedCard(open ? null : cardId)}
              >
                <h3>{card.title}</h3>
                <p>{teaser}</p>
                <span
                  className="strategy-lab__cal-badge"
                  style={{
                    color: card.calibration.color,
                    background: tint(card.calibration.color, '18'),
                    borderColor: tint(card.calibration.color, '66'),
                  }}
                >
                  Step {card.calibration.level}: {card.calibration.label}
                </span>
              </button>
              {open && (
                <div className="strategy-lab__gap-expanded">
                  <p className="strategy-lab__scenario">{card.scenario}</p>
                  <div className="strategy-lab__authority-box">
                    <p className="strategy-lab__label-gold">AUTHORITY</p>
                    <p>{card.authority}</p>
                  </div>
                  <div
                    className="strategy-lab__question-box"
                    style={{ background: tint(card.calibration.color, '10') }}
                  >
                    <p
                      className="strategy-lab__label-gold"
                      style={{ color: card.calibration.color }}
                    >
                      QUESTION TO ASK YOUR TEAM
                    </p>
                    <p>{card.question}</p>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <ToolDisclaimer />
    </section>
  )
}

function WealthArchitectureTool() {
  const [expandedLayers, setExpandedLayers] = useState(['layer1'])

  const toggleLayer = (layerId) => {
    setExpandedLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((item) => item !== layerId)
        : [...prev, layerId]
    )
  }

  return (
    <section className="strategy-lab__tool-shell">
      <div className="strategy-lab__layers">
        {ARCHITECTURE_LAYERS.map((layer) => {
          const open = expandedLayers.includes(layer.id)
          return (
            <article
              key={layer.id}
              className={`strategy-lab__layer ${open ? 'is-open' : ''}`}
              style={{ borderLeftColor: layer.color }}
            >
              <button
                type="button"
                className="strategy-lab__layer-head"
                onClick={() => toggleLayer(layer.id)}
              >
                <div>
                  <h3>{layer.name}</h3>
                  <p>{layer.sublabel}</p>
                </div>
                <span>{open ? '−' : '+'}</span>
              </button>

              {open && (
                <div className="strategy-lab__layer-body">
                  <div className="strategy-lab__layer-field">
                    <p className="strategy-lab__label-mist">WHAT BELONGS HERE</p>
                    <p>{layer.what}</p>
                  </div>
                  <div className="strategy-lab__layer-field">
                    <p className="strategy-lab__label-mist">
                      WHAT IT DEFENDS AGAINST
                    </p>
                    <p>{layer.defends}</p>
                  </div>
                  <div className="strategy-lab__layer-field">
                    <p
                      className="strategy-lab__label-mist"
                      style={{ color: layer.color }}
                    >
                      MOST COMMON FAILURE
                    </p>
                    <p>{layer.failure}</p>
                  </div>
                  <div className="strategy-lab__layer-field">
                    <p className="strategy-lab__label-gold">FLORIDA-SPECIFIC</p>
                    <p>{layer.florida}</p>
                  </div>
                  <div className="strategy-lab__layer-field">
                    <p className="strategy-lab__label-green">CALIBRATION NOTE</p>
                    <p>{layer.calibration}</p>
                  </div>
                  <p className="strategy-lab__authority-pill">{layer.authority}</p>
                  {layer.retirementArchitecture ? (
                    <div className="strategy-lab__layer-field">
                      <p className="strategy-lab__label-gold">
                        RETIREMENT ASSET ARCHITECTURE
                      </p>
                      <p>{layer.retirementArchitecture}</p>
                    </div>
                  ) : null}
                  <LayerSituationSection layerId={layer.id} />
                </div>
              )}
            </article>
          )
        })}
      </div>

      <ToolDisclaimer />
    </section>
  )
}

function AssetExposureTool({ onOpenCoordinationGap }) {
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const visibleQuestions = useMemo(
    () =>
      EXPOSURE_QUESTIONS.filter(
        (question) => !question.conditionalOn || question.conditionalOn(answers)
      ),
    [answers]
  )
  const coreQuestions = EXPOSURE_QUESTIONS.filter((question) => question.core)
  const coreAnswered = coreQuestions.every((question) => Boolean(answers[question.id]))
  const answeredCount = visibleQuestions.filter((q) => Boolean(answers[q.id])).length
  const currentQuestion = visibleQuestions.find((q) => !answers[q.id])

  const riskyQuestions = visibleQuestions.filter((question) =>
    isRisky(question, answers[question.id])
  )
  const riskyCount = riskyQuestions.length
  const tier = PROFILE_TIERS.find(
    (item) => riskyCount >= item.min && riskyCount <= item.max
  )
  const sortedRisks = [...riskyQuestions].sort(
    (a, b) => a.calibration.level - b.calibration.level
  )

  const answerQuestion = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const reset = () => {
    setAnswers({})
    setShowResult(false)
  }

  return (
    <section className="strategy-lab__tool-shell">
      {!showResult ? (
        <div className="strategy-lab__diagnostic">
          <p className="strategy-lab__diagnostic-progress">
            Question {Math.min(answeredCount + 1, visibleQuestions.length)} of{' '}
            {visibleQuestions.length}
          </p>
          {currentQuestion ? (
            <div className="strategy-lab__question-card">
              <h3>{currentQuestion.text}</h3>
              <div className="strategy-lab__yesno">
                <button
                  type="button"
                  onClick={() => answerQuestion(currentQuestion.id, 'yes')}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => answerQuestion(currentQuestion.id, 'no')}
                >
                  NO
                </button>
              </div>
            </div>
          ) : (
            <div className="strategy-lab__question-card is-complete">
              <h3>Core diagnostic complete.</h3>
              <p>
                Your responses are ready for profile generation. Results are ordered
                from the simplest correction first.
              </p>
            </div>
          )}
          {coreAnswered ? (
            <button
              type="button"
              className="strategy-lab__view-result"
              onClick={() => setShowResult(true)}
            >
              View Your Exposure Profile
            </button>
          ) : null}
        </div>
      ) : (
        <div className="strategy-lab__results">
          <div
            className="strategy-lab__tier-badge"
            style={{ color: tier.color, borderColor: tier.color }}
          >
            <p>{tier.label}</p>
            <span>{tier.tagline}</span>
          </div>
          <div className="strategy-lab__divider" />
          <p className="strategy-lab__tier-text">{tier.text}</p>
          <h3 className="strategy-lab__result-head">
            Identified Exposures - Addressed Simplest First
          </h3>
          <div className="strategy-lab__risk-list">
            {sortedRisks.map((risk) => (
              <article
                key={risk.id}
                className="strategy-lab__risk-card"
                style={{ borderLeftColor: risk.calibration.color }}
              >
                <h4>{risk.riskLabel}</h4>
                <span
                  className="strategy-lab__cal-badge"
                  style={{
                    color: risk.calibration.color,
                    background: tint(risk.calibration.color, '18'),
                    borderColor: tint(risk.calibration.color, '66'),
                  }}
                >
                  Step {risk.calibration.level}: {risk.calibration.label}
                </span>
                <p>{risk.riskNote}</p>
                {risk.followUp && (
                  <p
                    className="strategy-lab__risk-follow"
                    style={{ background: tint(risk.calibration.color, '10') }}
                  >
                    {risk.followUp}
                  </p>
                )}
              </article>
            ))}
          </div>
          <div className="strategy-lab__cross-tool">
            <p className="strategy-lab__cross-tool-eyebrow">TAKE THE NEXT STEP</p>
            <h4 className="strategy-lab__cross-tool-heading">
              See Where These Gaps Live
            </h4>
            <p className="strategy-lab__cross-tool-body">
              The exposures identified above don&apos;t exist in isolation. They exist
              because the professionals who could address them — your attorney, your
              CPA, your financial adviser, your insurance specialist — are working from
              separate pictures of your situation rather than a shared one. The
              Coordination Gap Visualizer maps exactly which gaps exist between the
              advisers you currently have.
            </p>
            <button
              type="button"
              className="strategy-lab__cross-tool-btn"
              onClick={onOpenCoordinationGap}
            >
              Open the Coordination Gap Visualizer →
            </button>
          </div>
          <a className="strategy-lab__cta" href="/#contact">
            Initiate a Conversation →
          </a>
          <p className="strategy-lab__mini-disclaimer">
            These results are educational and should be reviewed with licensed
            counsel and tax professionals.
          </p>
          <button type="button" className="strategy-lab__ghost-btn" onClick={reset}>
            Restart Diagnostic
          </button>
        </div>
      )}

      <ToolDisclaimer />
    </section>
  )
}

export default function StrategyLabPage() {
  const [activeTool, setActiveTool] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const toolParam = Number(params.get('tool'))
    if (Number.isInteger(toolParam) && toolParam >= 0 && toolParam <= 2) {
      setActiveTool(toolParam)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>The Strategy Lab | Drexler Wealth Strategy</title>
        <meta
          name="description"
          content="Three educational diagnostic tools built on Florida doctrine. Calibrated to the least invasive, most appropriate next step."
        />
      </Helmet>

      <main className="strategy-lab-page">
        <header className="strategy-lab-page__header">
          <div className="strategy-lab-page__header-inner">
            <p className="strategy-lab-page__eyebrow">
              DREXLER WEALTH STRATEGY · PALM BEACH COUNTY, FL
            </p>
            <h1>The Strategy Lab</h1>
            <p className="strategy-lab-page__sub">
              Three educational diagnostic tools built on Florida-specific
              doctrine. Every output is calibrated to direct you toward the least
              invasive, most appropriate next step — not the most complex one.
            </p>
            <p className="strategy-lab-page__top-disclaimer">
              These tools are for educational purposes only and do not constitute
              legal, tax, investment, or financial planning advice.
            </p>
          </div>
        </header>

        <div className="strategy-lab-page__tabs-wrap">
          <div className="strategy-lab-page__tabs">
            {TOOL_TABS.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`strategy-lab-page__tab ${activeTool === index ? 'is-active' : ''}`}
                onClick={() => setActiveTool(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="strategy-lab-page__tool-column">
          {activeTool === 0 && <CoordinationGapTool />}
          {activeTool === 1 && <WealthArchitectureTool />}
          {activeTool === 2 && (
            <AssetExposureTool onOpenCoordinationGap={() => setActiveTool(0)} />
          )}
        </div>
      </main>
    </>
  )
}
