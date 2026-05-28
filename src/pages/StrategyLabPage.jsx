import { Helmet } from 'react-helmet-async'
import './StrategyLabPage.css'
import '../components/tools'
export default function StrategyLabPage() {
  return (
    <>
      <Helmet>
        <title>The Strategy Lab | Drexler Wealth Strategy</title>
        <meta
          name="description"
          content="Three educational diagnostic tools built on Florida doctrine. Calibrated to the simplest appropriate next step."
        />
      </Helmet>

      <main className="strategy-lab section-pad">
        <div className="container">
          <p className="eyebrow">The Strategy Lab</p>
          <h1 className="strategy-lab__headline">
            Three educational diagnostics built on Florida doctrine.
          </h1>
          <p className="strategy-lab__sub">
            Interactive tools are being prepared for Session 2. Return soon for
            the Coordination Gap Visualizer, Wealth Architecture Visualizer, and
            Asset Exposure Profile.
          </p>
        </div>
      </main>
    </>
  )
}
