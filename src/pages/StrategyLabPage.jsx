import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
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
]

const GAP_CARD_DATA = {
  none: [
    {
      title: 'No Professional Coordination',
      scenario:
        "You are your own coordinator. Florida's asset protection framework — Article X §4, the Olmstead decision, Connelly v. United States (2024) — operates by default, and default is rarely optimal for someone with meaningful assets.",
      authority: 'Fla. Const. Art. X §4 · Fla. Stat. §222.14 · Olmstead v. FTC',
      question:
        'Do any of your bank or brokerage accounts carry a tenancy by the entireties designation if you are married?',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
  ],
  f_only: [
    {
      title: 'Portfolio Without a Plan',
      scenario:
        'Your advisor manages investments but cannot draft documents, verify account titling, or confirm beneficiary designations match estate intent. The IRA beneficiary designation overrides your will by contract.',
      authority: 'Egelhoff v. Egelhoff, 532 U.S. 141 (2001) · ERISA §514',
      question:
        'When did you last review every beneficiary designation on your IRAs, 401(k), life insurance, and annuity accounts?',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
  ],
  a_only: [
    {
      title: 'Trust Without Funding',
      scenario:
        "A signed revocable trust that doesn't own your brokerage account, real estate, or business interest is paper and ink. The trust controls only what is titled to it.",
      authority: 'Fla. Stat. §736.0401 · §736.0801',
      question:
        'Has every account and property you own been re-titled to reflect your trust as owner?',
      calibration: CALIBRATION_SYSTEM.FUNDING,
    },
  ],
  c_only: [
    {
      title: 'Tax Returns Without Estate Coordination',
      scenario:
        'Your CPA files accurately but does not design asset titling, draft documents, or monitor beneficiary designations. Basis step-up strategy at death requires coordination between the return and the plan.',
      authority: 'IRC §1014 (step-up in basis)',
      question:
        'Does your CPA know how your assets are titled and who inherits?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  af: [
    {
      title: 'Gift Tax Compliance Gap',
      scenario:
        'Attorney drafted an ILIT and advisor placed the policy inside. If annual Crummey notices were not sent within 30 days of each premium, those premiums may have consumed lifetime exemption, not annual exclusion.',
      authority: 'IRC §2503(b) · Rev. Rul. 81-7',
      question:
        'Has your attorney confirmed Crummey notices were sent each year?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
    {
      title: 'Missing CPA on Roth Conversion',
      scenario:
        'Advisor models a Roth conversion. Income stacks with other income in the conversion year. Without CPA coordination, the tax cost may exceed the long-term benefit.',
      authority: 'IRC §408A · Reg. §1.408A-4',
      question:
        'Does your CPA model Roth conversion years with your advisor before execution?',
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
        'Attorney drafted the buy-sell, CPA reviewed tax treatment. But if no advisor confirmed life insurance funding actually exists and is sufficient, the agreement is a promise, not a guarantee.',
      authority: 'Connelly v. United States, 144 S. Ct. 1406 (2024)',
      question: 'Has your buy-sell been reviewed by counsel since June 2024?',
      calibration: CALIBRATION_SYSTEM.ENTITIES,
    },
  ],
  cf: [
    {
      title: 'Beneficiary Designations Override the Return',
      scenario:
        'CPA and advisor optimize tax-efficient withdrawals. But if the IRA beneficiary is an ex-spouse or deceased parent, neither the return nor the portfolio can fix it. Designations supersede the will by contract.',
      authority: 'Kennedy v. Plan Administrator, 555 U.S. 285 (2009)',
      question:
        'Have you named a contingent beneficiary on every retirement account and life insurance policy?',
      calibration: CALIBRATION_SYSTEM.TITLING,
    },
    {
      title: 'No Estate Documents',
      scenario:
        "Advisor manages the portfolio and CPA optimizes taxes, but there is no will, no trust, no durable POA, no healthcare surrogate. Florida's intestacy statute decides who inherits.",
      authority: 'Fla. Stat. §732.102 · §765.202',
      question:
        'Do you have a current will or revocable trust, durable POA, and healthcare surrogate under Florida law?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
  acf: [
    {
      title: 'The Integration Gap',
      scenario:
        'You have all three. The most common gap at this level is not what any one of them does — it is that they have never met together. A quarterly coordination call prevents the most expensive planning errors.',
      authority:
        'Comiter Singer (Palm Beach Gardens) on integrated advisory teams',
      question:
        'In the past 12 months, have your attorney, CPA, and advisor spoken directly to each other about your situation without you as relay?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
    {
      title: 'Out-of-State Documents, Florida Assets',
      scenario:
        'Many PBC residents arrived with estate documents drafted under New York, New Jersey, or Illinois law. Florida has distinct homestead rules, trust code (Ch. 736), and no state estate tax. Out-of-state documents may not reflect Florida’s protective framework.',
      authority: 'Fla. Const. Art. X §4 · Fla. Stat. §732.4015 · Ch. 736',
      question:
        'Were your estate documents drafted by a Florida-licensed attorney after you established Florida residency?',
      calibration: CALIBRATION_SYSTEM.DOCUMENTS,
    },
  ],
}

const ARCHITECTURE_PROFILES = [
  'Business Owner',
  'Professional Practice',
  'Real Estate Investor',
  'HNW Family',
]

const ARCHITECTURE_LAYERS = [
  {
    id: 'layer1',
    name: 'Insurance Layer',
    sublabel: 'First Line of Defense',
    color: '#1A4A2E',
    what: "Personal umbrella ($2M–$25M+ depending on net worth and exposures), professional liability, commercial general liability, personal auto minimum 250/500/100 underlying, homeowner's at $300K+ personal liability.",
    defends:
      'Insurance is the only layer that pays for defense costs before any other protection is tested. A judgment that exhausts your insurance is the only judgment that ever reaches your other assets.',
    failure:
      'The most common failure: umbrella limits set years ago and never increased as net worth grew — or umbrella policies requiring 250/500 underlying auto limits while the auto policy carries only 100/300.',
    florida:
      'Florida has no cap on personal injury jury verdicts. Palm Beach County juries are statistically among the highest-verdict counties in Florida.',
    calibration:
      'START HERE. Every other layer assumes a properly sized insurance layer. If it does not exist, no other planning is complete.',
    authority: 'Fla. Stat. §627.727',
    profileNotes: {
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
    sublabel: 'Constitutional & Statutory Bedrock',
    color: '#1A4A35',
    what: 'Homestead (Art. X §4, unlimited value, 1/2-acre municipal / 160-acre rural), tenancy by the entireties accounts (Beal Bank presumption, Loumpos Dec. 2025), retirement accounts (§222.21, unlimited), life insurance cash value and annuity proceeds (§222.14), head-of-household wages (§222.11).',
    defends:
      'Protected by the Florida Constitution and statutes — no judgment creditor can reach them, regardless of judgment amount, as long as properly titled.',
    failure:
      'Deeding the homestead into an LLC removes constitutional protection and replaces it with charging-order protection — which is weaker. Per Olmstead v. FTC (Fla. 2010), this risk is acute for single-member LLCs.',
    florida:
      "Florida's homestead protection is absolute — no dollar cap. The strongest homestead protection of any U.S. state.",
    calibration:
      'These protections are automatic if assets are correctly titled. Fixing titling costs nothing and requires no attorney for most assets. The second step after insurance.',
    authority:
      'Fla. Const. Art. X §4 · Fla. Stat. §§222.11, 222.14, 222.21 · Beal Bank v. Almand (Fla. 2001) · Loumpos v. Bank One (Fla. Dec. 2025)',
    profileNotes: {
      all: 'Check: Is your primary residence titled in your individual name or jointly as TBE? Not in an LLC or out-of-state trust?',
    },
  },
  {
    id: 'layer3',
    name: 'Trust Layer',
    sublabel: 'Probate Avoidance & Transfer Architecture',
    color: '#3A3010',
    what: 'Revocable living trust (probate avoidance, incapacity planning — no creditor protection during life), pour-over will, durable power of attorney, healthcare surrogate. ILIT for life insurance death benefit outside taxable estate.',
    defends:
      'Revocable trust governs estate disposition without probate and provides incapacity governance. ILIT keeps insurance outside your taxable estate and, if properly structured, outside the reach of your creditors.',
    failure:
      'A signed trust that does not own your brokerage accounts, real estate, or business interests is a document, not a plan. Trust funding is the step most often skipped.',
    florida:
      'Florida probate (Ch. 733) is public record. A funded revocable trust avoids it entirely. Florida does not recognize self-settled DAPTs — you cannot shield assets from your own creditors by naming yourself a beneficiary of a trust you create.',
    calibration:
      'Step three — after insurance and after titling. For most people, a funded revocable trust with correct beneficiary designations is the complete solution. Advanced structures come much later.',
    authority:
      'Fla. Stat. Ch. 736 (Trust Code) · Ch. 733 (Probate) · §765.202 · IRC §2042 (ILIT estate inclusion rule)',
    profileNotes: {
      'HNW Family':
        'If you have an ILIT: confirm Crummey notices were sent within 30 days of each premium payment. This is the most commonly overlooked compliance item in irrevocable trust administration.',
      'Business Owner':
        'If you have an ILIT: confirm Crummey notices were sent within 30 days of each premium payment. This is the most commonly overlooked compliance item in irrevocable trust administration.',
    },
  },
  {
    id: 'layer4',
    name: 'Entity Layer',
    sublabel: 'Business & Investment Segregation',
    color: '#5A2010',
    what: 'Multi-member operating LLC or PLLC (licensed professionals), separate holding LLC for real estate and investment assets leased to the operating entity.',
    defends:
      'A properly maintained multi-member LLC limits the charging-order remedy as the exclusive remedy for outside creditors — meaning a creditor who wins a judgment against you personally cannot seize LLC assets.',
    failure:
      'A single-member Florida LLC does not receive charging-order exclusivity. Per Olmstead v. FTC, 44 So. 3d 76 (Fla. 2010), a court may order the owner to surrender their entire membership interest. Fix: add a genuine second member.',
    florida:
      'Fla. Stat. §605.0503 provides charging-order exclusivity for multi-member LLCs. §621.07 preserves full personal malpractice liability regardless of entity form for licensed professionals.',
    calibration:
      'Step five — relevant only when insurance, titling, estate documents, and trust funding are already in place. For most families, entity structure is not the priority. Start with the layers below.',
    authority:
      'Fla. Stat. §605.0503 · §621.07 · Olmstead v. FTC (Fla. 2010)',
    profileNotes: {
      'Business Owner':
        'Multi-member operating LLC + separate holding LLC. Single-member LLCs do not receive FL charging-order exclusivity per Olmstead.',
      'Professional Practice':
        'PLLC or PA for the practice. Holding LLC for equipment owned separately and leased to the practice entity.',
      'Real Estate Investor':
        'Separate multi-member LLC per property or cluster, owned by common holding company. Eliminates cross-contamination of liability between properties.',
    },
  },
  {
    id: 'layer5',
    name: 'Advanced Planning Layer',
    sublabel: 'Irrevocable Structures & Transfer Strategies',
    color: '#8B2020',
    what: 'Spousal Lifetime Access Trust (SLAT), Grantor Retained Annuity Trust (GRAT), Charitable Remainder Trust (CRT), ILIT, family limited partnership, domestic asset protection trust in favorable jurisdictions.',
    defends:
      'These structures remove assets from the taxable estate, protect from future creditors (third-party irrevocable trusts only), or shift appreciation out of the estate during lifetime. They are permanent once implemented.',
    failure:
      "Self-settled structures fail if created to hinder, delay, or defraud creditors. Florida's UVTA (Ch. 726) allows unwinding up to 4 years post-transfer. Timing and solvency at transfer are critical.",
    florida:
      'Florida does not recognize self-settled DAPTs. Structures that work in Nevada, South Dakota, or Alaska do not provide the same protection for Florida residents with Florida assets and Florida creditors.',
    calibration:
      'Step six — appropriate only for individuals with fully funded foundational planning, taxable estates, or specific business succession needs. If layers 1–4 are not in place, advanced planning is premature — full stop.',
    authority:
      'Fla. Stat. Ch. 726 (UVTA) · IRC §§2036, 2038, 2042 · Fla. Stat. §736.0505 (spendthrift provisions)',
    profileNotes: {
      'HNW Family':
        'SLAT or third-party spendthrift trust for next-generation creditor protection. ILIT for life insurance death benefit outside the taxable estate.',
      'Business Owner':
        'Buy-sell reviewed post-Connelly (2024). Business succession plan with insurance-funded mechanism.',
    },
  },
]

const EXPOSURE_QUESTIONS = [
  {
    id: 'prof',
    text: 'Are you a physician, surgeon, dentist, attorney, contractor, real estate developer, or do you serve on a corporate or nonprofit board of directors?',
    riskLabel: 'High-Liability Profession',
    riskNote:
      'Florida §621.07 preserves personal malpractice liability regardless of entity form. Professional liability exposure cannot be fully eliminated by any structure.',
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
      'Under Olmstead v. FTC (Fla. 2010), Florida courts may order a single-member LLC owner to surrender their entire membership interest to satisfy a judgment. Multi-member LLCs receive stronger protection under §605.0503.',
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
      "Florida's homestead exemption (Art. X §4) is unlimited — but disappears if property is titled to an LLC. An out-of-state trust may also fail Florida's homestead devise restrictions, jeopardizing the exemption and the property tax Save Our Homes cap.",
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
      'Under Beal Bank v. Almand (Fla. 2001), confirmed by Loumpos v. Bank One (Fla. Dec. 2025), married spouses may hold accounts as tenants by the entireties — providing protection from individual creditors of either spouse. Requires proper titling.',
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
      "Beneficiary designations supersede your will and your trust by contract. An unchanged designation after a life event may direct assets to an ex-spouse, a deceased parent, or 'my estate' — triggering probate and potentially distributing assets contrary to your intent.",
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
      'An umbrella policy is the first line of defense and the only layer that pays for legal defense costs before any other protection is tested. Without it, a single automobile accident or slip-and-fall can reach every other layer.',
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
      "Connelly v. United States (2024) held 9-0 that life insurance proceeds used to fund a corporate stock redemption are includable in the corporation's estate tax value. Buy-sell agreements funded with entity-owned life insurance drafted before June 2024 may have significant unintended estate tax consequences.",
    calibration: CALIBRATION_SYSTEM.ENTITIES,
    inverted: true,
    core: false,
    conditionalOn: (answers) => answers.prof === 'yes' || answers.smllc === 'yes',
  },
  {
    id: 'trustfunding',
    text: 'If you have a revocable trust, have you confirmed in the past 24 months that every account, real estate parcel, and business interest you own is actually titled to the trust?',
    riskLabel: 'Unfunded Trust',
    riskNote:
      'A signed revocable trust that does not own your assets controls nothing. Trust funding — re-titling accounts, real estate, and business interests to the trustee — is the step most often skipped and least often verified.',
    calibration: CALIBRATION_SYSTEM.FUNDING,
    inverted: true,
    core: false,
    conditionalOn: (answers) => Boolean(answers.beneficiary),
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
            </button>
          )
        })}
      </div>

      <div className="strategy-lab__venn-wrap" aria-hidden="true">
        <svg width="260" height="120" viewBox="0 0 260 120">
          <circle
            cx="80"
            cy="60"
            r="45"
            fill={selected.includes('a') ? '#B08D4C33' : 'transparent'}
            stroke="#B08D4C"
            strokeWidth="1.5"
          />
          <circle
            cx="130"
            cy="60"
            r="45"
            fill={selected.includes('c') ? '#C9A96E30' : 'transparent'}
            stroke="#C9A96E"
            strokeWidth="1.5"
          />
          <circle
            cx="180"
            cy="60"
            r="45"
            fill={selected.includes('f') ? '#8A9BB033' : 'transparent'}
            stroke="#8A9BB0"
            strokeWidth="1.5"
          />
          <text x="58" y="64" className="strategy-lab__venn-letter">
            A
          </text>
          <text x="128" y="64" className="strategy-lab__venn-letter">
            C
          </text>
          <text x="202" y="64" className="strategy-lab__venn-letter">
            F
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
  const [profile, setProfile] = useState(ARCHITECTURE_PROFILES[0])
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
      <div className="strategy-lab__profile-select">
        {ARCHITECTURE_PROFILES.map((item) => (
          <button
            key={item}
            type="button"
            className={`strategy-lab__profile-pill ${profile === item ? 'is-active' : ''}`}
            onClick={() => setProfile(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="strategy-lab__layers">
        {ARCHITECTURE_LAYERS.map((layer) => {
          const open = expandedLayers.includes(layer.id)
          const note = layer.profileNotes[profile] || layer.profileNotes.all
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
                  {note ? <p className="strategy-lab__profile-note">{note}</p> : null}
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

function AssetExposureTool() {
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
          {activeTool === 2 && <AssetExposureTool />}
        </div>
      </main>
    </>
  )
}
