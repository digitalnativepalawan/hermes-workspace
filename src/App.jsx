import { HermesAgentSection } from './components/HermesAgentSection';
import { AdminTrigger } from './components/AdminPanel';

export default function App() {
  return (
    <main className="min-h-screen">
      <HermesAgentSection />
      <AdminTrigger />
    </main>
  );
}